import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import api from "../utils/api";
import TransactionCard from "../components/TransactionCard";
import SplitModal from "../components/SplitModal";
import SplitInfoModal from "../components/SplitInfoModal";
import CustomHeader from "../components/CustomHeader";
import { useModalStore } from "../stores/useModalStore";
import { Transaction } from "../types/Types";
import { loadTransactions, saveTransactions } from "../utils/storage";
import NetInfo from "@react-native-community/netinfo";
import { syncPendingSplits } from "../utils/sync";
import { debounce } from "lodash";
import { COLORS } from "../constants/colors";
import { useUserStore } from "../stores/useUserStore";


export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingFromApi, setIsLoadingFromApi] = useState(false); 
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { splitModal, splitInfoModal } = useModalStore();
  const {isNewUser} = useUserStore();

  const handleSplitSuccess = (transactionId: string) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === transactionId ? { ...t, isSplit: true} : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions); 
  };

  const fetchTransactions = async () => {
    setIsLoadingFromApi(true);
    try {
      const response = await api.get("/api/transactions");
      setTransactions(response.data);
      saveTransactions(response.data); 
    } catch (err: any) {
      if (err.message === "Network Error" || !isConnected) {
        
        console.log("Offline: Using local data");
      } else {
        console.log("Fetch error:", err.message);
      }
    } finally {
      setIsLoadingFromApi(false);
    }
  };
 const handleRefresh = async() => {
  await syncPendingSplits();
  fetchTransactions();
  };

  const debouncedHandleRefresh = debounce(() => {
    handleRefresh();
    console.log("Connected: Syncing data...");
  }, 5000, { leading: true, trailing: false });
  
  useEffect(() => {
    const initializeTransactions = async () => {
      const localTransactions = loadTransactions();
      if (localTransactions.length > 0) {
        setTransactions(localTransactions);
      }
  
      
      const unsubscribe = NetInfo.addEventListener((state) => {
        const connected = state.isConnected ?? false;
        setIsConnected(connected);
  
        if (connected && transactions.length === 0) {
          debouncedHandleRefresh();
        }
      });
  
      
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          fetchTransactions();
        }
      });
  
      return () => {
        unsubscribe();
        debouncedHandleRefresh.cancel(); 
      };
    };
  
    initializeTransactions();
  }, [isNewUser]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
   
        <CustomHeader />

      <View style={styles.container}>
        
        {isConnected === false && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
        
        {isLoadingFromApi && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Syncing...</Text>
          </View>
        )}
        <FlatList
          data={transactions}
          renderItem={({ item }:{item: Transaction}) => (
            <TransactionCard
              modalVisible={splitModal.isVisible || splitInfoModal.isVisible}
              item={item}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {isConnected === null ? "Loading..." : "No transactions found."}
            </Text>
          }
          contentContainerStyle={styles.listContent}
        />
        <SplitModal onSplitSuccess={handleSplitSuccess} />
        <SplitInfoModal />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingTop: 10,

   
  },
  offlineBadge: {
    position: 'absolute',
    top: 60, 
    left: 10,
    backgroundColor: 'rgba(229, 62, 62, 0.9)', 
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});