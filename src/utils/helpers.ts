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
