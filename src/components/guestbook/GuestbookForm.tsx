import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { addGuestbookEntry } from '../../services/guestbook';

interface FormValues {
  name: string;
  message: string;
  address?: string;
}

interface GuestbookFormProps {
  onSuccess?: () => void;
}

const GuestbookForm: React.FC<GuestbookFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create guestbook entry
      const entry = await addGuestbookEntry({
        name: data.name,
        message: data.message
      });

      // 2. If address is provided, create address entry
      if (entry && data.address && data.address.trim() !== "") {
        await import('../../services/guestbook').then(({ addGuestbookAddress }) =>
          addGuestbookAddress({
            guestbook_entry_id: entry.id,
            name: data.name,
            address: data.address!.trim()
          })
        );
      }

      if (entry) {
        reset();
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Failed to add guestbook entry');
      }
    } catch (err) {
      console.error('Error adding guestbook entry:', err);
      setError('Failed to add your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
        Sign the Guestbook
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            {...register('message', { 
              required: 'Message is required',
              minLength: { value: 5, message: 'Message must be at least 5 characters' } 
            })}
            className={`w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
            rows={4}
            placeholder="Share your thoughts, advice, or well wishes for our journey!"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>

        <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div className="flex items-center mb-2">
            <span className="text-purple-600 text-lg mr-2">📬</span>
            <span className="font-medium text-slate-700">Want a postcard from our trip?</span>
          </div>
          <div className="italic text-slate-500 text-sm mb-2">Drop your address below! (We promise, only good vibes in your mailbox 🎉)</div>
          <textarea
            id="address"
            rows={3}
            {...register('address')}
            className="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 bg-pink-50 placeholder-pink-400 resize-none text-base"
            placeholder="123 Happy Lane, Fun Town, USA"
            autoComplete="street-address"
          />
          <div className="text-xs text-slate-400 mt-1">(Optional, only if you want a postcard!)</div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          variant="primary"
          isLoading={isLoading} 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Sign Guestbook
        </Button>
      </form>
    </div>
  );
};

export default GuestbookForm;