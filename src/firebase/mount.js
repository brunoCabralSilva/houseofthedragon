import { addDoc, collection, doc, getDocs, getFirestore, increment, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";

export const updateMountsById = async (id, dragonData) => {
  try {
    const db = getFirestore(firebaseConfig);
    const mountsCollection = collection(db, 'mounts');
    const q = query(mountsCollection, where("dragonId", "==", id));
    const querySnapshot = await getDocs(q);
    const promises = [];
    querySnapshot.forEach((document) => {
      const docRef = doc(db, 'mounts', document.id);
      const updatedData = {
        "data.name": dragonData.name,
        "data.vitalidade.value": dragonData.vitalidade,
        "data.velocidade.value": dragonData.velocidade,
        "data.rebeldia.value": dragonData.rebeldia,
        "data.dracarys.value": dragonData.dracarys,
        "data.mordida.value": dragonData.mordida,
        "data.garras.value": dragonData.garras,
        "data.nameFont": dragonData.nameFont,
        "data.linkFont": dragonData.linkFont,
        "data.deslocamento.value": dragonData.Deslocamento,
        "data.alcance.value": dragonData.Alcance,
        "data.nivel": dragonData.Nível,
        "data.description": dragonData.description
      };
      if (dragonData.imageURL) updatedData["data.imageURL"] = dragonData.imageURL;
      if (dragonData.imageIconURL) updatedData["data.imageIconURL"] = dragonData.imageIconURL;
      promises.push(updateDoc(docRef, updatedData));
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao atualizar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
}

export const updateMountsByName = async (nameParam, dragonData) => {
  try {
    const db = getFirestore(firebaseConfig);
    const mountsCollection = collection(db, 'mounts');
    const q = query(mountsCollection, where("name", "==", nameParam));
    const querySnapshot = await getDocs(q);
    const promises = [];
    querySnapshot.forEach((document) => {
      const docRef = doc(db, 'mounts', document.id);
      const updatedData = {
        "data.vitalidade.value": dragonData.Vitalidade,
        "data.velocidade.value": dragonData.Velocidade,
        "data.rebeldia.value": dragonData.Rebeldia,
        "data.dracarys.value": dragonData.Dracarys,
        "data.mordida.value": dragonData.Mordida,
        "data.garras.value": dragonData.Garras,
        "data.deslocamento.value": dragonData.Deslocamento,
        "data.alcance.value": dragonData.Alcance,
        "data.nivel": dragonData.Nível,
        // "data.nameFont": dragonData.nameFont,
        // "data.linkFont": dragonData.linkFont,
        // "data.aparencia": dragonData.aparencia,
        // "data.description": dragonData.description
      };      
      promises.push(updateDoc(docRef, updatedData));
    });
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    window.alert('Erro ao atualizar: ' + error);
    return false;
  }
}

export const getSelectedMount = async (email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const mountsCollectionRef = collection(db, 'mounts');
    const q = query(mountsCollectionRef, where('email', '==', email), where('selected', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      window.alert('Não foi encontrado nenhum dragão selecionado para o usuário com o email fornecido.');
      return null;
    } else {
      let dragon;
      querySnapshot.forEach((doc) => {
        dragon = doc.data();
        dragon.id = doc.id;
      });
      return dragon;
    }
  } catch (error) {
    window.alert('Erro ao obter dragão selecionado por email: ' + error);
    return null;
  }
}

export const getMountsByEmail = async (email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const mountsCollectionRef = collection(db, 'mounts');
    const q = query(mountsCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      window.alert('Não foram encontrados dragões para o usuário com o email fornecido.');
      return [];
    } else {
      const dragons = [];
      querySnapshot.forEach((doc) => {
        let dragon = doc.data();
        dragon.id = doc.id;
        dragons.push(dragon);
      });
      return dragons;
    }
  } catch (error) {
    window.alert('Erro ao obter dragões por email: ' + error);
    return [];
  }
}

export const changeSelectedDragon = async (email, name) => {
  try {
    const db = getFirestore(firebaseConfig);
    const mountsCollectionRef = collection(db, 'mounts');
    const q = query(mountsCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      window.alert('Não foi encontrado nenhum dragão para o usuário com o email fornecido.');
      return;
    }
    querySnapshot.forEach(async (docSnapshot) => {
      const mountData = docSnapshot.data();
      const mountRef = doc(db, 'mounts', docSnapshot.id);
      if (mountData.name === name) await updateDoc(mountRef, { selected: true });
      else await updateDoc(mountRef, { selected: false });
    });
    window.alert('Você reivindicou ' + name + ' para a batalha!');
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao alterar seleção do dragão: ' + errorCode + ' - ' + errorMessage);
    return false;
  }
};

export const registerMount = async (dragon, email) => {
  try {
    const db = getFirestore(firebaseConfig);
    await addDoc(collection(db, 'mounts'), {
      email,
      dragonId: dragon.id,
      name: dragon.name,
      selected: true,
      winsPVP: 0,
      lossesPVP: 0,
      winsIA: 0,
      lossesIA: 0,
      data: {
        vitalidade: { value: dragon.vitalidade, bonus: 0 },
        velocidade: { value: dragon.velocidade, bonus: 0 },
        rebeldia: { value: dragon.rebeldia, bonus: 0 },
        dracarys: { value: dragon.dracarys, bonus: 0 },
        mordida: { value: dragon.mordida, bonus: 0 },
        garras: { value: dragon.garras, bonus: 0 },
        alcance: { value: dragon.alcance, bonus: 0 },
        deslocamento: { value: dragon.deslocamento, bonus: 0 },
        imageURL: dragon.imageURL,
        nivel: dragon.nivel,
        imageIconURL: dragon.imageIconURL,
        nameFont: dragon.nameFont,
        linkFont: dragon.linkFont,
        description: dragon.description,
      },
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
}

export const applyVictoryOrDefeat = async (dataUser, type) => {
  const db = getFirestore(firebaseConfig);
  const mountsCollectionRef = collection(db, 'mounts');
  const q = query(
    mountsCollectionRef,
    where('email', '==', dataUser.email),
    where('dragonId', '==', dataUser.dragon.id),
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    window.alert('Não foi encontrado nenhum dragão para o usuário com o email fornecido.');
  } else {
    querySnapshot.forEach(async (docSnapshot) => {
      const mountRef = doc(db, 'mounts', docSnapshot.id);
      if (type === 'winsIA') await updateDoc(mountRef, { winsIA: increment(1) });
      else if (type === 'winsPVP') await updateDoc(mountRef, { winsPVP: increment(1) });
      else if (type === 'lossesPVP') await updateDoc(mountRef, { lossesPVP: increment(1) });
      else await updateDoc(mountRef, { lossesIA: increment(1) });
    });
  }
}