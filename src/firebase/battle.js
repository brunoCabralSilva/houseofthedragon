import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";

export const createBattle = async (
  type,
  email,
  displayName,
  profileImage,
  selectedDragon,
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleId = await findEmptyInvitedBattle(type);
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
            email: '',
            displayName: '',
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

export const findEmptyInvitedBattle = async (type) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battlesCollectionRef = collection(db, 'battles');
    const q = query(battlesCollectionRef, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    if (data.userInvited.email === '' && data.userInvited.displayName === '' && data.userInvited.profileImage === '') return doc.id;
    else return null;
  } catch (error) {
    window.alert('Erro ao buscar batalha vazia:', error);
  }
};

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
      const battle = { ...battleDoc.userInvited };
      if (battle.email === '' && battle.displayName === '' && battle.profileImage === '') return true;
      return false;
    } else window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
  } catch (error) {
    window.alert('Erro ao buscar batalha vazia:', error);
  }
}