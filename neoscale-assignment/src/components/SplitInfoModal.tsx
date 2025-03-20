import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { X } from "lucide-react-native";
import api from "../utils/api";
import { COLORS } from "../constants/colors";
import { useModalStore } from "../stores/useModalStore";
import { SplitDetail } from "../types/Types";
import { MMKV } from "react-native-mmkv";
const storage = new MMKV();

export default function SplitInfoModal({}) {
  const [splitDetails, setSplitDetails] = useState<SplitDetail[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null);
  const {
    splitInfoModal: { isVisible, transaction },
    closeSplitInfoModal,
  } = useModalStore();
  useEffect(() => {
    if (isVisible && transaction) {
      fetchSplitDetails();
    }
    setError(null);
  }, [isVisible, transaction]);

  const fetchSplitDetails = async () => {
    if (!transaction) return;
    const offlineSplitDetails = storage.getString(
      `splitDetails-${transaction.id}`
    );
    if (offlineSplitDetails) {
      setSplitDetails(JSON.parse(offlineSplitDetails));
      return;
    }
    try {
      setLoading(true);
      setLoadingTitle("Loading Split Details...");
      setError(null);

      const res = await api.get(`/api/split/${transaction.id}`);
      console.log(res.data);

      const fetchedSplitDetails = res.data.friends || [];
      if (!Array.isArray(fetchedSplitDetails)) {
        throw new Error("Invalid split details format");
      }
      setSplitDetails(fetchedSplitDetails);
      storage.set(
        `splitDetails-${transaction.id}`,
        JSON.stringify(fetchedSplitDetails)
      );
      if (fetchedSplitDetails.length === 0) {
        setError("No split details found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load split details");
    } finally {
      setLoading(false);
      setLoadingTitle(null);
    }
  };

  const renderSplitDetailItem = useCallback(
    ({ item }: { item: SplitDetail }) => (
      <View style={styles.friendItem}>
        <Text style={styles.friendName}>{item.friendName}</Text>
        <Text
          style={[
            styles.friendName,
            {
              color: item.amountOwed > 0 ? COLORS.accent : "red",
            },
          ]}
        >
          +${item.amountOwed}
        </Text>
      </View>
    ),
    []
  );

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{transaction?.description}</Text>
            <Pressable onPress={closeSplitInfoModal}>
              <X color="#fff" size={22} />
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
            ) : splitDetails.length === 0 ? (
              <View style={styles.centerContent}>
                <Text style={styles.placeholderText}>
                  No split details available
                </Text>
              </View>
            ) : (
              <FlatList
                data={splitDetails}
                keyExtractor={(item) => item.friendId}
                renderItem={renderSplitDetailItem}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "54%",
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
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECEF",
  },

  friendName: {
    fontSize: 16,
    color: "#2D3748",
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
});
