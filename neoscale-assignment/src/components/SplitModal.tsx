import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle, Circle, X } from 'lucide-react-native';

import NetInfo from '@react-native-community/netinfo';
import api from '../utils/api';
import { COLORS } from '../constants/colors';
import { useModalStore } from '../stores/useModalStore';
import { Friend } from '../types/Types';
import { loadFriends, addPendingSplit } from '../utils/storage';
import { debounce } from 'lodash';
import { syncFriends } from '../utils/sync';

type Props = {
  onSplitSuccess?: (transactionId: string) => void;
};

export default function CustomModal({ onSplitSuccess }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { splitModal: { isVisible, transaction }, closeSplitModal } = useModalStore();




  useEffect(() => {
    const initialize = async () => {
      const localFriends = loadFriends();
      setFriends(localFriends);
  
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected ?? false);
  
      
      const debouncedSync = debounce(() => {
        if (isVisible) {
          syncFriendsInBackground();
        }
      }, 500); 
  
      const unsubscribe = NetInfo.addEventListener((state) => {
        const connected = state.isConnected ?? false;
        setIsConnected(connected);
        if (connected) {
          debouncedSync();
        }
      });
  
      if (state.isConnected && isVisible) {
        debouncedSync();
      }
  
      return () => {
        unsubscribe();
        debouncedSync.cancel(); 
      };
    };
  
    if (isVisible && transaction) {
      initialize();
    }
    setSelectedFriends([]);
    setError(null);
  }, [isVisible, transaction]);
  
  const syncFriendsInBackground = async () => {
    const localFriends = loadFriends();
  
    
    if (localFriends.length === 0) { 
      setLoadingTitle('Syncing friends...');
      setLoading(true);
    }
  
    const syncedFriends = await syncFriends();
    
    if (syncedFriends) {
      setFriends(syncedFriends);
    }
  
   
    if (localFriends.length === 0) {
      setLoading(false);
      setLoadingTitle(null);
    }
  };
  

  const handleSplit = async () => {
    if (!transaction) {
      setError('No transaction selected');
      return;
    }
    if (selectedFriends.length === 0) {
      setError('Please select at least one friend');
      return;
    }

    setLoading(true);
    setLoadingTitle('Splitting...');

    if (isConnected) {
      try {
        await api.post('/api/split', {
          transactionId: transaction.id,
          friendIds: selectedFriends,
        });
        if (onSplitSuccess) onSplitSuccess(transaction.id);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to split transaction');
        setLoading(false);
        setLoadingTitle(null);
        return;
      }
    } else {
      
      const result = addPendingSplit({
        transactionId: transaction.id,
        friendIds: selectedFriends,
        timestamp: Date.now(),
      });
      if (!result.success) {
        setError(result?.message ?? null); 
      } else {
        if (onSplitSuccess) onSplitSuccess(transaction.id);
        setError('Offline: Split queued for sync');
      }
    }

    setLoading(false);
    setLoadingTitle(null);
    closeSplitModal();
  };

  const toggleSelect = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };
  const renderFriendItem = useCallback(
    ({ item }: { item: Friend }) => (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={() => toggleSelect(item.id)}
      >
        <View style={styles.checkbox}>
          {selectedFriends.includes(item.id) ? (
            <CheckCircle size={20} color="#38A169" />
          ) : (
            <Circle size={20} color="#718096" />
          )}
        </View>
        <Text style={styles.friendName}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [selectedFriends]
  );

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{transaction?.description}</Text>
            <Pressable onPress={closeSplitModal}>
              <X color="#fff" size={30} />
            </Pressable>
          </View>

          <View style={styles.contentContainer}>
            {loading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>{loadingTitle}</Text>
              </View>
            ) : error ? (
              <View style={styles.centerContent}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : friends.length === 0 ? (
              <View style={styles.centerContent}>
                <Text style={styles.placeholderText}>No friends available</Text>
              </View>
            ) : (
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                contentContainerStyle={styles.flatListContent}
              />
            )}

            {!loading && transaction && friends.length > 0 && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.splitButton,
                    selectedFriends.length === 0 && styles.disabledButton,
                  ]}
                  disabled={selectedFriends.length === 0 || loading}
                  onPress={handleSplit}
                >
                  <Text style={styles.buttonText}>
                    Split with {selectedFriends.length} Friend
                    {selectedFriends.length !== 1 ? "s" : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "72%",
    width: "100%",
    backgroundColor: COLORS.bgWhite,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "12%",
    backgroundColor: COLORS.modalHeader,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECEF",
  },
  checkbox: {
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    color: "#2D3748",
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 10,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#718096",
    marginTop: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#718096",
  },
  errorText: {
    fontSize: 16,
    color: "#E53E3E",
    textAlign: "center",
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E8ECEF",
    paddingTop: 12,
    alignItems: "center",
  },
  splitButton: {
    backgroundColor: COLORS.bannerBlue,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
