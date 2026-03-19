import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '@/config/firebase';

class AuthService {
  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Sign up with email/password
  async signUp(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Send verification email
      await this.sendVerificationEmail();
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Link anonymous account with email
  async linkAnonymousAccount(email: string, password: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      const credential = EmailAuthProvider.credential(email, password);
      const userCredential = await linkWithCredential(user, credential);
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Send verification email
  async sendVerificationEmail() {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Get friendly error messages
  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export const authService = new AuthService();