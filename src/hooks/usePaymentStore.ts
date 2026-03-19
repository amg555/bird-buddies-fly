import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPurchase } from '@/types';

interface PaymentStore {
  userPurchase: UserPurchase;
  isProcessingPayment: boolean;
  pendingTransactionId: string | null;
  
  setUserPurchase: (purchase: UserPurchase) => void;
  setProcessingPayment: (processing: boolean) => void;
  setPendingTransaction: (id: string | null) => void;
  hasLifetimeAccess: () => boolean;
  grantLifetimeAccess: (transactionId: string, email?: string) => void;
  clearPurchaseData: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      userPurchase: {
        hasLifetimeAccess: false,
      },
      isProcessingPayment: false,
      pendingTransactionId: null,

      setUserPurchase: (purchase) => set({ userPurchase: purchase }),
      
      setProcessingPayment: (processing) => set({ isProcessingPayment: processing }),
      
      setPendingTransaction: (id) => set({ pendingTransactionId: id }),
      
      hasLifetimeAccess: () => get().userPurchase.hasLifetimeAccess,
      
      grantLifetimeAccess: (transactionId, email) => {
        set({
          userPurchase: {
            hasLifetimeAccess: true,
            purchaseDate: new Date().toISOString(),
            transactionId,
            amount: 4,
            paymentMethod: 'PayU',
            email
          },
          pendingTransactionId: null
        });
        
        console.log('🎉 Lifetime access granted via PayU!', {
          transactionId,
          date: new Date().toISOString()
        });
      },
      
      clearPurchaseData: () => {
        set({
          userPurchase: {
            hasLifetimeAccess: false
          },
          pendingTransactionId: null
        });
      }
    }),
    {
      name: 'bird-buddies-lifetime-access',
      partialize: (state) => ({ 
        userPurchase: state.userPurchase
      })
    }
  )
);