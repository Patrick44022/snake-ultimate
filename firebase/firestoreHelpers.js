
// firebase/firestoreHelpers.js
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from './config';

export const addTask = async (userId, date, text) => {
  try {
    await addDoc(collection(db, 'tasks'), {
      userId,
      date,
      text,
      done: false,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Aufgabe:', error);
  }
};

export const getTasks = async (userId, date) => {
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId), where('date', '==', date));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Fehler beim Laden der Aufgaben:', error);
    return [];
  }
};

export const toggleTaskDone = async (taskId, newStatus) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { done: newStatus });
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
  }
};

export const getUserRole = async (userId) => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data().role || 'child';
    }
    return 'child';
  } catch (error) {
    console.error('Fehler beim Laden der Rolle:', error);
    return 'child';
  }
};
