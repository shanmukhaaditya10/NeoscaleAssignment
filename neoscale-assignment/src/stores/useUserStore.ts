import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  isNewUser?: boolean;
  setIsNewUser: (isNewUser: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  
  setUser: (user) => {
    if (user) {
      storage.set("userSession", JSON.stringify(user)); 
    } else {
      storage.delete("userSession"); 
    }
    set({ user, loading: false });
  },

  clearUser: () => {
    storage.delete("userSession"); 
    set({ user: null, loading: false });
  },

  fetchUser: async () => {
    set({ loading: true });

    try {
      
      const savedUser = storage.getString("userSession");
      if (savedUser) {
        set({ user: JSON.parse(savedUser), loading: false });
        return;
      }

      
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      set({
        user: user ? user : null,
        loading: false,
      });

      if (user) {
        storage.set("userSession", JSON.stringify(user)); 
      }
    } catch (error) {
      console.log("Error fetching user:", error);
      set({ user: null, loading: false });
    }
  },
  isNewUser: false,
  setIsNewUser: (isNewUser: boolean) => set({ isNewUser }),
}));


supabase.auth.onAuthStateChange((_event, session) => {
  const userStore = useUserStore.getState();
  if (session?.user) {
    userStore.setUser(session.user);
  } else {
    userStore.clearUser();
  }
});
