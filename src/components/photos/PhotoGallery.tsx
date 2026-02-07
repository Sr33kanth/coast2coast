import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDateTime } from '../../utils/helpers';
import Card, { CardContent } from '../ui/Card';
import type { Photo } from '../../types';
import { getPhotos } from '../../services/photos';

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await getPhotos();
        setPhotos(data);
      } catch (error) {
        console.error('Error loading photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-slate-500">No photos uploaded yet</h3>
        <p className="text-slate-400">Check back later for updates from our journey!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <Card className="cursor-pointer h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Trip photo'}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {(photo.location || photo.timestamp) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    {photo.location && <h3 className="text-white font-bold">{photo.location}</h3>}
                    {photo.timestamp && <p className="text-white/80 text-xs">{formatDateTime(photo.timestamp)}</p>}
                  </div>
                )}
              </div>
              <CardContent className="flex-grow">
                {photo.caption && <p className="text-slate-600">{photo.caption}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedPhoto(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Trip photo'}
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="p-4">
              {selectedPhoto.location && <h3 className="text-xl font-bold text-slate-900">{selectedPhoto.location}</h3>}
              {selectedPhoto.timestamp && <p className="text-sm text-slate-500 mb-2">{formatDateTime(selectedPhoto.timestamp)}</p>}
              {selectedPhoto.caption && <p className="text-slate-700">{selectedPhoto.caption}</p>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
