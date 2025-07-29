import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    // Замените на ваши данные Firebase
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
