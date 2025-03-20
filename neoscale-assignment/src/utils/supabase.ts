
import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';
const supabaseUrl = 'https://vkmtwzisyotkepviugnu.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbXR3emlzeW90a2Vwdml1Z251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NjYxOTgsImV4cCI6MjA1NzU0MjE5OH0.p-JL5j6BGjOdA7zpjCsQheuiCAMZMDJmv97yWr06-7k';
const storage = new MMKV();
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, 
    persistSession: true, 
    detectSessionInUrl: false, 
    storage: {
      getItem: (key: string) => storage.getString(key) || null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  },
});