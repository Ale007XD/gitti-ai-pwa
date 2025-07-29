import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './authService';

class FirestoreService {
    async saveMessage(message, response, userId) {
        try {
            const docRef = await addDoc(collection(db, "chatHistory"), {
                userId: userId,
                message: message,
                response: response,
                timestamp: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    async getChatHistory(userId) {
        try {
            const q = query(
                collection(db, "chatHistory"),
                where("userId", "==", userId),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting chat history:", error);
            throw error;
        }
    }
}

export default new FirestoreService();
