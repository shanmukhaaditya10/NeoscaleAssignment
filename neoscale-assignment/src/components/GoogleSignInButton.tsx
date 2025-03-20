import React from 'react';
import { Pressable, Text, StyleSheet, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/supabase';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native'; 
import { useUserStore } from '../stores/useUserStore';

const webClientId = '972241005441-p96cgdkcd4r4hfo1spp74gc89mfgm8dk.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId,
  scopes: ['profile', 'email'],
});

export default function GoogleSignInButton() {
  const navigation = useNavigation(); 
  const {isNewUser,setIsNewUser} = useUserStore();
  const signInWithGoogle = async () => {
    try {
      
      await GoogleSignin.hasPlayServices();

      
      await GoogleSignin.signOut();

      
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      
      const googleUser = userInfo.data?.user;
      const googleName = googleUser?.name || 'Unnamed User'; 

      
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) throw new Error(`Supabase auth error: ${error.message}`);

      const accessToken = data.session?.access_token;
      if (!accessToken) {
        throw new Error('No access token received from Supabase');
      }
      console.log('Supabase Access Token:', accessToken);

 
      const response = await fetch('http://192.168.29.41:3000/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: googleName }), 

      });

   
     

      const userProfile = await response.json();
      setIsNewUser(!!userProfile.isNewUser);
     

   
    } catch (error: any) {
      console.error('Sign-In Error:', error.message);

      alert(`Sign-in failed: ${error.message}`);
    }
  };

  return (
    <Pressable style={styles.button} onPress={signInWithGoogle}>
     <Image
          source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
          style={styles.googleIcon}
        />
      <Text style={styles.buttonText}>Sign in with Google</Text>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.modalHeader,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12, 
  },
});