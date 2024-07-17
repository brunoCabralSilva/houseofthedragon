import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "./connection";

export const createPVPBattle = async (
  type,
  email,
  displayName,
  profileImage,
  selectedDragon,
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const data = await findPVPBattle(email);
    if (data.battleId) {
      if (data.existing) {
        const userToAdd = {
          email,
          displayName,
          profileImage,        
          dragon: {
            row: 4,
            column: 11,
            id: selectedDragon.dragonId,
            name: selectedDragon.name,
            nivel: selectedDragon.data.nivel,
            imageURL: selectedDragon.data.imageURL,
            imageIconURL: selectedDragon.data.imageIconURL,
            description: selectedDragon.data.description,
            actions: {
              dracarys: { total: selectedDragon.data.dracarys.value, actual: selectedDragon.data.dracarys.value, bonus: 0 },
              mordida: { total: selectedDragon.data.mordida.value, actual: selectedDragon.data.mordida.value, bonus: 0 },
              garras: { total: selectedDragon.data.garras.value, actual: selectedDragon.data.garras.value, bonus: 0 },
              hunt: 0,
              position: 'ground',
            },
            vitalidade: { total: selectedDragon.data.vitalidade.value, actual: selectedDragon.data.vitalidade.value, bonus: 0 },
            velocidade: { total: selectedDragon.data.velocidade.value, actual: selectedDragon.data.velocidade.value, bonus: 0 },
            rebeldia: { total: selectedDragon.data.rebeldia.value, actual: selectedDragon.data.rebeldia.value, bonus: 0 },
            alcance: { total: selectedDragon.data.alcance.value, actual: selectedDragon.data.alcance.value, bonus: 0 },
            deslocamento: { total: selectedDragon.data.deslocamento.value, actual: selectedDragon.data.deslocamento.value, bonus: 0 },
          },
        }
        try {
          const db = getFirestore(firebaseConfig);
          const battleDocRef = doc(db, 'battles', data.battleId);
          const battleDocSnapshot = await getDoc(battleDocRef);
          if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
          else {
            const currentData = battleDocSnapshot.data();
            const existingUser = currentData.users.find((user) => user.email !== email);
            await updateDoc(battleDocRef, { users: [ existingUser, userToAdd ] });
          }
        } catch (error) {
          return false;
        }
      } return data.battleId;
    } else {
      console.log(selectedDragon)
      const register = await addDoc(
        collection(db, 'battles'),
        {
          type,
          timeTurn: '',
          userTurn: email,
          end: [],
          message: [],
          actualAttack: { damage: '', type: '', turnAttack: '' },
          users: [
            {
              email,
              displayName,
              profileImage,        
              dragon: {
                row: 4,
                column: 7,
                id: selectedDragon.dragonId,
                name: selectedDragon.name,
                nivel: selectedDragon.data.nivel,
                imageURL: selectedDragon.data.imageURL,
                imageIconURL: selectedDragon.data.imageURL,
                description: selectedDragon.data.description,
                actions: {
                  dracarys: { total: selectedDragon.data.dracarys.value, actual: selectedDragon.data.dracarys.value, bonus: 0 },
                  mordida: { total: selectedDragon.data.mordida.value, actual: selectedDragon.data.mordida.value, bonus: 0 },
                  garras: { total: selectedDragon.data.garras.value, actual: selectedDragon.data.garras.value, bonus: 0 },
                  hunt: 0,
                  position: 'ground',
                },
                vitalidade: { total: selectedDragon.data.vitalidade.value, actual: selectedDragon.data.vitalidade.value, bonus: 0 },
                velocidade: { total: selectedDragon.data.velocidade.value, actual: selectedDragon.data.velocidade.value, bonus: 0 },
                rebeldia: { total: selectedDragon.data.rebeldia.value, actual: selectedDragon.data.rebeldia.value, bonus: 0 },
                alcance: { total: selectedDragon.data.alcance.value, actual: selectedDragon.data.alcance.value, bonus: 0 },
                deslocamento: { total: selectedDragon.data.deslocamento.value, actual: selectedDragon.data.deslocamento.value, bonus: 0 },
              },
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

export const findPVPBattle = async (email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battlesCollectionRef = collection(db, 'battles');
    const q = query(battlesCollectionRef, where('type', '==', 'pvp'));
    const querySnapshot = await getDocs(q);
    let battleId = false;
    let found = false;
    let existing = false;
    querySnapshot.forEach((doc) => {
      if (!found) {
        const data = doc.data();
        if (data.users.length === 1) {
          if (data.users[0].email !== email) existing = true;
          battleId = doc.id;
          found = true;
        } else {
          const findUser = data.users.find((user) => user.email === email);
          if (findUser) {
            battleId = doc.id;
            found = true;
          }
        }
      }
    });
    return { existing, battleId };
  } catch (error) {
    window.alert('Erro ao buscar batalha PvP: ', error.message);
    return null;
  }
}
