import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { addCheckIn } from '../../services/checkins';
import { getCityFromCoords } from '../../utils/helpers';

interface CheckinFormProps {
  userId: string;
  onSuccess?: () => void;
}

interface FormValues {
  description: string;
}

const CheckinForm: React.FC<CheckinFormProps> = ({ userId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [location, setLocation] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const getLocation = async () => {
    setIsGettingLocation(true);
    setError(null);

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
      setIsGettingLocation(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!coords) {
      setError('Please get your current location first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const checkIn = await addCheckIn({
        location,
        lat: coords.lat,
        lng: coords.lng,
        description: data.description
      }, userId);

      if (checkIn) {
        reset();
        setCoords(null);
        setLocation('');
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Failed to add check-in');
      }
    } catch (err) {
      console.error('Error adding check-in:', err);
      setError('Failed to add check-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
        Check In
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <button
            type="button"
            onClick={getLocation}
            disabled={isGettingLocation}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg border border-blue-200 flex items-center justify-center transition-colors"
          >
            {isGettingLocation ? (
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
          
          {coords && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">
                Location: {location || 'Unknown location'}
              </p>
              <p className="text-xs text-blue-600">
                Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="What's happening at this location?"
          ></textarea>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          isLoading={isLoading}
          disabled={!coords || isLoading} 
          className="w-full"
        >
          Check In Now
        </Button>
      </form>
    </div>
  );
};

export default CheckinForm;