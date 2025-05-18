import { format } from 'date-fns';

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date: string): string => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1609.34).toFixed(1)} miles`;
};

export const getPresetRouteCoordinates = (): [number, number][] => {
  // Simplified route from SF to NY with major stops
  return [
    [37.7749, -122.4194], // San Francisco
    [39.5296, -119.8138], // Reno
    [40.7608, -111.8910], // Salt Lake City
    [39.7392, -104.9903], // Denver
    [39.0997, -94.5786],  // Kansas City
    [38.6270, -90.1994],  // St. Louis
    [39.7684, -86.1581],  // Indianapolis
    [40.4406, -79.9959],  // Pittsburgh
    [40.7128, -74.0060]   // New York
  ];
};

// Returns color based on whether a stop has been visited
export const getMarkerColor = (visited: boolean): string => {
  return visited ? '#34D399' : '#F59E0B';
};

// Safely parse JSON with a fallback
export const safeJsonParse = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return fallback;
  }
};

// Get city name from coordinates
export const getCityFromCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
    );
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Unknown location';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Unknown location';
  }
};