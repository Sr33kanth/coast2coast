import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { getCheckIns, subscribeToCheckIns } from '../../services/checkins';
import { getPhotos, subscribeToPhotos } from '../../services/photos';
import { getRouteStops, subscribeToRouteStops } from '../../services/routes';
import { getPresetRouteCoordinates } from '../../utils/helpers';
import type { CheckIn, Photo, RouteStop } from '../../types';

// Fix for default Leaflet icon missing in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const photoIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #EC4899; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const currentLocationIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #3B82F6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 0 15px rgba(59,130,246,0.5);">
    <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></div>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface MapViewProps {
  onRouteDistanceChange?: (miles: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ onRouteDistanceChange }) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [currentLocation, setCurrentLocation] = useState<CheckIn | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of US
  const [zoomLevel, setZoomLevel] = useState<number>(5);
  const [routePolyline, setRoutePolyline] = useState<LatLngExpression[]>([]);
  
  // Load initial data and set up subscriptions
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const checkInsData = await getCheckIns();
        setCheckIns(checkInsData);
        if (checkInsData.length > 0) {
          const latest = checkInsData[0];
          setCurrentLocation(latest);
          setMapCenter([latest.lat, latest.lng]);
        }

        const photosData = await getPhotos();
        setPhotos(photosData);

        const routeStopsData = await getRouteStops();
        setRouteStops(routeStopsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    // Set up real-time subscriptions
    const unsubCheckIns = subscribeToCheckIns((data) => {
      setCheckIns(data);
      if (data.length > 0) {
        const latest = data[0]; 
        setCurrentLocation(latest);
      }
    });

    const unsubPhotos = subscribeToPhotos(setPhotos);
    const unsubRouteStops = subscribeToRouteStops(setRouteStops);

    return () => {
      unsubCheckIns();
      unsubPhotos();
      unsubRouteStops();
    };
  }, []);

  // Fetch road-following route when checkIns change
  useEffect(() => {
    const fetchRoute = async () => {
      if (checkIns.length < 2) {
        setRoutePolyline([]);
        return;
      }
      try {
        const apiKey = import.meta.env.VITE_ORS_API_KEY;
        if (!apiKey) {
          console.warn('OpenRouteService API key not set. Route will not be drawn.');
          setRoutePolyline([]);
          return;
        }
        // Prepare coordinates for ORS API: [lng, lat]
        const coords = checkIns.map(ci => [ci.lng, ci.lat]);
        const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates: coords }),
        });
        if (!response.ok) throw new Error('Failed to fetch route');
        const data = await response.json();
        // Extract coordinates: [[lng, lat], ...] to [[lat, lng], ...] for Leaflet
        const geometry = data.features[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        setRoutePolyline(geometry);
        // Extract total distance in meters, convert to miles, and notify parent
        if (onRouteDistanceChange && data.features[0].properties && typeof data.features[0].properties.summary?.distance === 'number') {
          const meters = data.features[0].properties.summary.distance;
          const miles = meters / 1609.34;
          onRouteDistanceChange(miles);
        }
      } catch (err) {
        console.error('Error fetching route:', err);
        setRoutePolyline([]);
      }
    };
    fetchRoute();
  }, [checkIns]);

  // Get the preset route coordinates
  const presetRoute = getPresetRouteCoordinates();

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg" id="map-section">
      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Polyline (road-following) */}
        {routePolyline.length > 1 && (
          <Polyline positions={routePolyline} pathOptions={{ color: '#1D4ED8', weight: 5, opacity: 0.8 }} />
        )}

        {/* Route Stops */}
        {routeStops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createCustomIcon(stop.visited ? '#34D399' : '#F59E0B')}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-slate-900">{stop.location}</h3>
                {stop.planned_date && (
                  <p className="text-sm text-slate-500">
                    {new Date(stop.planned_date).toLocaleDateString()}
                  </p>
                )}
                {stop.description && <p className="mt-1 text-sm">{stop.description}</p>}
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-slate-100">
                  {stop.visited ? 'Visited' : 'Planned'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Check-in History */}
        {checkIns.map((checkIn) => (
          <Marker
            key={checkIn.id}
            position={[checkIn.lat, checkIn.lng]}
            icon={currentLocation?.id === checkIn.id ? currentLocationIcon : createCustomIcon('#3B82F6')}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-slate-900">{checkIn.location}</h3>
                <p className="text-sm text-slate-500">
                  {new Date(checkIn.timestamp).toLocaleString()}
                </p>
                {checkIn.description && <p className="mt-1 text-sm">{checkIn.description}</p>}
                {currentLocation?.id === checkIn.id && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    Current Location
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Photos */}
        {photos.map((photo) => (
          <Marker
            key={photo.id}
            position={[photo.lat, photo.lng]}
            icon={photoIcon}
          >
            <Popup>
              <div className="text-center">
                <img 
                  src={photo.url} 
                  alt={photo.caption || 'Trip photo'} 
                  className="w-full h-32 object-cover mb-2 rounded"
                />
                <h3 className="font-bold text-slate-900">{photo.location}</h3>
                {photo.caption && <p className="mt-1 text-sm">{photo.caption}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(photo.timestamp).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;