import React, { useEffect } from "react";
import AppNavigator from "./src/navigators/AppNavigator";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from '@react-native-community/netinfo';
export default function App() {


  return (
    <>
        <GestureHandlerRootView style={{ flex: 1 }}>
 
      <StatusBar
        barStyle="dark-content" // Dark text/icons for light background
        backgroundColor="#E8ECEF" // Match TransactionsScreen background
        hidden={false} // Ensure it’s visible
      />
      <AppNavigator /> 
       </GestureHandlerRootView>
    </>
  );
}
