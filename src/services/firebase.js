import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update  } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB4FN6HpF1sWM9jkeGzjAqeMQKxPpYhb60",
  authDomain: "tax-id-backend.firebaseapp.com",
  projectId: "tax-id-backend",
  storageBucket: "tax-id-backend.appspot.com",
  messagingSenderId: "375579102479",
  appId: "1:375579102479:web:aa13c2222d8e6f364a427a"
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