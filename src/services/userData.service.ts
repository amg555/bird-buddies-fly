import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserPurchase } from '@/types';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  purchases: {
    hasLifetimeAccess: boolean;
    purchaseDate?: string;
    transactionId?: string;
    amount?: number;
    paymentMethod?: string;
    recoveryCode?: string;
  };
  gameStats?: {
    highScore: number;
    totalGamesPlayed: number;
    totalScore: number;
    favoriteCharacter?: string;
  };
  devices?: Array<{
    deviceId: string;
    lastActive: string;
    deviceInfo?: string;
  }>;
  createdAt?: any;
  updatedAt?: any;
}

class UserDataService {
  private readonly COLLECTION = 'users';

  // Create or update user data
  async saveUserData(uid: string, data: Partial<UserData>) {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      
      // Check if user exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          uid,
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { success: false, error };
    }
  }

  // Get user data
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Save purchase data
  async savePurchase(uid: string, purchase: UserPurchase, recoveryCode: string) {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      
      await updateDoc(userRef, {
        purchases: {
          hasLifetimeAccess: true,
          purchaseDate: purchase.purchaseDate,
          transactionId: purchase.transactionId,
          amount: purchase.amount,
          paymentMethod: purchase.paymentMethod,
          recoveryCode
        },
        updatedAt: serverTimestamp()
      });
      
      // Also save to a purchases collection for admin tracking
      await this.savePurchaseRecord(uid, purchase, recoveryCode);
      
      return { success: true };
    } catch (error) {
      console.error('Error saving purchase:', error);
      return { success: false, error };
    }
  }

  // Save purchase record for tracking
  private async savePurchaseRecord(uid: string, purchase: UserPurchase, recoveryCode: string) {
    try {
      const purchaseRef = doc(collection(db, 'purchases'));
      await setDoc(purchaseRef, {
        uid,
        ...purchase,
        recoveryCode,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving purchase record:', error);
    }
  }

  // Verify recovery code
  async verifyRecoveryCode(code: string): Promise<{
    success: boolean;
    userData?: UserData;
    error?: string;
  }> {
    try {
      // Search for user with this recovery code
      const q = query(
        collection(db, this.COLLECTION),
        where('purchases.recoveryCode', '==', code)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data() as UserData;
        return { success: true, userData };
      }
      
      return { 
        success: false, 
        error: 'Invalid recovery code' 
      };
    } catch (error) {
      console.error('Error verifying recovery code:', error);
      return { 
        success: false, 
        error: 'Failed to verify code' 
      };
    }
  }

  // Update game stats
  async updateGameStats(uid: string, stats: Partial<UserData['gameStats']>) {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      
      await updateDoc(userRef, {
        gameStats: stats,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating game stats:', error);
      return { success: false, error };
    }
  }

  // Add device info
  async addDevice(uid: string, deviceId: string, deviceInfo?: string) {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      
      await updateDoc(userRef, {
        devices: arrayUnion({
          deviceId,
          lastActive: new Date().toISOString(),
          deviceInfo
        }),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding device:', error);
      return { success: false, error };
    }
  }
}

export const userDataService = new UserDataService();