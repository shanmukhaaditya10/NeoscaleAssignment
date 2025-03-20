
import api from './api';
import { loadPendingSplits, savePendingSplits, saveTransactions, loadTransactions, saveFriends } from './storage';




export const syncPendingSplits = async () => {
    const pendingSplits = loadPendingSplits();
    if (!pendingSplits || pendingSplits.length === 0) return;
  
    console.log('Syncing pending splits...', pendingSplits.length);
  
    try {
      
      const response = await api.post('/api/split/batch', { splits: pendingSplits });
  
      if (response.status === 200) {
        
        savePendingSplits([]);
        console.log('Pending splits synced successfully');
      }
    } catch (error: any) {
      console.error('Error syncing pending splits:', error.message);
      
      if (error.response?.data?.successfulSplits) {
        const successfulIds = error.response.data.successfulSplits.map((s: any) => s.transactionId);
        const updatedSplits = pendingSplits.filter(
          (split) => !successfulIds.includes(split.transactionId)
        );
        savePendingSplits(updatedSplits);
      }
      
    }
  };

const removeSplitFromQueue = (transactionId: string): void => {
  const pendingSplits = loadPendingSplits();
  const updatedSplits = pendingSplits.filter((split) => split.transactionId !== transactionId)
  savePendingSplits(updatedSplits);
  };


export async function syncFriends() {
  try {
    const res = await api.get('/api/friends');
    const friends = res.data.friends || [];
    saveFriends(friends);
    return friends;
  } catch (err: any) {
    if (err.message === "Network Error") {
        
        return null;
      }
      console.log(err.message,"<<------");
      
    console.error('Failed to sync friends:', err);
    return null;
  }
}