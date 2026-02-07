import type { Photo } from '../types';
import { getStaticPhotos } from '../data/photos';

export async function getPhotos(): Promise<Photo[]> {
  return getStaticPhotos();
}
