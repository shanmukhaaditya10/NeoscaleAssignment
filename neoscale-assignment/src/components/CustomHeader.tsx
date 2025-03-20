import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { User } from "lucide-react-native";
import { useModalStore } from "../stores/useModalStore";
import UserProfileModal from "./UserProfileModal";
import { useUserStore } from "../stores/useUserStore";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../constants/colors";

const CustomHeader = ({

}: {

}) => {
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const {
    userProfileModal: { isVisible },
    openUserProfileModal

  } = useModalStore();
  const { user} = useUserStore();
  const getUserProfile = async () => {
   
    
    setProfileImage(user?.user_metadata?.avatar_url);
    return user?.user_metadata?.avatar_url;
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <>
     <LinearGradient colors={['#a7d4ff', COLORS.background]} >

    <View
      style={{
        flexDirection: "row",
        justifyContent:"center",
        alignItems: "center",
        paddingTop: 15,
        paddingHorizontal: 10,
       
      }}
      >
      <TouchableOpacity
      onPress={()=>{
        openUserProfileModal();
      }}
      >
        {profileImage ? (
          <Image
          source={{ uri: profileImage }}
          style={{ width: 35, height: 35, borderRadius: 35 / 2 }}
          />
          ) : (
            <User size={23} color={"#2D3748"} />
            )}
      </TouchableOpacity>
        <View
        style={{
          flex:1,
          justifyContent: "center",
          paddingRight:20
        }}
        >

      <Text style={styles.title}>Your Transactions</Text>
        </View>
     
    
    </View>
          </LinearGradient>
    
     {
      isVisible &&
    <UserProfileModal/>
    }
    </>
  );
};

export default CustomHeader;
const styles = StyleSheet.create({
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "center",
  },
});
