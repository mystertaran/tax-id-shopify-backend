import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update  } from "firebase/database";
import { config } from "dotenv";
config()


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const saveData = async (path, data) => {
    const dataRef = ref(db, path);
    await set(dataRef, data);
};

const readData = async (path) => {
    const dataRef = ref(db, path);
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log("No data available");
        return null;
    }
}

const updateData = async (path, data) => {
    const dataRef = ref(db, path);
    await update(dataRef, data);
}

export { saveData, readData, updateData };