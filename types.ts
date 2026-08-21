
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MenuItem {
  name: string;
  category: 'bhaji' | 'chapati' | 'rice' | 'dal' | 'sweet' | 'other';
  price?: number;
}

export interface DailyMenu {
  items: MenuItem[];
  special?: string;
  price: number;
}

export interface Mess {
  id: string;
  ownerId: string;
  name: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  contact: string;
  rating: number;
  imageUrl?: string;
  logoUrl?: string;
  menus: {
    breakfast: DailyMenu;
    lunch: DailyMenu;
    dinner: DailyMenu;
  };
  comments: Comment[];
}

export interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  role: 'owner' | 'customer';
  messIds?: string[]; // Support multiple messes
  activeMessId?: string; // Currently managed mess
}
