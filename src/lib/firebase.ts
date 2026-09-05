import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  getDocFromServer, 
  collection, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { Appointment, UserProfile } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyCoASQHDvP_qVHxMmvi_dnB-m5VXwRsueI",
  authDomain: "wecare-hospitals-f3ab9.firebaseapp.com",
  projectId: "wecare-hospitals-f3ab9",
  storageBucket: "wecare-hospitals-f3ab9.firebasestorage.app",
  messagingSenderId: "78616013828",
  appId: "1:78616013828:web:53cf00a953da2e17099951",
  measurementId: "G-0XCRLQ9GXG"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on initial boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}
testFirestoreConnection();

export const ADMIN_EMAIL = 'sachin@gmail.com';
export const ADMIN_EMAILS = ['sachin@gmail.com', 'dhruv@gmail.com', 'elizabeth@gmail.com', 'sanjanayadav02072007@gmail.com'];

export function checkIsAdmin(user: FirebaseUser | null | undefined): boolean {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  return ADMIN_EMAILS.some(admin => admin.toLowerCase().trim() === email);
}

// --- Auth & User Firestore Operations ---

const USER_PROFILE_CACHE_KEY = 'wecare_user_profile_cache_';
const ALL_APPOINTMENTS_CACHE_KEY = 'wecare_all_hospital_appointments_v1';

export async function adminSignIn(email: string, password: string): Promise<FirebaseUser> {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    return cred.user;
  } catch (error: any) {
    // If the admin user doesn't exist yet on this Firebase project, auto-register the admin
    if (
      (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') &&
      ((normalizedEmail === 'sachin@gmail.com' && password === '808080') ||
       (normalizedEmail === 'dhruv@gmail.com' && password === '080808') ||
       (normalizedEmail === 'elizabeth@gmail.com' && password === '090909'))
    ) {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        const adminName = normalizedEmail === 'sachin@gmail.com' 
          ? 'Sachin (Hospital Administrator)' 
          : normalizedEmail === 'dhruv@gmail.com' 
            ? 'Dhruv (Hospital Administrator)' 
            : 'Dr. Elizabeth (Hospital Admin)';
        await updateProfile(newCred.user, {
          displayName: adminName
        });
        await saveUserProfileToFirestore(newCred.user, {
          displayName: adminName,
          phoneNumber: '+1 (555) 019-9999',
          address: 'WeCare Hospitals Metro Campus - Administration & OPD Control Suite'
        });
        return newCred.user;
      } catch (createErr) {
        throw createErr;
      }
    }
    throw error;
  }
}

export async function saveUserProfileToFirestore(user: FirebaseUser, additionalData?: { displayName?: string; phoneNumber?: string; address?: string }): Promise<UserProfile> {
  const adminRef = doc(db, 'admin', user.uid);
  const userRef = doc(db, 'users', user.uid);
  const pathForWrite = `admin/${user.uid}`;
  
  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: additionalData?.displayName || user.displayName || 'Patient',
    phoneNumber: additionalData?.phoneNumber || user.phoneNumber || '',
    address: additionalData?.address || '',
    createdAt: new Date().toISOString()
  };

  // Cache locally first for instant access
  try {
    localStorage.setItem(`${USER_PROFILE_CACHE_KEY}${user.uid}`, JSON.stringify(profileData));
  } catch (e) {
    // ignore
  }

  try {
    const existingDoc = await getDoc(adminRef);
    if (existingDoc.exists()) {
      const data = existingDoc.data() as UserProfile;
      const updatedProfile = {
        ...data,
        displayName: additionalData?.displayName || data.displayName || user.displayName || 'Patient',
        phoneNumber: additionalData?.phoneNumber || data.phoneNumber || '',
        address: additionalData?.address || data.address || ''
      };
      await setDoc(adminRef, updatedProfile, { merge: true });
      try {
        await setDoc(userRef, updatedProfile, { merge: true });
      } catch (e) {}
      try {
        localStorage.setItem(`${USER_PROFILE_CACHE_KEY}${user.uid}`, JSON.stringify(updatedProfile));
      } catch (e) {}
      return updatedProfile;
    } else {
      await setDoc(adminRef, profileData);
      try {
        await setDoc(userRef, profileData);
      } catch (e) {}
      return profileData;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    return profileData;
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  const pathForGet = `admin/${uid}`;
  try {
    const adminRef = doc(db, 'admin', uid);
    const snap = await getDoc(adminRef);
    if (snap.exists()) {
      const profile = snap.data() as UserProfile;
      try {
        localStorage.setItem(`${USER_PROFILE_CACHE_KEY}${uid}`, JSON.stringify(profile));
      } catch (e) {}
      return profile;
    }

    // Fallback check on users/{uid}
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const profile = userSnap.data() as UserProfile;
      try {
        localStorage.setItem(`${USER_PROFILE_CACHE_KEY}${uid}`, JSON.stringify(profile));
      } catch (e) {}
      return profile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pathForGet);
  }

  // Fallback to local profile cache if offline or permissions pending
  try {
    const cached = localStorage.getItem(`${USER_PROFILE_CACHE_KEY}${uid}`);
    if (cached) {
      return JSON.parse(cached) as UserProfile;
    }
  } catch (e) {}

  return null;
}

// --- Appointment / User Booking Operations ---

export async function saveAppointmentToFirestore(userId: string, appointment: Appointment): Promise<void> {
  const appointmentPayload: Appointment = {
    ...appointment,
    userId: userId
  };

  // 1. Update local cache
  try {
    const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
    const existing: Appointment[] = saved ? JSON.parse(saved) : [];
    const updated = [appointmentPayload, ...existing.filter(a => a.id !== appointmentPayload.id)];
    localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(updated));
  } catch (e) {}

  // 2. Save under admin subcollection 'users' (replacing users/{userId}/appointments)
  const pathForUserWrite = `admin/${userId}/users/${appointment.id}`;
  try {
    const apptRef = doc(db, 'admin', userId, 'users', appointment.id);
    await setDoc(apptRef, appointmentPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForUserWrite);
  }

  // Also sync to legacy subcollection if needed
  try {
    const legacyUserRef = doc(db, 'users', userId, 'appointments', appointment.id);
    await setDoc(legacyUserRef, appointmentPayload);
  } catch (e) {}

  // 3. Save under central 'users' collection (replacing all_appointments)
  const pathForCentralWrite = `users/${appointment.id}`;
  try {
    const centralRef = doc(db, 'users', appointment.id);
    await setDoc(centralRef, appointmentPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForCentralWrite);
  }

  // Also sync to all_appointments for backward compatibility
  try {
    const legacyCentralRef = doc(db, 'all_appointments', appointment.id);
    await setDoc(legacyCentralRef, appointmentPayload);
  } catch (e) {}
}

export async function updateAppointmentInFirestore(userId: string, appointmentId: string, updates: Partial<Appointment>): Promise<void> {
  // Update local cache
  try {
    const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
    if (saved) {
      const existing: Appointment[] = JSON.parse(saved);
      const updated = existing.map(a => a.id === appointmentId ? { ...a, ...updates } : a);
      localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  // Update in admin/{userId}/users/{appointmentId}
  const pathForUpdate = `admin/${userId}/users/${appointmentId}`;
  try {
    const apptRef = doc(db, 'admin', userId, 'users', appointmentId);
    await updateDoc(apptRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pathForUpdate);
  }

  try {
    const legacyUserRef = doc(db, 'users', userId, 'appointments', appointmentId);
    await updateDoc(legacyUserRef, updates);
  } catch (e) {}

  // Update in central 'users' collection
  const pathForCentral = `users/${appointmentId}`;
  try {
    const centralRef = doc(db, 'users', appointmentId);
    await updateDoc(centralRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pathForCentral);
  }

  try {
    const legacyCentral = doc(db, 'all_appointments', appointmentId);
    await updateDoc(legacyCentral, updates);
  } catch (e) {}
}

export async function deleteAppointmentFromFirestore(userId: string, appointmentId: string): Promise<void> {
  // Update local cache
  try {
    const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
    if (saved) {
      const existing: Appointment[] = JSON.parse(saved);
      const updated = existing.filter(a => a.id !== appointmentId);
      localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  // Delete from admin/{userId}/users/{appointmentId}
  const pathForDelete = `admin/${userId}/users/${appointmentId}`;
  try {
    const apptRef = doc(db, 'admin', userId, 'users', appointmentId);
    await deleteDoc(apptRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, pathForDelete);
  }

  try {
    const legacyRef = doc(db, 'users', userId, 'appointments', appointmentId);
    await deleteDoc(legacyRef);
  } catch (e) {}

  // Delete from central 'users' collection
  const pathForCentral = `users/${appointmentId}`;
  try {
    const centralRef = doc(db, 'users', appointmentId);
    await deleteDoc(centralRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, pathForCentral);
  }

  try {
    const legacyCentral = doc(db, 'all_appointments', appointmentId);
    await deleteDoc(legacyCentral);
  } catch (e) {}
}

export function subscribeToUserAppointments(
  userId: string, 
  onAppointmentsChange: (appointments: Appointment[]) => void,
  onError?: (error: unknown) => void
) {
  const pathForSnapshot = `admin/${userId}/users`;
  const apptsRef = collection(db, 'admin', userId, 'users');
  const q = query(apptsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const appointmentsList: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        appointmentsList.push(docSnap.data() as Appointment);
      });
      if (appointmentsList.length > 0) {
        onAppointmentsChange(appointmentsList);
      } else {
        // Check fallback to users/{userId}/appointments
        const fallbackRef = collection(db, 'users', userId, 'appointments');
        const qFallback = query(fallbackRef, orderBy('createdAt', 'desc'));
        getDocs(qFallback).then((fallbackSnap) => {
          const list: Appointment[] = [];
          fallbackSnap.forEach((d) => list.push(d.data() as Appointment));
          onAppointmentsChange(list);
        }).catch(() => {
          onAppointmentsChange([]);
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, pathForSnapshot);
      if (onError) onError(error);
    }
  );
}

// --- Admin Global Appointments / Users Bookings Operations ---

export function subscribeToAllHospitalAppointments(
  onAppointmentsChange: (appointments: Appointment[]) => void,
  onError?: (error: unknown) => void
) {
  const pathForSnapshot = 'users';
  const centralRef = collection(db, 'users');
  const q = query(centralRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const appointmentsList: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Ensure it is a valid booking/appointment document
        if (data && (data.doctorId || data.patientName || data.timeSlot)) {
          appointmentsList.push(data as Appointment);
        }
      });
      if (appointmentsList.length > 0) {
        try {
          localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(appointmentsList));
        } catch (e) {}
        onAppointmentsChange(appointmentsList);
      } else {
        // Fallback check on all_appointments
        const legacyRef = collection(db, 'all_appointments');
        const qLegacy = query(legacyRef, orderBy('createdAt', 'desc'));
        getDocs(qLegacy).then((legacySnap) => {
          const list: Appointment[] = [];
          legacySnap.forEach((d) => list.push(d.data() as Appointment));
          if (list.length > 0) {
            onAppointmentsChange(list);
          }
        }).catch(() => {});
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, pathForSnapshot);
      // Fallback to cache
      try {
        const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
        if (saved) {
          onAppointmentsChange(JSON.parse(saved));
        }
      } catch (e) {}
      if (onError) onError(error);
    }
  );
}

export async function adminCreateAppointment(appointment: Appointment): Promise<void> {
  const appointmentPayload: Appointment = {
    ...appointment,
    userId: appointment.userId || 'admin_desk'
  };

  // Cache locally
  try {
    const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
    const existing: Appointment[] = saved ? JSON.parse(saved) : [];
    const updated = [appointmentPayload, ...existing.filter(a => a.id !== appointmentPayload.id)];
    localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Write to all_appointments
  const pathForCentral = `all_appointments/${appointment.id}`;
  try {
    const centralRef = doc(db, 'all_appointments', appointment.id);
    await setDoc(centralRef, appointmentPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForCentral);
  }

  // If valid user ID is attached (not synthetic walk-in), also write to user subcollection
  if (appointmentPayload.userId && !appointmentPayload.userId.startsWith('admin_')) {
    const pathForUser = `users/${appointmentPayload.userId}/appointments/${appointment.id}`;
    try {
      const userRef = doc(db, 'users', appointmentPayload.userId, 'appointments', appointment.id);
      await setDoc(userRef, appointmentPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pathForUser);
    }
  }
}

export async function adminUpdateAppointment(
  appointmentId: string, 
  updates: Partial<Appointment>, 
  userId?: string
): Promise<void> {
  // Update cache
  try {
    const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
    if (saved) {
      const existing: Appointment[] = JSON.parse(saved);
      const updated = existing.map(a => a.id === appointmentId ? { ...a, ...updates } : a);
      localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  const pathForCentral = `all_appointments/${appointmentId}`;
  try {
    const centralRef = doc(db, 'all_appointments', appointmentId);
    await updateDoc(centralRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pathForCentral);
  }

  if (userId && !userId.startsWith('admin_')) {
    const pathForUser = `users/${userId}/appointments/${appointmentId}`;
    try {
      const userRef = doc(db, 'users', userId, 'appointments', appointmentId);
      await updateDoc(userRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, pathForUser);
    }
  }
}

export async function adminDeleteAppointment(appointmentId: string, userId?: string): Promise<void> {
  // Update cache
  try {
    const saved = localStorage.getItem(ALL_APPOINTMENTS_CACHE_KEY);
    if (saved) {
      const existing: Appointment[] = JSON.parse(saved);
      const updated = existing.filter(a => a.id !== appointmentId);
      localStorage.setItem(ALL_APPOINTMENTS_CACHE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  const pathForCentral = `all_appointments/${appointmentId}`;
  try {
    const centralRef = doc(db, 'all_appointments', appointmentId);
    await deleteDoc(centralRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, pathForCentral);
  }

  if (userId && !userId.startsWith('admin_')) {
    const pathForUser = `users/${userId}/appointments/${appointmentId}`;
    try {
      const userRef = doc(db, 'users', userId, 'appointments', appointmentId);
      await deleteDoc(userRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, pathForUser);
    }
  }
}

