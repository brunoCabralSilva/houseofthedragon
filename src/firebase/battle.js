import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";

export const createIaBattle = async (
  type,
  email,
  displayName,
  profileImage,
  selectedDragon,
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleId = await findIaBattle(email);
    if (battleId) return battleId;
    else {
      const register = await addDoc(
        collection(db, 'battles'),
        {
          type,
          timeTurn: '',
          userTurn: '',
          userInviting: {
            email,
            displayName,
            profileImage,
            dragon: {
              ...selectedDragon.data,
              name: selectedDragon.name,
              id: selectedDragon.dragonId,
            },
          },
          userInvited: {
            email: 'ia',
            displayName: 'IA',
            profileImage: '',
            dragon: { },
          },
        }
      );
      return register.id;
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
};

export const findIaBattle = async (email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battlesCollectionRef = collection(db, 'battles');
    const q = query(battlesCollectionRef, where('type', '==', 'ia'));
    const querySnapshot = await getDocs(q);
    let battleId = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userInviting.email === email) battleId = doc.id;
    });
    return battleId;
  } catch (error) {
    window.alert('Erro ao buscar batalha vazia:', error.message);
    return null;
  }
}

export const chooseIaDragon = async (dragon, id) => {
  const userInvited = {
    userInvited: { email: 'ia', displayName: 'IA', profileImage: '', dragon},
  };
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', id);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else await updateDoc(battleDocRef, userInvited);
  } catch (error) {
    return false;
  }
}

export const verifyBattle = async (battleId) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', battleId);
    const battleDoc = await getDoc(battleDocRef);
    if (battleDoc.exists()) {
      const battleData = battleDoc.data();
      if (battleData.userInvited && battleData.userInvited.dragon && battleData.userInvited.dragon.name) return true;
      return false;
    } else {
      window.alert('Batalha não encontrada. Por favor, atualize a página e tente novamente.');
      return false;
    }
  } catch (error) {
    window.alert('Erro ao verificar batalha:', error.message);
    return false;
  }
}