// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Your web app\'s Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNX9ICSG9bdJhb6nMPnyuNhbewE_smf_4",
  authDomain: "ape-prop.firebaseapp.com",
  projectId: "ape-prop",
  storageBucket: "ape-prop.firebasestorage.app",
  messagingSenderId: "914963337229",
  appId: "1:914963337229:web:fc42a4a84dbd9cff070544",
  measurementId: "G-73M8EF1HNG"
};

let appInstance = null;
let authInstance = null;
let analyticsInstance = null;
let dbInstance = null;
let initializationError = null;

try {
  console.log("Attempting to initialize Firebase app...");
  appInstance = initializeApp(firebaseConfig);
  console.log("Firebase app initialized:", appInstance ? appInstance.name : "null app");

  console.log("Attempting to initialize Auth...");
  authInstance = getAuth(appInstance);
  console.log("Firebase Auth initialized:", authInstance ? "OK" : "Failed");

  console.log("Attempting to initialize Analytics...");
  analyticsInstance = getAnalytics(appInstance);
  console.log("Firebase Analytics initialized:", analyticsInstance ? "OK" : "Failed");

  console.log("Attempting to get Firestore instance...");
  dbInstance = getFirestore(appInstance); // This is the critical line
  console.log("Firestore instance obtained:", dbInstance ? "OK" : "Failed");

} catch (e) {
  console.error("CRITICAL ERROR during Firebase/Firestore initialization:", e);
  initializationError = e;
  // Ensure instances are null if initialization failed critically
  appInstance = null;
  authInstance = null;
  analyticsInstance = null;
  dbInstance = null;
}

// Export the instances
export const app = appInstance;
export const auth = authInstance;
export const analytics = analyticsInstance;
export const db = dbInstance;
export const firebaseInitError = initializationError;


// Función para obtener datos del usuario desde Firestore
const getUserData = async (uid) => {
  if (!dbInstance) {
    console.error("Firestore (dbInstance) is not available for getUserData. Initialization error:", initializationError);
    return null;
  }
  try {
    const userDoc = await getDoc(doc(dbInstance, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    console.log(`No user document found for UID: ${uid}`);
    return null;
  } catch (error) {
    console.error(`Error fetching user data for UID: ${uid}`, error);
    return null;
  }
};

export { getUserData };
export default appInstance; // Exporting app as default, could also be an object 