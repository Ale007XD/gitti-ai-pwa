import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    // Замените на ваши данные Firebase
    apiKey: "AIzaSyCk4RVxjNUJblIdJSUu4P8s-Uz3gpzB8Q0",
    authDomain: "gitti-ai-pwa.firebaseapp.com",
    projectId: "gitti-ai-pwa",
    storageBucket: "gitti-ai-pwa.firebasestorage.app",
    messagingSenderId: "425585148182",
    appId: "1:425585148182:web:967ed8d998881c97bed037"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

class AuthService {
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    async signUpWithEmail(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }

    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
}

export default new AuthService();
