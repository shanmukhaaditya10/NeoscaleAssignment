import { create } from 'zustand';
import { Transaction } from '../types/Types';

interface SplitModalState {
  isVisible: boolean;
  transaction?: Transaction;
}

interface SplitInfoModalState {
  isVisible: boolean;
  transaction?: Transaction; 
}

interface UserProfileModalState {
  isVisible: boolean;
  userId?: string;
}

interface FilterModalState {
  isVisible: boolean;
  filterOptions?: Record<string, any>;
}

interface ModalStore {
  splitModal: SplitModalState;
  splitInfoModal: SplitInfoModalState; 
  userProfileModal: UserProfileModalState;
  filterModal: FilterModalState;

  
  openSplitModal: (transaction?: Transaction) => void;
  closeSplitModal: () => void;

  
  openSplitInfoModal: (transaction?: Transaction) => void; 
  closeSplitInfoModal: () => void; 

  
  openUserProfileModal: (userId?: string) => void;
  closeUserProfileModal: () => void;

  
  openFilterModal: (filterOptions?: Record<string, any>) => void;
  closeFilterModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  
  splitModal: {
    isVisible: false,
    transaction: undefined,
  },
  splitInfoModal: {
    isVisible: false,
    transaction: undefined, 
  },
  userProfileModal: {
    isVisible: false,
    userId: undefined,
  },
  filterModal: {
    isVisible: false,
    filterOptions: undefined,
  },

  
  openSplitModal: (transaction?: Transaction) =>
    set((state) => ({
      splitModal: {
        ...state.splitModal,
        isVisible: true,
        transaction: transaction ?? undefined,
      },
    })),
  closeSplitModal: () =>
    set((state) => ({
      splitModal: {
        ...state.splitModal,
        isVisible: false,
        transaction: undefined,
      },
    })),

  
  openSplitInfoModal: (transaction?: Transaction) =>
    set((state) => ({
      splitInfoModal: {
        ...state.splitInfoModal,
        isVisible: true,
        transaction: transaction ?? undefined,
      },
    })),
  closeSplitInfoModal: () =>
    set((state) => ({
      splitInfoModal: {
        ...state.splitInfoModal,
        isVisible: false,
        transaction: undefined,
      },
    })),

  
  openUserProfileModal: (userId?: string) =>
    set((state) => ({
      userProfileModal: {
        ...state.userProfileModal,
        isVisible: true,
        userId: userId ?? undefined,
      },
    })),
  closeUserProfileModal: () =>
    set((state) => ({
      userProfileModal: {
        ...state.userProfileModal,
        isVisible: false,
        userId: undefined,
      },
    })),

  
  openFilterModal: (filterOptions?: Record<string, any>) =>
    set((state) => ({
      filterModal: {
        ...state.filterModal,
        isVisible: true,
        filterOptions: filterOptions ?? undefined,
      },
    })),
  closeFilterModal: () =>
    set((state) => ({
      filterModal: {
        ...state.filterModal,
        isVisible: false,
        filterOptions: undefined,
      },
    })),
}));