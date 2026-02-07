import type { GuestbookEntry } from '../types';
import { guestbookEntries } from '../data/guestbook';

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  return guestbookEntries;
}
