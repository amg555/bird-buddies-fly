//D:\PROJECTS\GAME\Bird-Buddies-Fly(BUTTON PAYMENT)\src\hooks\usePurchaseRecovery.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

interface RecoveryStore {
  recoveryCode: string | null;
  recoveryEmail: string | null;
  generateRecoveryCode: (transactionId: string, email?: string) => string;
  verifyRecoveryCode: (code: string) => Promise<boolean>;
  saveRecoveryInfo: (code: string, email?: string) => void;
}

export const usePurchaseRecovery = create<RecoveryStore>()(
  persist(
    (set, get) => ({
      recoveryCode: null,
      recoveryEmail: null,

      generateRecoveryCode: (transactionId: string, email?: string) => {
        const timestamp = Date.now();
        const data = `${transactionId}-${timestamp}`;
        const hash = CryptoJS.SHA256(data).toString();
        const code = `BB-${hash.substring(0, 8).toUpperCase()}-${hash.substring(8, 16).toUpperCase()}`;
        
        set({ 
          recoveryCode: code,
          recoveryEmail: email 
        });
        
        return code;
      },

      verifyRecoveryCode: async (code: string) => {
        const stored = get().recoveryCode;
        return stored === code;
      },

      saveRecoveryInfo: (code: string, email?: string) => {
        set({ 
          recoveryCode: code,
          recoveryEmail: email 
        });
      }
    }),
    {
      name: 'bird-buddies-recovery'
    }
  )
);