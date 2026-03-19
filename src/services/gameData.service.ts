// src/services/gameData.service.ts
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Firestore
} from 'firebase/firestore';
import { db } from '@/config/firebase';

interface GameSession {
  userId?: string;
  character: string;
  score: number;
  startTime: string;
  endTime: string;
  duration: number;
  deviceInfo?: string;
  timestamp?: any;
}

interface LeaderboardEntry {
  userId?: string;
  playerName: string;
  character: string;
  score: number;
  timestamp: any;
  date?: string;
  deviceId?: string;
}

class GameDataService {
  private readonly SESSIONS_COLLECTION = 'game_sessions';
  private readonly LEADERBOARD_COLLECTION = 'leaderboard';
  private readonly DAILY_LEADERBOARD_COLLECTION = 'leaderboard_daily';
  private readonly STATS_COLLECTION = 'game_stats';
  private db: Firestore | undefined;

  constructor() {
    this.db = db;
    if (!this.db) {
      console.warn('Firestore is not initialized. Game data will not be saved.');
    }
  }

  // Check if Firestore is available
  private isFirestoreAvailable(): boolean {
    if (!this.db) {
      console.warn('Firestore is not initialized');
      return false;
    }
    return true;
  }

  // Save game session
  async saveGameSession(session: GameSession) {
    if (!this.isFirestoreAvailable()) {
      return { success: false, error: 'Firestore not initialized' };
    }

    try {
      const sessionRef = doc(collection(this.db!, this.SESSIONS_COLLECTION));
      await setDoc(sessionRef, {
        ...session,
        timestamp: serverTimestamp()
      });
      
      console.log('Game session saved');
      return { success: true, sessionId: sessionRef.id };
    } catch (error) {
      console.error('Error saving game session:', error);
      return { success: false, error };
    }
  }

  // Update global statistics
  async updateGlobalStats(score: number, character: string) {
    if (!this.isFirestoreAvailable()) {
      return { success: false, error: 'Firestore not initialized' };
    }

    try {
      const statsRef = doc(this.db!, this.STATS_COLLECTION, 'global');
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        await updateDoc(statsRef, {
          totalGamesPlayed: increment(1),
          totalScore: increment(score),
          [`characterUsage.${character}`]: increment(1),
          lastUpdated: serverTimestamp()
        });
      } else {
        await setDoc(statsRef, {
          totalGamesPlayed: 1,
          totalScore: score,
          characterUsage: { [character]: 1 },
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating global stats:', error);
      return { success: false, error };
    }
  }

  // Save to leaderboard (both all-time and daily)
  async saveToLeaderboard(entry: LeaderboardEntry) {
    if (!this.isFirestoreAvailable()) {
      return { success: false, error: 'Firestore not initialized' };
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Save to all-time leaderboard
      const allTimeRef = doc(collection(this.db!, this.LEADERBOARD_COLLECTION));
      await setDoc(allTimeRef, {
        ...entry,
        timestamp: serverTimestamp()
      });
      
      // Save to daily leaderboard with date field
      const dailyRef = doc(collection(this.db!, this.DAILY_LEADERBOARD_COLLECTION));
      await setDoc(dailyRef, {
        ...entry,
        date: today,
        timestamp: serverTimestamp()
      });
      
      console.log('Leaderboard updated');
      return { success: true };
    } catch (error) {
      console.error('Error saving to leaderboard:', error);
      return { success: false, error };
    }
  }

  // Get top scores (all-time)
  async getTopScores(limitCount: number = 10) {
    if (!this.isFirestoreAvailable()) {
      return { success: false, scores: [], error: 'Firestore not initialized' };
    }

    try {
      const q = query(
        collection(this.db!, this.LEADERBOARD_COLLECTION),
        orderBy('score', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const scores: LeaderboardEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        scores.push({ ...doc.data() } as LeaderboardEntry);
      });
      
      return { success: true, scores };
    } catch (error) {
      console.error('Error getting top scores:', error);
      return { success: false, scores: [], error };
    }
  }

  // Get today's top scores
  async getTodayTopScores(limitCount: number = 10) {
    if (!this.isFirestoreAvailable()) {
      return { success: false, scores: [], error: 'Firestore not initialized' };
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const q = query(
        collection(this.db!, this.DAILY_LEADERBOARD_COLLECTION),
        where('date', '==', today),
        orderBy('score', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const scores: LeaderboardEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        scores.push({ ...doc.data() } as LeaderboardEntry);
      });
      
      return { success: true, scores };
    } catch (error) {
      console.error('Error getting today\'s top scores:', error);
      return { success: false, scores: [], error };
    }
  }

  // Get character statistics
  async getCharacterStats() {
    if (!this.isFirestoreAvailable()) {
      return { 
        success: false, 
        stats: {
          totalGamesPlayed: 0,
          totalScore: 0,
          characterUsage: {}
        },
        error: 'Firestore not initialized'
      };
    }

    try {
      const statsRef = doc(this.db!, this.STATS_COLLECTION, 'global');
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        const data = statsDoc.data();
        return { 
          success: true, 
          stats: {
            totalGamesPlayed: data.totalGamesPlayed || 0,
            totalScore: data.totalScore || 0,
            characterUsage: data.characterUsage || {}
          }
        };
      }
      
      return { 
        success: true, 
        stats: {
          totalGamesPlayed: 0,
          totalScore: 0,
          characterUsage: {}
        }
      };
    } catch (error) {
      console.error('Error getting character stats:', error);
      return { 
        success: false, 
        stats: {
          totalGamesPlayed: 0,
          totalScore: 0,
          characterUsage: {}
        },
        error 
      };
    }
  }
}

export const gameDataService = new GameDataService();