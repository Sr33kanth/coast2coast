import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Upload, X, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { addPhoto } from '../../services/photos';
import { getCityFromCoords } from '../../utils/helpers';

interface PhotoUploadProps {
  userId: string;
  onSuccess?: () => void;
  adminMode?: boolean;
}

interface FormValues {
  caption: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ userId, onSuccess, adminMode }) => {
  const [customUserId, setCustomUserId] = useState<string>(userId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getLocation = async () => {
    setIsLoading(true);
    setError(null);
    // Clear manual if using geolocation
    setManualLat('');
    setManualLng('');

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });

      // Get city name
      const cityName = await getCityFromCoords(latitude, longitude);
      setLocation(cityName);
    } catch (err) {
      setError('Failed to get your location. Please try again or enter coordinates manually.');
      console.error('Geolocation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const effectiveUserId = adminMode ? customUserId : userId;

    // Validate location: use manual if provided, else current coords
    let lat: number | null = null;
    let lng: number | null = null;
    if (manualLat && manualLng) {
      lat = parseFloat(manualLat);
      lng = parseFloat(manualLng);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setError('Please enter valid latitude and longitude values.');
        return;
      }
    } else if (coords) {
      lat = coords.lat;
      lng = coords.lng;
    }
    if (!selectedFile || ((manualLat && manualLng) ? (lat === null || lng === null) : !coords)) {
      setError('Please select a photo and provide a valid location (current or manual).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const photo = await addPhoto({
        url: '', // This will be filled by the server
        caption: data.caption,
        location,
        lat: lat as number,
        lng: lng as number,
      }, effectiveUserId, selectedFile);

      if (photo) {
        reset();
        clearFile();
        setCoords(null);
        setManualLat('');
        setManualLng('');
        setLocation('');
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Camera className="w-5 h-5 mr-2 text-pink-500" />
        Share a Photo
      </h2>
      
      {adminMode && (
        <div className="mb-4">
          <label htmlFor="user-uuid" className="block text-sm font-medium text-slate-700 mb-1">
            User UUID
          </label>
          <input
            id="user-uuid"
            type="text"
            value={customUserId}
            onChange={e => setCustomUserId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter user UUID"
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* File Upload Area */}
        <div className="mb-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              preview ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-blue-400'
            } transition-colors cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            
            {preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="mx-auto max-h-48 rounded-md"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-4">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  Click to select or drop an image (JPEG, PNG, WebP)
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Max file size: 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Location Search/Selection */}
        <div className="mb-4">
          {/* Location Search */}
          <div className="mb-2 relative">
            <input
              type="text"
              placeholder="Search for a location (city, landmark, etc)"
              value={searchQuery}
              onChange={async (e) => {
                setSearchQuery(e.target.value);
                setSearchActive(true);
                setManualLat(''); setManualLng(''); setCoords(null);
                if (e.target.value.length < 3) {
                  setSearchResults([]);
                  return;
                }
                setSearchLoading(true);
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}`);
                  const data = await res.json();
                  setSearchResults(data);
                } catch (err) {
                  setSearchResults([]);
                } finally {
                  setSearchLoading(false);
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={!!coords || !!manualLat || !!manualLng}
              autoComplete="off"
            />
            {searchActive && searchQuery.length >= 3 && (
              <div className="absolute z-20 bg-white border border-slate-200 rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
                {searchLoading && <div className="p-2 text-slate-400 text-sm">Searching...</div>}
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => {
                      setManualLat(result.lat);
                      setManualLng(result.lon);
                      setLocation(result.display_name);
                      setSearchQuery(result.display_name);
                      setSearchActive(false);
                      setSearchResults([]);
                    }}
                  >
                    {result.display_name}
                  </div>
                ))}
                {!searchLoading && searchResults.length === 0 && (
                  <div className="p-2 text-slate-400 text-sm">No results</div>
                )}
              </div>
            )}
          </div>

          {/* Get Current Location Button */}
          <button
            type="button"
            onClick={getLocation}
            disabled={isLoading || !!manualLat || !!manualLng || !!searchQuery}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg border border-blue-200 flex items-center justify-center transition-colors mb-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Your Location...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5 mr-2" />
                {coords ? 'Update Location' : 'Get Current Location'}
              </>
            )}
          </button>

          {/* Manual Lat/Lng Entry */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              inputMode="decimal"
              pattern="^-?\d*(\.\d*)?$"
              placeholder="Latitude"
              value={manualLat}
              onChange={e => {
                setManualLat(e.target.value);
                setManualLng(''); setCoords(null); setSearchQuery(''); setSearchResults([]); setSearchActive(false);
              }}
              className="w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={!!coords || !!searchQuery}
            />
            <input
              type="text"
              inputMode="decimal"
              pattern="^-?\d*(\.\d*)?$"
              placeholder="Longitude"
              value={manualLng}
              onChange={e => {
                setManualLng(e.target.value);
                setManualLat(''); setCoords(null); setSearchQuery(''); setSearchResults([]); setSearchActive(false);
              }}
              className="w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={!!coords || !!searchQuery}
            />
          </div>

          {/* Location Preview */}
          {(coords || (manualLat && manualLng)) && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">
                Location: {location || searchQuery || 'Unknown location'}
              </p>
              <p className="text-xs text-blue-600">
                Coordinates: {manualLat && manualLng ? `${manualLat}, ${manualLng}` : coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : ''}
              </p>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mb-4">
          <label htmlFor="caption" className="block text-sm font-medium text-slate-700 mb-1">
            Caption (optional)
          </label>
          <textarea
            id="caption"
            {...register('caption')}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Write something about this photo..."
          ></textarea>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          variant="secondary"
          isLoading={isLoading}
          disabled={
            !selectedFile ||
            (
              // Must have EITHER valid manual OR valid coords
              !(
                (manualLat && manualLng && !isNaN(parseFloat(manualLat)) && !isNaN(parseFloat(manualLng)) && Math.abs(parseFloat(manualLat)) <= 90 && Math.abs(parseFloat(manualLng)) <= 180)
                || coords
              )
            )
            || isLoading
          }
          className="w-full"
        >
          Upload Photo
        </Button>
      </form>
    </div>
  );
};

export default PhotoUpload;