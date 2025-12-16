export interface PrizeImage {
  id: string;
  url: string;
  name: string;
  rarity?: 'Normal' | 'Rare' | 'Super Rare';
}

export interface GachaConfig {
  prizes: PrizeImage[];
  currentMonth: string; // Format: YYYY-MM
}

export interface SpinResult {
  prize: PrizeImage;
  message: string;
  date: string;
}

export interface AdminSettings {
  image1: string;
  image2: string;
  image3: string;
}