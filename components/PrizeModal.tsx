import React from 'react';
import { SpinResult } from '../types';

interface PrizeModalProps {
  result: SpinResult | null;
  onClose: () => void;
}

export const PrizeModal: React.FC<PrizeModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const downloadImage = async () => {
    try {
      const response = await fetch(result.prize.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WR_FanClub_${result.date}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed', e);
      window.open(result.prize.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl border-4 border-blue-900 overflow-hidden shadow-2xl transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-yellow-400 p-4 border-b-4 border-black text-center relative overflow-hidden">
             {/* Confetti decoration (CSS) */}
             <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle,_#ffffff_10%,_transparent_10%)] bg-[length:10px_10px]"></div>
             <h2 className="text-3xl font-black font-pop text-blue-900 relative z-10 drop-shadow-sm">GET!!</h2>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Rarity Badge */}
          <div className={`
            mb-4 px-4 py-1 rounded-full border-2 border-black font-bold text-sm
            ${result.prize.rarity === 'Super Rare' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' : 'bg-gray-200'}
          `}>
            {result.prize.rarity || 'Normal'}
          </div>

          {/* Image Display */}
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg border-2 border-black mb-6 overflow-hidden relative group">
            <img 
                src={result.prize.url} 
                alt={result.prize.name} 
                className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-4 text-center">{result.prize.name}</h3>

          {/* Gemini Message */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 w-full relative">
            <div className="absolute -top-3 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded border border-black transform -rotate-6">
                選手からのコメント
            </div>
            <p className="text-blue-900 font-medium leading-relaxed mt-2 text-sm">
                {result.message || "おめでとう！画像を保存してね！"}
            </p>
          </div>

          {/* Actions */}
          <button 
            onClick={downloadImage}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg border-2 border-black pop-shadow-sm mb-3 transition-colors"
          >
            画像を保存する 📸
          </button>
          
          <button 
            onClick={onClose}
            className="text-gray-500 underline text-sm hover:text-gray-800"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};