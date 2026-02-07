import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../../utils/helpers';
import { motion } from 'framer-motion';
import Card, { CardContent } from '../ui/Card';
import type { GuestbookEntry } from '../../types';
import { getGuestbookEntries } from '../../services/guestbook';

const GuestbookList: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await getGuestbookEntries();
        setEntries(data);
      } catch (error) {
        console.error('Error loading guestbook entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-slate-500">No guestbook entries yet</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{entry.name}</h3>
                  <p className="text-slate-600 mt-1">{entry.message}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDateTime(entry.timestamp)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default GuestbookList;
