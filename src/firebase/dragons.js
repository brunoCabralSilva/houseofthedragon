import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { createDragonImage, updateDragonImage, deleteDragonDirectory } from "./storage";
import firebaseConfig from "./connection";

export const registerDragon = async (name, image, vitalidade, velocidade, rebeldia, dracarys, mordida, garras, aparencia, description) => {
  try {
    const db = getFirestore(firebaseConfig);
    const register = await addDoc(
      collection(db, 'dragons'), {
        name, imageURL: '', vitalidade, velocidade, rebeldia, dracarys, mordida, garras, aparencia, description
      }
    );
    const docId = register.id;
    const imageURL = await createDragonImage(docId, image);
    const newsDoc = doc(db, 'dragons', docId);
    await updateDoc(newsDoc, { imageURL });
    window.alert('Dragão ' + name +' registrado com sucesso!');
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
};

export async function updateDragonById(id, name, image, vitalidade, velocidade, rebeldia, dracarys, mordida, garras, aparencia, description) {
  try {
    const db = getFirestore(firebaseConfig);
    const dragonDocRef = doc(db, 'dragons', id);
    const dragonDocSnapshot = await getDoc(dragonDocRef);
    if (!dragonDocSnapshot.exists()) {
      window.alert('Dragão não encontrado. Por favor, atualize a página e tente novamente.');
      return false;
    } else {
      const userData = {
        name,
        vitalidade,
        velocidade,
        rebeldia,
        dracarys,
        mordida,
        garras,
        aparencia,
        description
      };
      if (image) {
        const imageURL = await updateDragonImage(id, image);
        userData.imageURL = imageURL;
      }
      await updateDoc(dragonDocRef, userData);
      window.alert('Dragão atualizado com sucesso!');
      return true;
    }
  } catch (error) {
    window.alert('Erro ao atualizar o Dragão: ' + error);
    return false;
  }
}

export const getAllDragons = async() => {
  try {
    const db = getFirestore(firebaseConfig);
    const querySnapshot = await getDocs(collection(db, 'dragons'));
    const dragons = [];
    querySnapshot.forEach((doc) => {
      dragons.push({ id: doc.id, ...doc.data() });
    });
    return dragons;
  } catch (error) {
    window.alert('Erro ao buscar notícias: ' + error);
    return [];
  }
}

export const getDragonById = async (dragonId) => {
  try {
    const db = getFirestore(firebaseConfig);
    const dragonDoc = await getDoc(doc(db, 'dragons', dragonId));
    if (dragonDoc.exists()) {
      return { id: dragonDoc.id, ...dragonDoc.data() };
    } else {
      window.alert('Dragão não encontrado com ID: ' + dragonId);
      return null;
    }
  } catch (error) {
    window.alert('Erro ao buscar dragão pelo ID: ' + error);
    return null;
  }
};

export const deleteDragon = async(id) => {
  try {
    const db = getFirestore(firebaseConfig);
    const dragonDocRef = doc(db, 'dragons', id);
    const dragonDoc = await getDoc(dragonDocRef);
    if (!dragonDoc.exists()) {
      window.alert('Dragão não encontrado com ID: ' + id);
      return false;
    }
    await deleteDragonDirectory(id);
    await deleteDoc(dragonDocRef);
    window.alert('O dragão foi excluído com sucesso.');
    return true;
  } catch (error) {
    window.alert('Erro ao deletar dragão pelo ID: ' + error.message);
    return false;
  }
}