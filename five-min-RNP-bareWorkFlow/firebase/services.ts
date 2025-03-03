// services.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDF3vkJkaTMlh2081Ccp1PRPTiuoTDVzjU",
  authDomain: "fiveminutedonburi.firebaseapp.com",
  projectId: "fiveminutedonburi",
  storageBucket: "fiveminutedonburi.firebasestorage.app",
  messagingSenderId: "87168456895",
  appId: "1:87168456895:web:0d81024aaa965629558e0a",
  measurementId: "G-LS40HK30XH",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 필요한 서비스 가져오기
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
