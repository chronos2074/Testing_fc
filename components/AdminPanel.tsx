import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../types';
import { STORAGE_KEY_SETTINGS, DEFAULT_PRIZES } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
  onSave: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSave }) => {
  const [settings, setSettings] = useState<AdminSettings>({
    image1: '',
    image2: '',
    image3: '',
    comment1: '',
    comment2: '',
    comment3: '',
  });
  
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({
        comment1: '',
        comment2: '',
        comment3: '',
        ...parsed,
      });
    } else {
      setSettings({
        image1: DEFAULT_PRIZES[0].url,
        image2: DEFAULT_PRIZES[1].url,
        image3: DEFAULT_PRIZES[2].url,
        comment1: 'ナイス！今月も応援ありがとう！次の試合も全力でぶつかるぜ！🔥',
        comment2: 'ナイス！今月も応援ありがとう！次の試合も全力でぶつかるぜ！🔥',
        comment3: 'ナイス！今月も応援ありがとう！次の試合も全力でぶつかるぜ！🔥',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    onSave();
    alert('画像設定を保存しました！');
  };

  const handleCopyLink = async () => {
    try {
        const configStr = JSON.stringify(settings);
        const bytes = new TextEncoder().encode(configStr);
        const encoded = btoa(String.fromCharCode(...bytes));
        const url = `${window.location.origin}${window.location.pathname}?cfg=${encoded}`;
        try {
          await navigator.clipboard.writeText(url);
          alert('【毎月の作業完了！】\n会員配布用のURLをコピーしました。\n\nこのURLをLINEやメールで会員に送ってください。\n(アクセスすると自動的にこの画像設定が適用されます)');
        } catch {
          prompt('URLのコピーに失敗しました。以下のURLを手動でコピーしてください:', url);
        }
    } catch(e) {
        console.error(e);
        alert('URLの生成に失敗しました');
    }
  };

  const handleClearHistory = () => {
    if(confirm('本当に全員の履歴（自分のブラウザのみ）をリセットしますか？デモ用機能です。')) {
        localStorage.removeItem('wr_gacha_history');
        window.location.reload();
    }
  }

  // Helper to render image input + comment textarea as a group
  const renderImageGroup = (
    label: string,
    imageName: keyof AdminSettings,
    imageValue: string,
    commentName: keyof AdminSettings,
    commentValue: string,
  ) => (
    <div className="mb-5 border-2 border-gray-200 rounded-lg p-3">
      <p className="font-bold text-sm text-gray-600 mb-2">{label}</p>
      <div className="mb-3">
        <label className="block text-xs font-bold mb-1 text-gray-700">画像URL</label>
        <div className="flex gap-2 items-start">
          <input
            type="text"
            name={imageName}
            value={imageValue}
            onChange={handleChange}
            className="flex-1 border-2 border-gray-300 p-2 rounded focus:border-blue-600 outline-none text-sm"
            placeholder="https://example.com/image.jpg"
          />
          <div className="w-12 h-12 border border-gray-300 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
            {imageValue ? (
              <img src={imageValue} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ) : (
              <span className="text-xs text-gray-400 flex items-center justify-center h-full">No Img</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold mb-1 text-gray-700">ここに注目</label>
        <textarea
          name={commentName}
          value={commentValue}
          onChange={handleChange}
          rows={2}
          className="w-full border-2 border-gray-300 p-2 rounded focus:border-blue-600 outline-none text-sm resize-y"
          placeholder="この画像に対するコメントを入力してください"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black rounded-xl p-6 w-full max-w-lg pop-shadow relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:text-red-500"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-4 font-pop border-b-4 border-black pb-2">
          ⚙️ 管理者設定
        </h2>

        {/* Guide Toggle */}
        <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full text-left bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-bold mb-4 flex justify-between items-center"
        >
            <span>📖 毎月の更新手順（ここをクリック）</span>
            <span>{showGuide ? '▼' : '▶'}</span>
        </button>

        {showGuide && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm text-gray-700 space-y-2 border border-gray-300">
                <p>1. 下の入力欄に、今月の画像URLを3つ、ここに注目のコメントを入力してください。</p>
                <p>2. 入力すると右側に小さなプレビューが出ます。画像が表示されているか確認してください。</p>
                <p>3. <span className="font-bold text-green-600">「会員配布用URLをコピー」</span>ボタンを押します。</p>
                <p>4. コピーされたURLを、ファンクラブ会員へのメールやLINEに貼り付けて送信してください。</p>
                <p className="text-xs text-red-500 mt-2">※ このURLを受け取った人は、自動的にここで設定した画像・コメントでガチャを回せます。</p>
            </div>
        )}

        <div className="mb-6">
          {renderImageGroup("画像A (Normal)", "image1", settings.image1, "comment1", settings.comment1)}
          {renderImageGroup("画像B (Rare)", "image2", settings.image2, "comment2", settings.comment2)}
          {renderImageGroup("画像C (Super Rare)", "image3", settings.image3, "comment3", settings.comment3)}
          <p className="text-xs text-gray-500 mt-1">空欄の場合はデフォルトメッセージが表示されます</p>
        </div>

        <div className="flex flex-col gap-3">
            <button 
                onClick={handleCopyLink}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg border-2 border-black pop-shadow-sm active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
                <span>🔗</span> 会員配布用URLをコピー
            </button>

            <button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg border-2 border-black active:translate-y-1 transition-all text-sm"
            >
                保存してこのブラウザでテスト
            </button>
            
            <div className="border-t-2 border-gray-200 my-2"></div>

            <button 
                onClick={handleClearHistory}
                className="w-full bg-red-100 text-red-600 font-bold py-2 rounded-lg border-2 border-red-200 text-xs hover:bg-red-200"
            >
                [デモ用] 自分の「今月プレイ済み」履歴をリセット
            </button>
        </div>
      </div>
    </div>
  );
};