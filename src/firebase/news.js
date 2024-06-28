'use client'
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { createNewsImage } from './storage';
import firebaseConfig from "./connection";
import { getHoraOficialBrasil } from './message';

export async function registerNews(
  email, title, image, texts, displayName
) {
  try {
    const date = await getHoraOficialBrasil();
    const db = getFirestore(firebaseConfig);
    const register = await addDoc(
      collection(db, 'news'), {
        title,
        texts,
        imageURL: '',
        date,
        displayName,
        email,
      }
    );
     const docId = register.id;
     const imageURL = await createNewsImage(docId, image);
     const newsDoc = doc(db, 'news', docId);
     await updateDoc(newsDoc, { imageURL });
     window.alert('Publicação registrada com sucesso!'); 
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
}

export async function getAllNews() {
  try {
    const db = getFirestore(firebaseConfig);
    const querySnapshot = await getDocs(collection(db, 'news'));
    const news = [];
    querySnapshot.forEach((doc) => {
      news.push({ id: doc.id, ...doc.data() });
    });
    return news;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}