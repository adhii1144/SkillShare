export interface User {
  profilePhotoUrl: string;
  available: any;
  id: string;
  name: string;
  email: string;
  mobile: string;
  title: string;
  location: string;
  avatar: string;
  skills: string[];
  bio: string;
  connected: boolean;
  isOnline: boolean;
}

export interface SearchFilters {
  skill?: string;
  location?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}