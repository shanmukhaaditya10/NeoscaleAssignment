import { Modal, View, Text, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { PropsWithChildren, useState } from 'react';
import { User, X } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useModalStore } from '../stores/useModalStore';
import { useUserStore } from '../stores/useUserStore';
import { supabase } from '../utils/supabase';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV()
type Props = PropsWithChildren<{

 
}>;

export default function UserProfileModal({ 
}: Props) {
  
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


    const  { userProfileModal: { isVisible, userId }, closeUserProfileModal} = useModalStore();
    const  { user,clearUser} = useUserStore();

    const handleLogout = async () => {
        try {
          setLoading(true);
          setError(null);
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          clearUser(); 
          closeUserProfileModal(); 
          storage.clearAll()
        } catch (err: any) {
          setError(err.message || 'Failed to log out');
        } finally {
          setLoading(false);
        }
      };



  return (
    <View>
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
        <View
     
      >
        {user?.user_metadata?.avatar_url ? (
          <Image
            source={{ uri: user?.user_metadata?.avatar_url }}
            style={{ width: 45, height: 45, borderRadius: 45 / 2 }}
          />
        ) : (
          <User size={23} color={"#2D3748"} />
        )}
      </View>
          <Text style={styles.title}>{user?.user_metadata?.full_name}</Text>
          <Pressable onPress={closeUserProfileModal}>
            <X color="#fff" size={26} />
          </Pressable>
        </View>
     
        <View style={styles.contentContainer}>
        {loading ? (
            <View style={styles.centerContent}>
              <Text style={styles.loadingText}>Logging out...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.contentText}>Email: {user?.email || 'Not provided'}</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
    

     
      </View>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '35%',
    width: '100%',
    backgroundColor: COLORS.bgWhite,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  contentText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#E53E3E', 
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  titleContainer: {
    height: '30%',
    backgroundColor: COLORS.modalHeader,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECEF',
  },
  checkbox: {
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#CBD5E0',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent : 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
 
  closeButton: {
    padding: 4,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#718096',
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    textAlign: 'center',
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E8ECEF',
    paddingTop: 12,
    alignItems: 'center',
  },
  splitButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '90%', 
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },

});
