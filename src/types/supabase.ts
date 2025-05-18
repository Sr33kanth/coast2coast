export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      check_ins: {
        Row: {
          id: string
          created_at: string
          location: string
          lat: number
          lng: number
          description: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          location: string
          lat: number
          lng: number
          description?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          location?: string
          lat?: number
          lng?: number
          description?: string | null
          user_id?: string
        }
      }
      photos: {
        Row: {
          id: string
          created_at: string
          url: string
          caption: string | null
          location: string
          lat: number
          lng: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          caption?: string | null
          location: string
          lat: number
          lng: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          caption?: string | null
          location?: string
          lat?: number
          lng?: number
          user_id?: string
        }
      }
      guestbook: {
        Row: {
          id: string
          created_at: string
          name: string
          message: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          message: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          message?: string
        }
      }
      route_stops: {
        Row: {
          id: string
          created_at: string
          location: string
          lat: number
          lng: number
          planned_date: string | null
          visited: boolean
          description: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          location: string
          lat: number
          lng: number
          planned_date?: string | null
          visited?: boolean
          description?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          location?: string
          lat?: number
          lng?: number
          planned_date?: string | null
          visited?: boolean
          description?: string | null
          user_id?: string
        }
      }
    }
  }
}