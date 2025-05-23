import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Route, Plus, MapPin, Calendar, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import { getRouteStops, addRouteStop, updateRouteStop, deleteRouteStop } from '../../services/routes';
import type { RouteStop } from '../../types';

interface RouteEditorProps {
  userId: string;
}

interface FormValues {
  location: string;
  lat: number;
  lng: number;
  planned_date: string;
  description: string;
}

const RouteEditor: React.FC<RouteEditorProps> = ({ userId }) => {
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingStop, setEditingStop] = useState<RouteStop | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Location search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<{ display_name: string; lat: string; lon: string } | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors } 
  } = useForm<FormValues>();

  useEffect(() => {
    const loadRouteStops = async () => {
      try {
        const stops = await getRouteStops();
        setRouteStops(stops);
      } catch (error) {
        console.error('Error loading route stops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRouteStops();
  }, []);

  useEffect(() => {
    if (editingStop) {
      setValue('location', editingStop.location);
      setValue('lat', editingStop.lat);
      setValue('lng', editingStop.lng);
      setValue('planned_date', editingStop.planned_date || '');
      setValue('description', editingStop.description || '');
      setShowForm(true);
    }
  }, [editingStop, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingStop) {
        // Update existing stop
        const updatedStop = await updateRouteStop({
          ...editingStop,
          location: data.location,
          lat: data.lat,
          lng: data.lng,
          planned_date: data.planned_date || undefined,
          description: data.description || undefined
        });

        if (updatedStop) {
          setRouteStops(routeStops.map(stop => 
            stop.id === updatedStop.id ? updatedStop : stop
          ));
        }
      } else {
        // Add new stop
        const newStop = await addRouteStop({
          location: data.location,
          lat: data.lat,
          lng: data.lng,
          planned_date: data.planned_date || undefined,
          visited: false,
          description: data.description || undefined
        }, userId);

        if (newStop) {
          setRouteStops([...routeStops, newStop]);
        }
      }

      reset();
      setEditingStop(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error saving route stop:', err);
      setError('Failed to save route stop. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stop?')) return;
    
    try {
      const success = await deleteRouteStop(id);
      if (success) {
        setRouteStops(routeStops.filter(stop => stop.id !== id));
      }
    } catch (error) {
      console.error('Error deleting route stop:', error);
    }
  };

  const handleToggleVisited = async (stop: RouteStop) => {
    try {
      const updatedStop = await updateRouteStop({
        ...stop,
        visited: !stop.visited
      });

      if (updatedStop) {
        setRouteStops(routeStops.map(s => 
          s.id === updatedStop.id ? updatedStop : s
        ));
      }
    } catch (error) {
      console.error('Error updating route stop:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Route className="w-5 h-5 mr-2 text-blue-600" />
          Route Editor
        </h2>

        {!showForm && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingStop(null);
              reset();
              setShowForm(true);
            }}
          >
            Add Stop
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-bold">
              {editingStop ? 'Edit Stop' : 'Add New Stop'}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Location Search/Selection */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  <div className="md:col-span-2">
    <label htmlFor="location-search" className="block text-sm font-medium text-slate-700 mb-1">
      Search for Location
    </label>
    <input
      id="location-search"
      type="text"
      value={searchQuery}
      onChange={async (e) => {
        setSearchQuery(e.target.value);
        setSearchActive(true);
        setValue('location', '');
        setValue('lat', 0);
        setValue('lng', 0);
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
      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      placeholder="Search city, landmark, etc."
      autoComplete="off"
      disabled={!!selectedResult}
    />
    {searchActive && searchQuery.length >= 3 && (
      <div className="absolute z-20 bg-white border border-slate-200 rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
        {searchLoading && <div className="p-2 text-slate-400 text-sm">Searching...</div>}
        {searchResults.map((result, idx) => (
          <div
            key={idx}
            className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
            onClick={() => {
              setValue('location', result.display_name);
              setValue('lat', parseFloat(result.lat));
              setValue('lng', parseFloat(result.lon));
              setSearchQuery(result.display_name);
              setSelectedResult(result);
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
    {selectedResult && (
      <div className="flex items-center mt-2">
        <span className="text-xs text-blue-700 mr-2">{selectedResult.display_name}</span>
        <button type="button" className="text-xs text-red-500 underline" onClick={() => {
          setSelectedResult(null);
          setSearchQuery('');
          setValue('location', '');
          setValue('lat', 0);
          setValue('lng', 0);
        }}>Clear</button>
      </div>
    )}
  </div>
  <div>
    <label htmlFor="planned_date" className="block text-sm font-medium text-slate-700 mb-1">
      Planned Date (optional)
    </label>
    <input
      id="planned_date"
      type="date"
      {...register('planned_date')}
      className="w-full px-3 py-2 border border-slate-300 rounded-md"
    />
  </div>
</div>


              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  rows={3}
                  placeholder="Add details about this stop..."
                ></textarea>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  className="flex-1"
                >
                  {editingStop ? 'Update Stop' : 'Add Stop'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStop(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {routeStops.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-slate-500">No route stops added yet</h3>
            <p className="text-slate-400">Add your first planned stop to begin mapping your journey!</p>
          </div>
        ) : (
          routeStops.map((stop, index) => (
            <Card key={stop.id} className="overflow-hidden">
              <div className={`h-2 ${stop.visited ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <CardContent className="pt-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center">
                      <MapPin className={`w-5 h-5 mr-2 ${stop.visited ? 'text-green-500' : 'text-amber-500'}`} />
                      {stop.location}
                    </h3>
                    
                    {stop.planned_date && (
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(stop.planned_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    {stop.description && (
                      <p className="mt-2 text-slate-600">{stop.description}</p>
                    )}
                    
                    <div className="flex items-center mt-3">
                      <span className="text-xs text-slate-400">
                        Coords: {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStop(stop)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant={stop.visited ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handleToggleVisited(stop)}
                      className={`text-xs ${stop.visited ? 'bg-green-500' : 'text-slate-500'}`}
                    >
                      {stop.visited ? 'Visited' : 'Mark as Visited'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(stop.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RouteEditor;