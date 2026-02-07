import type { CheckIn } from '../types';
import { checkIns } from '../data/checkins';

export async function getCheckIns(): Promise<CheckIn[]> {
  return checkIns;
}
