import { PrizeImage } from './types';

// =================================================================
// 【毎月の更新作業】
// 以下の url の部分を、その月の新しい画像URLに書き換えてください。
// 画像はGoogleドライブの公開リンクや、画像ホスティングサービスのURLを使用します。
// =================================================================

export const DEFAULT_PRIZES: PrizeImage[] = [
  {
    id: 'prize_1',
    // ↓ 画像1（車いすの写真）のURLに書き換えてください
    url: 'https://picsum.photos/id/1015/800/600', 
    name: '競技用車いす - 戦いの相棒',
    rarity: 'Super Rare'
  },
  {
    id: 'prize_2',
    // ↓ 画像2（日本選手権大会バナー）のURLに書き換えてください
    url: 'https://picsum.photos/id/1055/800/600', 
    name: '第27回 日本選手権大会',
    rarity: 'Super Rare'
  },
  {
    id: 'prize_3',
    // ↓ 画像3（WASSHOI!バナー）のURLに書き換えてください
    url: 'https://picsum.photos/id/1084/800/600', 
    name: '合言葉はワッショイ！',
    rarity: 'Super Rare'
  }
];

export const STORAGE_KEY_HISTORY = 'wr_gacha_history';
export const STORAGE_KEY_SETTINGS = 'wr_gacha_admin_settings';