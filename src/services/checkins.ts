import { supabase } from './supabase';
import type { CheckIn } from '../types';

export async function getCheckIns(): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching check-ins:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    location: item.location,
    timestamp: item.created_at,
    lat: item.lat,
    lng: item.lng,
    description: item.description || undefined
  }));
}

export async function addCheckIn(checkIn: Omit<CheckIn, 'id' | 'timestamp'>, userId: string): Promise<CheckIn | null> {
  const { data, error } = await supabase
    .from('check_ins')
    .insert([{
      location: checkIn.location,
      lat: checkIn.lat,
      lng: checkIn.lng,
      description: checkIn.description,
      user_id: userId
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding check-in:', error);
    return null;
  }

  return {
    id: data.id,
    location: data.location,
    timestamp: data.created_at,
    lat: data.lat,
    lng: data.lng,
    description: data.description || undefined
  };
}

export function subscribeToCheckIns(callback: (checkIns: CheckIn[]) => void) {
  const subscription = supabase
    .channel('check_ins_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'check_ins'
    }, () => {
      getCheckIns().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}