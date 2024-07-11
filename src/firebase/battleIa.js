import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";
import { attack } from "./battle";

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
          userTurn: 'ia',
          end: [],
          message: [],
          actualAttack: {
            damage: '',
            type: '',
            turnAttack: '',
          },
          users: [
            {
              email,
              displayName,
              profileImage,
              dragon: {
                ...selectedDragon.data,
                vitalidade: {
                  total: selectedDragon.data.vitalidade.value,
                  actual: selectedDragon.data.vitalidade.value,
                  bonus: 0
                },
                velocidade: {
                  total: selectedDragon.data.velocidade.value,
                  actual: selectedDragon.data.velocidade.value,
                  bonus: 0
                },
                rebeldia: {
                  total: selectedDragon.data.rebeldia.value,
                  actual: selectedDragon.data.rebeldia.value,
                  bonus: 0
                },
                dracarys: {
                  total: selectedDragon.data.dracarys.value,
                  actual: selectedDragon.data.dracarys.value,
                  bonus: 0
                },
                mordida: {
                  total: selectedDragon.data.mordida.value,
                  actual: selectedDragon.data.mordida.value,
                  bonus: 0
                },
                garras: {
                  total: selectedDragon.data.garras.value,
                  actual: selectedDragon.data.garras.value,
                  bonus: 0
                },
                name: selectedDragon.name,
                id: selectedDragon.dragonId,
              },
            },
            {
              email: 'ia',
              displayName: 'IA',
              profileImage: '',
              dragon: { },
            },
          ],
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
      if (data.users.find((user) => user.email === email)) battleId = doc.id;
    });
    return battleId;
  } catch (error) {
    window.alert('Erro ao buscar batalha vazia:', error.message);
    return null;
  }
}

export const chooseIaDragon = async (dragon, id) => {
  const objDragon = {};
  objDragon.vitalidade = { total: dragon.vitalidade, actual: dragon.vitalidade, bonus: 0 };
  objDragon.velocidade = { total: dragon.velocidade, actual: dragon.velocidade, bonus: 0 };
  objDragon.rebeldia = { total: dragon.rebeldia, actual: dragon.rebeldia, bonus: 0 };
  objDragon.dracarys = { total: dragon.dracarys, actual: dragon.dracarys, bonus: 0 };
  objDragon.mordida = { total: dragon.mordida, actual: dragon.mordida, bonus: 0 };
  objDragon.garras = { total: dragon.garras, actual: dragon.garras, bonus: 0 };
  objDragon.aparencia = dragon.aparencia;
  objDragon.description = dragon.description;
  objDragon.id = dragon.id;
  objDragon.imageIconURL = dragon.imageIconURL;
  objDragon.imageURL = dragon.imageURL;
  objDragon.linkFont = dragon.linkFont;
  objDragon.name = dragon.name;
  objDragon.nameFont = dragon.nameFont;

  const idData = { email: 'ia', displayName: 'IA', profileImage: '', dragon: objDragon };

  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', id);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const currentData = battleDocSnapshot.data();
      const existingUsers = currentData.users.find((user) => user.displayName !== 'IA') || {};
      await updateDoc(battleDocRef, { users: [ idData, existingUsers ] });
    }
  } catch (error) {
    return false;
  }
}

export const rollIaTurn = async (matchId) => {
try {
  const db = getFirestore(firebaseConfig);
  const battleDocRef = doc(db, 'battles', matchId);
  const battleDocSnapshot = await getDoc(battleDocRef);
  if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
  else {
      const currentData = battleDocSnapshot.data();
      const userData = currentData.users.find((current) => current.displayName !== 'IA');
      const iaData = currentData.users.find((current) => current.displayName === 'IA');
      const attacks = ['dracarys', 'garras', 'mordida'];
      const randomIndex = Math.floor(Math.random() * attacks.length);
      const randomAttack = attacks[randomIndex];
      iaData.dragon.selectedAttack = {
        ...iaData.dragon[randomAttack],
        name: attacks[randomIndex],
      };
      await attack(iaData, userData, matchId);
    }
  } catch (error) {
    return false;
  }
}

export const verifyIaBattle = async (battleId) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', battleId);
    const battleDoc = await getDoc(battleDocRef);
    if (battleDoc.exists()) {
      const battleData = battleDoc.data();
      const iaData = battleData.users.find((user) => user.displayName === 'IA');
      if (iaData && iaData.dragon && iaData.dragon.name) return true;
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