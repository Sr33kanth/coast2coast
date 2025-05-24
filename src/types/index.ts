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

export interface GuestbookAddress {
  id: string;
  guestbook_entry_id: string;
  name: string;
  address: string;
  created_at: string;
}

export interface RouteStop {
  id: string;
  location: string;
  lat: number;
  lng: number;
  planned_date?: string;
  visited: boolean;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  avatar_url?: string;
}