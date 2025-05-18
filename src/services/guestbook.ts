import { supabase } from './supabase';
import type { GuestbookEntry } from '../types';

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching guestbook entries:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    message: item.message,
    timestamp: item.created_at
  }));
}

export async function addGuestbookEntry(entry: Omit<GuestbookEntry, 'id' | 'timestamp'>): Promise<GuestbookEntry | null> {
  const { data, error } = await supabase
    .from('guestbook')
    .insert([{
      name: entry.name,
      message: entry.message
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding guestbook entry:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    message: data.message,
    timestamp: data.created_at
  };
}

export function subscribeToGuestbook(callback: (entries: GuestbookEntry[]) => void) {
  const subscription = supabase
    .channel('guestbook_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'guestbook'
    }, () => {
      getGuestbookEntries().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}