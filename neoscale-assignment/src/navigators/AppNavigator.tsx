import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import { ActivityIndicator, View } from 'react-native';
import { useUserStore } from '../stores/useUserStore';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
 
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}