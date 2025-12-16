import React, { useState, useEffect } from 'react';
import { GachaMachine } from './components/GachaMachine';
import { PrizeModal } from './components/PrizeModal';
import { AdminPanel } from './components/AdminPanel';
import { PrizeImage, SpinResult } from './types';
import { DEFAULT_PRIZES, STORAGE_KEY_HISTORY } from './constants';
import { generateFanMessage } from './services/geminiService';

export default function App() {
  // Use state for prizes to allow updates from URL config
  const [prizes, setPrizes] = useState<PrizeImage[]>(DEFAULT_PRIZES);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [hasPlayedThisMonth, setHasPlayedThisMonth] = useState(false);
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [historyResult, setHistoryResult] = useState<SpinResult | null>(null);

  // Load history and config on mount
  useEffect(() => {
    checkHistory();
    loadConfigFromUrl();
  }, []);

  const getCurrentMonth = () => {
    const now = new Date();
    // Returns format "YYYY-MM" (e.g., "2023-10")
    // This ensures the date updates automatically every month.
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const loadConfigFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. Check for Admin Mode (?admin=true)
    if (params.get('admin') === 'true') {
        setShowAdmin(true);
    }

    // 2. Check for Shared Config (?cfg=...)
    const cfg = params.get('cfg');
    if (cfg) {
      try {
        const decoded = atob(cfg);
        const settings = JSON.parse(decoded);
        
        // Override default prizes with URL settings
        const newPrizes = DEFAULT_PRIZES.map(prize => {
            if (prize.id === 'prize_1' && settings.image1) return { ...prize, url: settings.image1 };
            if (prize.id === 'prize_2' && settings.image2) return { ...prize, url: settings.image2 };
            if (prize.id === 'prize_3' && settings.image3) return { ...prize, url: settings.image3 };
            return prize;
        });
        setPrizes(newPrizes);
      } catch (e) {
        console.error("Failed to load config from URL", e);
      }
    }
  };

  const checkHistory = () => {
    const historyData = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (historyData) {
      const history: SpinResult = JSON.parse(historyData);
      const currentMonth = getCurrentMonth();
      
      // Check if the history date string starts with current YYYY-MM
      // If the month has changed, this returns false, allowing the user to play again.
      if (history.date.startsWith(currentMonth)) {
        setHasPlayedThisMonth(true);
        setHistoryResult(history);
      } else {
        setHasPlayedThisMonth(false);
      }
    }
  };

  const handleSpin = async () => {
    if (hasPlayedThisMonth) return;
    
    setIsSpinning(true);

    // 1. Determine Prize (Random)
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomIndex];

    // 2. Execute animation and data fetching in parallel for speed
    // Start generating message immediately
    const messagePromise = generateFanMessage(selectedPrize.name).catch(() => {
        return "熱い応援ありがとう！この画像を受け取ってくれ！";
    });

    // Set a minimum animation time (e.g. 1 second)
    const animationPromise = new Promise(resolve => setTimeout(resolve, 1000));

    // Wait for both
    const [message] = await Promise.all([messagePromise, animationPromise]);

    const result: SpinResult = {
      prize: selectedPrize,
      message: message,
      date: new Date().toISOString(),
    };

    // 3. Save & Show
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(result));
    setSpinResult(result);
    setHasPlayedThisMonth(true);
    setHistoryResult(result);
    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-12 overflow-x-hidden">
      
      {/* Header */}
      <header className="w-full bg-blue-900 text-white p-4 border-b-4 border-black text-center shadow-lg relative z-20">
        <h1 className="text-2xl md:text-3xl font-pop tracking-wider text-yellow-400 drop-shadow-md leading-tight">
          車いすラグビー<br/>
          <span className="text-white text-lg md:text-2xl">ファンクラブ</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md px-4 mt-8 flex flex-col items-center">
        
        {/* Banner/Title */}
        <div className="bg-white border-4 border-black rounded-xl p-4 mb-8 w-full text-center pop-shadow transform -rotate-1">
          <p className="font-bold text-blue-900 text-sm mb-1">今月の運試し！</p>
          <h2 className="text-2xl font-black text-red-600 font-pop">マンスリーガチャ</h2>
          <div className="mt-2 text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-1 rounded border border-gray-300">
            開催期間: {getCurrentMonth()}
          </div>
        </div>

        {/* The Machine */}
        <GachaMachine 
          onSpin={handleSpin} 
          isSpinning={isSpinning}
          disabled={hasPlayedThisMonth}
        />

        {/* Already Played Message / View Result */}
        {hasPlayedThisMonth && !isSpinning && (
          <div className="mt-8 animate-fade-in text-center w-full">
             <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-800 p-3 rounded-lg mb-4 text-sm font-bold">
                今月はすでにプレイ済みです！<br/>来月また挑戦してね！
             </div>
             {historyResult && (
                <button 
                    onClick={() => setSpinResult(historyResult)}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl border-2 border-black pop-shadow active:translate-y-1 active:shadow-none transition-all"
                >
                    獲得した画像を見る
                </button>
             )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto pt-8 text-center text-gray-400 text-xs font-bold">
        <p>&copy; 車いすラグビーオフィシャルファンクラブ</p>
        <p className="mt-1 font-normal opacity-70">※毎月1回プレイできます</p>
      </footer>

      {/* Modals */}
      <PrizeModal 
        result={spinResult} 
        onClose={() => setSpinResult(null)} 
      />
      
      {showAdmin && (
        <AdminPanel 
            onClose={() => setShowAdmin(false)}
            onSave={() => window.location.reload()} // Reload to apply changes stored in localStorage (if testing locally)
        />
      )}
    </div>
  );
}