import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Info, Split } from "lucide-react-native"; 
import { COLORS } from "../constants/colors";
import { useModalStore } from "../stores/useModalStore";
import { Transaction } from "../types/Types";
import { loadPendingSplits } from "../utils/storage";




function RightActionForSplit(drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    const translateX = Math.min(drag.value + 80, 0);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Reanimated.View style={[styles.swipeAction, styleAnimation]}>
      <View style={styles.swipeActionContent}>
        <Split size={17} color="white" />
        <Text style={styles.swipeText}>Split</Text>
      </View>
    </Reanimated.View>
  );
}


function RightActionForInfo(drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    const translateX = Math.min(drag.value + 80, 0);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Reanimated.View style={[styles.swipeAction, styleAnimation, { backgroundColor: "#007AFF" }]}>
      <View style={styles.swipeActionContent}>
        <Info size={17} color="white" />
        <Text style={styles.swipeText}>Info</Text>
      </View>
    </Reanimated.View>
  );
}

export default function TransactionCard({
  item,
  modalVisible,
}: {
  item: Transaction;
  modalVisible: boolean;
}) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { openSplitModal, openSplitInfoModal, splitModal, splitInfoModal } = useModalStore();

  const pendingSplits = loadPendingSplits()

  if (pendingSplits.length > 0) {
    pendingSplits.forEach((pendingSplit) => {
      if (pendingSplit.transactionId === item.id) {
        item.isSplit = true;
        item.isPending = true;
      }
    });
    
  }


  const handleSwipeWillOpen = () => {
    if (swipeableRef.current) {

      swipeableRef.current.close();
    }
    if (item.isSplit) {
      openSplitInfoModal(item); 
    } else {
      openSplitModal(item); 
    }
  };

  const cardContent = (
    <View style={styles.transactionCard}>
      <View style={styles.leftSection}>
        <View
        style={{
          flexDirection:"row",
         alignItems:"center",
         columnGap:3
        }}
        >
        <Text style={styles.description}>{item.description}</Text>
       
        </View>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amount}>
          $
          {typeof item.amount === "string"
            ? parseFloat(item.amount).toFixed(2)
            : item.amount.toFixed(2)}
        </Text>
        <Text
          style={[
            styles.splitStatus,
            { color: item.isSplit ? "#38A169" : "#718096" },
          ]}
        >
          {(item.isSplit && !item.isPending) ? "✓ Split" : (item.isSplit && item.isPending) ? "⌛ Pending" : "Swipe left"}
        </Text>
      </View>
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={1}
      enableTrackpadTwoFingerGesture
      rightThreshold={80}
      overshootRight={false}
      renderRightActions={item.isSplit ? RightActionForInfo : RightActionForSplit} 
      onSwipeableWillOpen={handleSwipeWillOpen}
      simultaneousHandlers={null}
      enabled={!modalVisible && !splitModal.isVisible && !splitInfoModal.isVisible} 
    >
      {cardContent}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 7,
    height: 80,
    marginBottom: 10,
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  description: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  date: {
    fontSize: 12,
    color: "#718096",
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  splitStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  swipeAction: {
    backgroundColor: COLORS.accent, 
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  swipeActionContent: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  swipeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});