import type { Photo } from '../types';

// Dynamically import all images from public/photos/ using Vite's glob import
const photoModules = import.meta.glob<string>('/public/photos/*.{jpg,jpeg,png,webp,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function getStaticPhotos(): Photo[] {
  return Object.entries(photoModules).map(([path, url], index) => {
    const filename = path.split('/').pop() || `photo-${index}`;
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '');

    return {
      id: `photo-${index}`,
      url,
      location: '',
      lat: 0,
      lng: 0,
      timestamp: '',
      caption: nameWithoutExt.replace(/[-_]/g, ' '),
    };
  });
}
