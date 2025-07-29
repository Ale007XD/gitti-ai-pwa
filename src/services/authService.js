import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Получаем конфигурацию из переменных окружения
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

let auth = null;
let db = null;
let googleProvider = null;
let app = null;

// Проверяем, что конфигурация существует и валидна
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined" && firebaseConfig.apiKey.trim() !== "") {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    console.warn("Firebase configuration not found in environment variables. Running in demo mode.");
}

class AuthService {
    async signInWithGoogle() {
        if (!auth) throw new Error("Firebase not initialized");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    async signInWithEmail(email, password) {
        if (!auth) throw new Error("Firebase not initialized");
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    async signUpWithEmail(email, password) {
        if (!auth) throw new Error("Firebase not initialized");
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        if (!auth) return;
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }

    onAuthStateChanged(callback) {
        if (!auth) {
            // В демо-режиме сразу вызываем callback с null
            setTimeout(() => callback(null), 0);
            return () => {};
        }
        return onAuthStateChanged(auth, callback);
    }
}

// Экспортируем на верхнем уровне
export { auth, db, googleProvider };
export default new AuthService();
