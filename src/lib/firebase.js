// インポート対象のFirebaseApp、Auth、Firestore、FirebaseStorageはTypeScriptの型ではなくなります
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";

// process.env~で先ほど.envファイルに入力したfirebaseConfigの値を参照しています
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// NOTE >> Firebaseの初期化を行います。
console.log(firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase(app);
export const dbRefTest = ref(db, 'test');
export const drawingDataRef = ref(db, 'drawings')
