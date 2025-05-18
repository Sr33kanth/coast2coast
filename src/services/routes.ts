import { supabase } from './supabase';
import type { RouteStop } from '../types';

export async function getRouteStops(): Promise<RouteStop[]> {
  const { data, error } = await supabase
    .from('route_stops')
    .select('*')
    .order('planned_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching route stops:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    location: item.location,
    lat: item.lat,
    lng: item.lng,
    planned_date: item.planned_date || undefined,
    visited: item.visited,
    description: item.description || undefined
  }));
}

export async function addRouteStop(stop: Omit<RouteStop, 'id'>, userId: string): Promise<RouteStop | null> {
  const { data, error } = await supabase
    .from('route_stops')
    .insert([{
      location: stop.location,
      lat: stop.lat,
      lng: stop.lng,
      planned_date: stop.planned_date || null,
      visited: stop.visited,
      description: stop.description || null,
      user_id: userId
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding route stop:', error);
    return null;
  }

  return {
    id: data.id,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    planned_date: data.planned_date || undefined,
    visited: data.visited,
    description: data.description || undefined
  };
}

export async function updateRouteStop(stop: RouteStop): Promise<RouteStop | null> {
  const { data, error } = await supabase
    .from('route_stops')
    .update({
      location: stop.location,
      lat: stop.lat,
      lng: stop.lng,
      planned_date: stop.planned_date || null,
      visited: stop.visited,
      description: stop.description || null
    })
    .eq('id', stop.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating route stop:', error);
    return null;
  }

  return {
    id: data.id,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    planned_date: data.planned_date || undefined,
    visited: data.visited,
    description: data.description || undefined
  };
}

export async function deleteRouteStop(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('route_stops')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting route stop:', error);
    return false;
  }

  return true;
}

export function subscribeToRouteStops(callback: (stops: RouteStop[]) => void) {
  const subscription = supabase
    .channel('route_stops_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'route_stops'
    }, () => {
      getRouteStops().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}