import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';

import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId,
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Auth state observer
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Current authenticated Firebase user
export const getCurrentAuthUser = (): User | null => {
  return auth.currentUser;
};

// Parse Firebase Auth errors into helpful user messages
export const getFirebaseAuthErrorMessage = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address format is invalid.';
    case 'auth/user-disabled':
      return 'This surveyor account has been disabled. Contact WBSEDCL administrator.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please switch to Sign Up to create an account.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials or sign up.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please Sign In instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with letters and numbers.';
    case 'auth/network-request-failed':
      return 'Network error: Please verify your internet connection to reach Firebase.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed attempts. Please try again in a few moments or reset password.';
    default:
      return error?.message || 'Authentication failed. Please check your credentials.';
  }
};

// Initialize Firestore with HTTP long-polling and multi-tab persistent IndexedDB cache
// This directly resolves the "@firebase/firestore: Could not reach Cloud Firestore backend [code=unavailable]"
// warning by replacing fragile streaming channels with robust HTTP long-polling.
const databaseId = (firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)')
  ? firebaseConfigJson.firestoreDatabaseId
  : undefined;

let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    databaseId
  );
} catch {
  try {
    firestoreDb = initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      databaseId
    );
  } catch {
    try {
      firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    } catch {
      firestoreDb = getFirestore(app);
    }
  }
}

export const db = firestoreDb;

// Standardized Firestore Error Handler
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
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// Connectivity test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'settings', 'connectivity_check'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline') || error?.code === 'unavailable') {
      console.info('Firestore client operating in offline mode (local cache active).');
    }
    return false;
  }
}

// Re-enable network manually if needed
export const reconnectFirestoreNetwork = async (): Promise<boolean> => {
  try {
    await enableNetwork(db);
    return true;
  } catch (err) {
    console.warn('reconnectFirestoreNetwork notice:', err);
    return false;
  }
};

// Auth helper functions
export const signInUser = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerUser = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const resetUserPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

// Firestore collections and helpers
export const COLLECTIONS = {
  USERS: 'users',
  DTRS: 'dtrs',
  POLES: 'poles',
  SETTINGS: 'settings',
};

// User Profile Service
export const saveUserProfile = async (userId: string, profileData: any) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(
    userRef,
    {
      ...profileData,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
};

export const DEFAULT_INITIAL_DTRS = [
  {
    id: 'dtr-1',
    dtrCode: 'DTR-WB-7401',
    village: 'Sonarpur',
    location: 'North Feeder Grid #4',
    landMarks: 'Near Primary Health Center',
    block: 'BLOCK 1',
    division: 'RAIGANJ',
    capacity: 100,
    ccc: 'CCC-492',
    feeder: '11kV Sonarpur Feeder',
    substation: 'Sonarpur 33/11kV Substation',
    drgNo: 'RNJ01',
    docDate: '12-04-2024',
    jmcNo: 'JMC-981',
    censusCode: '312450',
    gp: 'Sonarpur GP',
    routeLength: 1250,
    newPole: 18,
    staySet: 6,
    stayClampType1: 8,
    stayClampType2: 4,
    giEarthSpike: 18,
    suspension: 12,
    deadEnd: 6,
    distributionJunctionBox: 4,
    eyeHook: 18,
    ltPoleClampType1: 18,
    ltPoleClampType2: 12,
    ipcForDB50To70: 8,
    ipcFor16SQMM: 24,
    ipcForAbcToAbc50To70SQMM: 4,
    straightThroughJoint70SQMM: 2,
    straightThroughJoint16SQMM: 6,
    straightThroughJoint50SQMM: 2,
    serviceConnection1ph: 35,
    serviceConnection3ph: 8,
    ltBracket1Ph: 14,
    ltBracket3Ph: 6,
    backClamp: 10,
    dIronClamp: 8,
    shackleInsulator: 16,
    ciReel: 12,
    shackleStrap: 16,
    boxBracket: 4,
    lc: 2,
    exStay: 2,
    acsr50_3: 650,
    aac25_3: 600,
  },
  {
    id: 'dtr-2',
    dtrCode: 'DTR-WB-7402',
    village: 'Baruipur',
    location: 'Industrial Zone Sub-12',
    landMarks: 'Opposite Cold Storage',
    block: 'BLOCK 2',
    division: 'RAIGANJ',
    capacity: 160,
    ccc: 'CCC-318',
    feeder: '11kV Baruipur Feeder',
    substation: 'Baruipur Central Substation',
    drgNo: 'RNJ02',
    docDate: '20-05-2024',
    jmcNo: 'JMC-982',
    censusCode: '312451',
    gp: 'Baruipur GP',
    routeLength: 940,
    newPole: 14,
    staySet: 4,
    stayClampType1: 6,
    stayClampType2: 2,
    giEarthSpike: 14,
    suspension: 10,
    deadEnd: 4,
    distributionJunctionBox: 3,
    eyeHook: 14,
    ltPoleClampType1: 14,
    ltPoleClampType2: 8,
    ipcForDB50To70: 6,
    ipcFor16SQMM: 18,
    ipcForAbcToAbc50To70SQMM: 2,
    straightThroughJoint70SQMM: 1,
    straightThroughJoint16SQMM: 4,
    straightThroughJoint50SQMM: 1,
    serviceConnection1ph: 28,
    serviceConnection3ph: 12,
    ltBracket1Ph: 10,
    ltBracket3Ph: 8,
    backClamp: 8,
    dIronClamp: 6,
    shackleInsulator: 12,
    ciReel: 8,
    shackleStrap: 12,
    boxBracket: 3,
    lc: 1,
    exStay: 1,
    acsr50_4: 940,
  },
  {
    id: 'dtr-3',
    dtrCode: 'DTR-WB-7403',
    village: 'Rajpur',
    location: 'East Substation Sector C',
    landMarks: 'Near High School',
    block: 'BLOCK 1',
    division: 'RAIGANJ',
    capacity: 63,
    ccc: 'CCC-104',
    feeder: '11kV Rajpur Feeder',
    substation: 'Rajpur Substation',
    drgNo: 'RNJ03',
    docDate: '01-06-2024',
    jmcNo: 'JMC-983',
    censusCode: '312452',
    gp: 'Rajpur GP',
    routeLength: 1120,
    newPole: 16,
    staySet: 5,
    stayClampType1: 6,
    stayClampType2: 3,
    giEarthSpike: 16,
    suspension: 11,
    deadEnd: 5,
    distributionJunctionBox: 3,
    eyeHook: 16,
    ltPoleClampType1: 16,
    ltPoleClampType2: 10,
    ipcForDB50To70: 6,
    ipcFor16SQMM: 20,
    ipcForAbcToAbc50To70SQMM: 3,
    straightThroughJoint70SQMM: 2,
    straightThroughJoint16SQMM: 5,
    straightThroughJoint50SQMM: 2,
    serviceConnection1ph: 30,
    serviceConnection3ph: 4,
    ltBracket1Ph: 12,
    ltBracket3Ph: 4,
    backClamp: 8,
    dIronClamp: 6,
    shackleInsulator: 14,
    ciReel: 10,
    shackleStrap: 14,
    boxBracket: 3,
    lc: 2,
    exStay: 2,
    acsr30_3: 1120,
  },
  {
    id: 'dtr-4',
    dtrCode: 'DTR-WB-7404',
    village: 'Garia',
    location: 'South Grid Junction 08',
    landMarks: 'Market Complex',
    block: 'BLOCK 3',
    division: 'RAIGANJ',
    capacity: 250,
    ccc: 'CCC-880',
    feeder: '11kV Garia Feeder',
    substation: 'Garia Main Substation',
    drgNo: 'RNJ04',
    docDate: '15-06-2024',
    jmcNo: 'JMC-984',
    censusCode: '312453',
    gp: 'Garia GP',
    routeLength: 520,
    newPole: 8,
    staySet: 2,
    stayClampType1: 4,
    stayClampType2: 2,
    giEarthSpike: 8,
    suspension: 6,
    deadEnd: 2,
    distributionJunctionBox: 2,
    eyeHook: 8,
    ltPoleClampType1: 8,
    ltPoleClampType2: 6,
    ipcForDB50To70: 4,
    ipcFor16SQMM: 12,
    ipcForAbcToAbc50To70SQMM: 2,
    straightThroughJoint70SQMM: 1,
    straightThroughJoint16SQMM: 2,
    straightThroughJoint50SQMM: 1,
    serviceConnection1ph: 15,
    serviceConnection3ph: 10,
    ltBracket1Ph: 6,
    ltBracket3Ph: 6,
    backClamp: 4,
    dIronClamp: 4,
    shackleInsulator: 8,
    ciReel: 6,
    shackleStrap: 8,
    boxBracket: 2,
    lc: 1,
    exStay: 1,
    aac50_4: 520,
  },
];

// Helper to get stored DTRs with safe fallback
export const getStoredDTRs = (): any[] => {
  try {
    const raw = localStorage.getItem('ns_dtrs_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_INITIAL_DTRS;
};

// Real-time DTR save / update function
export const saveOrUpdateDTR = async (dtrData: any, userId?: string): Promise<any> => {
  const currentList = getStoredDTRs();
  const id = dtrData.id || `dtr-${Date.now()}`;
  const nowStr = new Date().toISOString();

  const existingIndex = currentList.findIndex(
    (item) => item.id === id || (item.dtrCode && item.dtrCode === dtrData.dtrCode)
  );

  let fullDtr: any;
  let updatedList: any[];

  if (existingIndex >= 0) {
    // Merge existing fields to preserve inventory / calculations
    fullDtr = {
      ...currentList[existingIndex],
      ...dtrData,
      id: currentList[existingIndex].id || id,
      updatedAt: nowStr,
      syncedAt: nowStr,
    };
    updatedList = [...currentList];
    updatedList[existingIndex] = fullDtr;
  } else {
    fullDtr = {
      id,
      ...dtrData,
      createdAt: nowStr,
      updatedAt: nowStr,
      syncedAt: nowStr,
    };
    updatedList = [fullDtr, ...currentList];
  }

  // 1. Immediately persist to localStorage
  try {
    localStorage.setItem('ns_dtrs_data', JSON.stringify(updatedList));
  } catch (err) {
    console.warn('LocalStorage DTR write error:', err);
  }

  // 2. Broadcast instant real-time event across current window/components
  try {
    window.dispatchEvent(
      new CustomEvent('ns_dtr_updated', {
        detail: { dtrs: updatedList, updatedDtr: fullDtr, action: 'save' },
      })
    );
  } catch (_) {}

  // 3. Write to Firestore in background
  try {
    const docId = fullDtr.id || `dtr_${fullDtr.dtrCode}`;
    const dtrRef = doc(db, COLLECTIONS.DTRS, docId);
    await setDoc(
      dtrRef,
      {
        ...fullDtr,
        userId: userId || auth.currentUser?.uid || 'anonymous',
        syncedAt: nowStr,
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore DTR cloud sync notice:', error);
  }

  return fullDtr;
};

// Delete DTR in real-time
export const deleteDTR = async (dtrId: string): Promise<any[]> => {
  const currentList = getStoredDTRs();
  const updatedList = currentList.filter((item) => item.id !== dtrId);

  // 1. Update localStorage
  try {
    localStorage.setItem('ns_dtrs_data', JSON.stringify(updatedList));
  } catch (_) {}

  // 2. Broadcast real-time deletion
  try {
    window.dispatchEvent(
      new CustomEvent('ns_dtr_updated', {
        detail: { dtrs: updatedList, deletedId: dtrId, action: 'delete' },
      })
    );
  } catch (_) {}

  // 3. Delete from Firestore
  try {
    const dtrRef = doc(db, COLLECTIONS.DTRS, dtrId);
    await deleteDoc(dtrRef);
  } catch (error) {
    console.warn('Firestore DTR delete notice:', error);
  }

  return updatedList;
};

// Real-time DTR snapshot listener (auth-aware and offline-resilient)
export const subscribeToDTRsRealtime = (
  onUpdate: (dtrs: any[]) => void,
  onError?: (err: any) => void
) => {
  // 1. Listen for local custom broadcast events (instant 0ms updates across components)
  const handleLocalUpdate = (e: any) => {
    if (e.detail?.dtrs && Array.isArray(e.detail.dtrs)) {
      onUpdate(e.detail.dtrs);
    }
  };
  window.addEventListener('ns_dtr_updated', handleLocalUpdate);

  // 2. Subscribe to Firestore collection real-time updates only when auth is active
  let unsubscribeFirestore: (() => void) | null = null;

  const startFirestoreListener = () => {
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }

    try {
      const q = collection(db, COLLECTIONS.DTRS);
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudDtrs: any[] = [];
            snapshot.forEach((docSnap) => {
              cloudDtrs.push({ id: docSnap.id, ...(docSnap.data() as Record<string, any>) });
            });

            if (cloudDtrs.length > 0) {
              // Merge with local dataset
              const localDtrs = getStoredDTRs();
              const mergedMap = new Map<string, any>();
              localDtrs.forEach((d) => mergedMap.set(d.id, d));
              cloudDtrs.forEach((d) => mergedMap.set(d.id, { ...mergedMap.get(d.id), ...d }));
              const mergedList = Array.from(mergedMap.values());

              try {
                localStorage.setItem('ns_dtrs_data', JSON.stringify(mergedList));
              } catch (_) {}

              onUpdate(mergedList);
            }
          }
        },
        (error) => {
          // If offline or connection is temporarily lost, log notice and keep working with offline cache
          console.warn('Firestore real-time DTR notice (offline/local mode active):', error.message || error);
          if (onError) onError(error);
        }
      );
    } catch (e) {
      console.warn('Firestore subscription setup notice:', e);
    }
  };

  // Only start listener if a user is currently logged in, or when they sign in
  if (auth.currentUser) {
    startFirestoreListener();
  }

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {
      startFirestoreListener();
    } else {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }
    }
  });

  return () => {
    window.removeEventListener('ns_dtr_updated', handleLocalUpdate);
    unsubscribeAuth();
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
};

// DTR Cloud Sync Service
export const syncDTRsToCloud = async (dtrs: any[], userId?: string) => {
  for (const dtr of dtrs) {
    await saveOrUpdateDTR(dtr, userId);
  }
};

export const fetchDTRsFromCloud = async () => {
  const q = collection(db, COLLECTIONS.DTRS);
  const snap = await getDocs(q);
  const results: any[] = [];
  snap.forEach((docSnap) => {
    results.push({ id: docSnap.id, ...(docSnap.data() as Record<string, any>) });
  });
  return results;
};

// Pole Cloud Sync Service
export const syncPolesToCloud = async (poles: any[], userId?: string) => {
  for (const pole of poles) {
    const docId = pole.id || `pole_${pole.dtrId || pole.dtrNo}_${pole.poleNo}`;
    const poleRef = doc(db, COLLECTIONS.POLES, docId);
    await setDoc(
      poleRef,
      {
        ...pole,
        userId: userId || auth.currentUser?.uid || 'anonymous',
        syncedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }
};

export const fetchPolesFromCloud = async (dtrId?: string) => {
  let q;
  if (dtrId) {
    q = query(collection(db, COLLECTIONS.POLES), where('dtrId', '==', dtrId));
  } else {
    q = collection(db, COLLECTIONS.POLES);
  }
  const snap = await getDocs(q);
  const results: any[] = [];
  snap.forEach((docSnap) => {
    results.push({ id: docSnap.id, ...(docSnap.data() as Record<string, any>) });
  });
  return results;
};
