
import { MMKV } from 'react-native-mmkv';
import { Friend, Transaction } from '../types/Types';

const storage = new MMKV();



const PENDING_SPLIT_KEY = 'pending_splits';
export interface Split {
    transactionId: string;
    friendIds: string[];
    timestamp: number;
  }
export const addPendingSplit = (newSplit: Split): { success: boolean; message?: string } => {
    try {
      
      const existingSplitsJson = storage.getString(PENDING_SPLIT_KEY);
      const existingSplits: Split[] = existingSplitsJson ? JSON.parse(existingSplitsJson) : [];
  
      
      const isDuplicate = existingSplits.some((split) => split.transactionId === newSplit.transactionId);
      if (isDuplicate) {
        return { success: false, message: 'Split already queued for this transaction.' };
      }
  
      
      const updatedSplits = [...existingSplits, newSplit];
      storage.set(PENDING_SPLIT_KEY, JSON.stringify(updatedSplits));
  
      return { success: true };
    } catch (error) {
      console.error('Error adding pending split:', error);
      return { success: false, message: 'Error saving split data.' };
    }
  };

export function loadFriends(): Friend[] {
  const data = storage.getString('friends');
  return data ? JSON.parse(data) : [];
}


export function saveFriends(friends: Friend[]) {
  storage.set('friends', JSON.stringify(friends));
}

export function loadTransactions(): Transaction[] {
  const data = storage.getString('transactions');
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(transactions: Transaction[]) {
  storage.set('transactions', JSON.stringify(transactions));
}

export interface PendingSplit {
  transactionId: string;
  friendIds: string[];
  timestamp: number;
}



export function savePendingSplits(pendingSplits: PendingSplit[]) {
  storage.set('pending_splits', JSON.stringify(pendingSplits));
}

export function loadPendingSplits(): PendingSplit[] {
    const data = storage.getString('pending_splits');
    return data ? JSON.parse(data) : [];
  }