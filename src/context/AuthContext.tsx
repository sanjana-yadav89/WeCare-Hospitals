import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  saveUserProfileToFirestore, 
  getUserProfileFromFirestore,
  checkIsAdmin,
  adminSignIn,
  ADMIN_EMAIL
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  adminEmail: string;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup', onSuccess?: () => void) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [pendingSuccessCallback, setPendingSuccessCallback] = useState<(() => void) | null>(null);

  const isAdmin = checkIsAdmin(user);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', onSuccess?: () => void) => {
    setAuthModalMode(mode);
    if (onSuccess) {
      setPendingSuccessCallback(() => onSuccess);
    } else {
      setPendingSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingSuccessCallback(null);
  };

  const triggerPendingCallback = () => {
    if (pendingSuccessCallback) {
      pendingSuccessCallback();
      setPendingSuccessCallback(null);
    }
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch or create profile in Firestore
          let userProfile = await getUserProfileFromFirestore(currentUser.uid);
          if (!userProfile) {
            userProfile = await saveUserProfileToFirestore(currentUser);
          }
          setProfile(userProfile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfileFromFirestore(user.uid);
      if (p) setProfile(p);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userProfile = await saveUserProfileToFirestore(result.user);
        setProfile(userProfile);
        closeAuthModal();
        triggerPendingCallback();
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        let userProfile = await getUserProfileFromFirestore(result.user.uid);
        if (!userProfile) {
          userProfile = await saveUserProfileToFirestore(result.user);
        }
        setProfile(userProfile);
        closeAuthModal();
        triggerPendingCallback();
      }
    } catch (error: any) {
      console.error('Email Sign In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        const userProfile = await saveUserProfileToFirestore(result.user, {
          displayName: name,
          phoneNumber: phone
        });
        setProfile(userProfile);
        closeAuthModal();
        triggerPendingCallback();
      }
    } catch (error: any) {
      console.error('Email Sign Up Error:', error);
      throw error;
    }
  };

  const adminLogin = async (email: string, pass: string) => {
    try {
      const loggedUser = await adminSignIn(email, pass);
      let userProfile = await getUserProfileFromFirestore(loggedUser.uid);
      if (!userProfile) {
        const adminName = email.toLowerCase().includes('sachin')
          ? 'Sachin (Hospital Administrator)'
          : email.toLowerCase().includes('dhruv')
            ? 'Dhruv (Hospital Administrator)'
            : 'Dr. Elizabeth (Hospital Admin)';
        userProfile = await saveUserProfileToFirestore(loggedUser, {
          displayName: adminName
        });
      }
      setProfile(userProfile);
      closeAuthModal();
      triggerPendingCallback();
    } catch (error: any) {
      console.error('Admin Sign In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        adminEmail: ADMIN_EMAIL,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        adminLogin,
        logout,
        refreshProfile,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

