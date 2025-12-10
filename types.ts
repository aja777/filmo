
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  year: string;
  country?: string;
  genres: string[];
  duration?: string;
  director?: string;
  cast?: string[];
  downloadLinks?: DownloadLink[];
  streamLinks?: StreamLink[];
  hasDubbing?: boolean;
  hasSubtitle?: boolean;
  isFree?: boolean;
  type?: 'movie' | 'series' | 'animation';
  age_rating?: string;
}

export interface DownloadLink {
  quality: string;
  size: string;
  url: string;
  encoder?: string;
}

export interface StreamLink {
  quality: string;
  url: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface UserSubscription {
  active: boolean;
  expires_at: string | null;
  expires_hum: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // WP usually provides gravatar or custom avatar
  subscription: UserSubscription;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'pending';
  refId: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likes: number;
}

export enum NavTab {
  HOME = 'home',
  SEARCH = 'search',
  AI_GENIUS = 'ai_genius',
  SAVED = 'saved',
  PROFILE = 'profile'
}
