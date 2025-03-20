import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { COLORS } from "../constants/colors";
import LinearGradient from 'react-native-linear-gradient';
import LottieView from "lottie-react-native";
export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0084ff', COLORS.background]} style={styles.banner}>
      <LottieView
      source={require("../../assets/BannerJson.json")}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop
    />
      </LinearGradient>
     <View
     style={{
       marginBottom: 50,
       alignItems: 'center',
       justifyContent: 'center'

     }}
     >
     <Text style={{
       fontSize: 30,
       fontWeight: 'bold',
       color: '#000000',
     }}>
        Hello!👋👋
      </Text>
      <Text style={styles.title}>
        Splitwise Prototype
      </Text>
     </View>
      <View
      style={{
        marginTop: 30
      }}
      >
       

      <GoogleSignInButton />
      </View>
      <View
      style={{
        position: 'absolute',
        bottom: 10
      }}
      >
      <Text style={[{
          marginBottom: 20,
          fontSize: 20,
          fontWeight: '400',
          textAlign: 'center',
        }]}>
          Submission By Aditya
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#1500ff",
    fontSize: 26,
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: 0.6,
  },
  banner: {
    height: Dimensions.get('window').height * 0.3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
,
 
});
