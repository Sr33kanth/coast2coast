import { supabase } from './supabase';
import type { Photo } from '../types';

export async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    url: item.url,
    caption: item.caption || undefined,
    location: item.location,
    lat: item.lat,
    lng: item.lng,
    timestamp: item.created_at
  }));
}

export async function addPhoto(
  photo: Omit<Photo, 'id' | 'timestamp'>,
  userId: string,
  file: File
): Promise<Photo | null> {
  // 1. Upload the image to Supabase storage
  const fileName = `${userId}/${Date.now()}-${file.name}`;
  const { data: fileData, error: fileError } = await supabase
    .storage
    .from('trip-photos')
    .upload(fileName, file);
    
  if (fileError) {
    console.error('Error uploading file:', fileError);
    return null;
  }

  // 2. Get the public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('trip-photos')
    .getPublicUrl(fileName);

  // 3. Add the record to the database
  const { data, error } = await supabase
    .from('photos')
    .insert([{
      url: publicUrl,
      caption: photo.caption,
      location: photo.location,
      lat: photo.lat,
      lng: photo.lng,
      user_id: userId
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding photo:', error);
    return null;
  }

  return {
    id: data.id,
    url: data.url,
    caption: data.caption || undefined,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    timestamp: data.created_at
  };
}

export function subscribeToPhotos(callback: (photos: Photo[]) => void) {
  const subscription = supabase
    .channel('photos_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'photos'
    }, () => {
      getPhotos().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}