export interface CheckIn {
  id: string;
  location: string;
  timestamp: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  location: string;
  lat: number;
  lng: number;
  timestamp: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}
