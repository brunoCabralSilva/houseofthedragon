import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { createDragonImage, updateDragonImage, deleteDragonDirectory } from "./storage";
import firebaseConfig from "./connection";
import { updateMountsById, updateMountsByName } from "./mount";

export const registerDragon = async (name, image, imageIcon, vitalidade, velocidade, rebeldia, dracarys, mordida, garras, aparencia, description, nameFont, linkFont) => {
  try {
    const db = getFirestore(firebaseConfig);
    const register = await addDoc(
      collection(db, 'dragons'), {
        name, imageURL: '', vitalidade, velocidade, rebeldia, dracarys, mordida, garras, aparencia, description, nameFont, linkFont
      }
    );
    const docId = register.id;
    const imageURL = await createDragonImage(docId, image);
    const imageIconURL = await createDragonImage(docId, imageIcon);
    const newsDoc = doc(db, 'dragons', docId);
    await updateDoc(newsDoc, { imageURL, imageIconURL });
    window.alert('Dragão ' + name +' registrado com sucesso!');
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
};

export async function updateDragonById(id, name, image, imageIcon, vitalidade, velocidade, rebeldia, dracarys, mordida, garras, aparencia, description, nameFont, linkFont) {
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
        description,
        nameFont,
        linkFont
      };
      if (image) {
        const imageURL = await updateDragonImage(id, image);
        const imageIconURL = await createDragonImage(id, imageIcon);
        userData.imageURL = imageURL;
        userData.imageIconURL = imageIconURL;
      }
      await updateDoc(dragonDocRef, userData);
      await updateMountsById(id, userData);
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

export const getDragonsWithVitalityNotOne = async() => {
  try {
    const db = getFirestore(firebaseConfig);
    const q = query(collection(db, 'dragons'), where('vitalidade', '!=', 1));
    const querySnapshot = await getDocs(q);
    const dragons = [];
    querySnapshot.forEach((doc) => {
      dragons.push({ id: doc.id, ...doc.data() });
    });
    return dragons;
  } catch (error) {
    window.alert('Erro ao buscar dragões: ' + error);
    return [];
  }
}

export async function getDragonByName(name) {
  try {
    const db = getFirestore(firebaseConfig);
    const usersCollectionRef = collection(db, 'dragons');
    const q = query(usersCollectionRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      window.alert('Dragão com o Nome fornecido não encontrado.');
    } else {
      let dragon;
      querySnapshot.forEach((doc) => {
        dragon = doc.data();
        dragon.id = doc.id;
      });
      return dragon;
    }
  } catch (error) {
    window.alert('Erro ao obter Dragão pelo Nome: ' + error);
    return false;
  }
}

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

export const updateListOfDragons = async (list) => {
  try {
    const db = getFirestore(firebaseConfig);
    const dragonsCollection = collection(db, 'dragons');
    for (const dragon of list) {
      const dragonQuery = query(dragonsCollection, where('name', '==', dragon.Dragão));
      const querySnapshot = await getDocs(dragonQuery);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (dragonDoc) => {
          const dragonDocRef = dragonDoc.ref;
          const dragonData = {
            vitalidade: dragon.Vitalidade,
            velocidade: dragon.Velocidade,
            rebeldia: dragon.Rebeldia,
            dracarys: dragon.Dracarys,
            mordida: dragon.Mordida,
            garras: dragon.Garras,
            // aparencia: dragon.Aparencia,
            // description: dragon.Description,
            // nameFont: dragon.NameFont,
            // linkFont: dragon.LinkFont,
          };
          await updateDoc(dragonDocRef, dragonData);
        });
        await updateMountsByName(dragon.Dragão, dragon);
      }
    }
    window.alert("Atualização em massa concluída com sucesso!");
  } catch (error) {
    window.alert(`Erro ao realizar a atualização em massa: ${error}`);
  }
};