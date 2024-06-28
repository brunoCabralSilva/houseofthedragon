import { addDoc, collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import firebaseConfig from "./connection";
import { getUserByEmail } from "./user";

export const getHoraOficialBrasil = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    const date = new Date(data.utc_datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
    return formattedDate;
  } catch (error) {
    return null;
  }
};

export const registerMessage = async (data) => {
  try {
    const date = await getHoraOficialBrasil();
    const user = await getUserByEmail(data.user.email);
    const db = getFirestore(firebaseConfig);
    await addDoc(collection(db, 'community'), {
      message: data.message,
      imageURL: user.imageURL,
      user: data.user.displayName,
      email: data.user.email,
      date,
      responses: [],
    });
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
};

export const registerResponse = async (data) => {
  try {
    const date = await getHoraOficialBrasil();
    const user = await getUserByEmail(data.user.email);
    const db = getFirestore(firebaseConfig);
    const communityRef = doc(db, 'community', data.id);
    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const existingData = communityDoc.data();
      const newResponses = existingData.responses ? [...existingData.responses, {
        message: data.message,
        imageURL: user.imageURL,
        user: data.user.displayName,
        email: data.user.email,
        date,
      }] : [{
        message: data.message,
        imageURL: user.imageURL,
        user: data.user.displayName,
        email: data.user.email,
        date,
      }];

      await updateDoc(communityRef, {
        responses: newResponses,
      });

      return true;
    } else {
      throw new Error('Documento não encontrado');
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return false;
  }
};