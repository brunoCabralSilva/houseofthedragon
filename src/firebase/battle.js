import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { applyVictoryOrDefeat } from "./mount";
import firebaseConfig from "./connection";

export const attack = async (attacker, defender, matchId) => {
  let totalDamage = 0;
  let finalDamage = 0;
  let text = '';
  const testAttack = rollAttack(attacker, defender);
  const { type } = testAttack;
  if (type === 'success') {
    const damage = calculateDamage(attacker) * 2;
    totalDamage = calcAbsorption(defender, damage);
    const updtStamina = updateStamina(defender, totalDamage, false, attacker.dragon.selectedAttack.name);
    finalDamage = updtStamina.finalDamage;
    text = updtStamina.text;
  } else if (type === 'criticalSuccess') {
    totalDamage = (attacker.dragon.selectedAttack.actual + 12) * 2;
    const updtStamina = updateStamina(defender, totalDamage, true, attacker.dragon.selectedAttack.name);
    finalDamage = updtStamina.finalDamage;
    text = updtStamina.text;
  } else if (type === 'criticalFail') text = attacker.dragon.name + ' Errou o ataque ' + attacker.dragon.selectedAttack.name + ' (FALHA CRÍTICA).';
  else text = attacker.dragon.name + ' Errou o ataque ' + attacker.dragon.selectedAttack.name + '.';
  applyDamage(matchId, attacker, defender, finalDamage, text);
};

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
    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  } catch (error) {
    return null;
  }
};

const rollDice = (faces) => Math.floor(Math.random() * faces) + 1;

const rollAttack = (attacker, defender) => {
  const roll = rollDice(20);
  let type = '';
  let dodgeBonus = 0;
  switch (defender.dragon.velocidade.total) {
    case 100: dodgeBonus = 12; break;
    case 95: dodgeBonus = 10; break;
    case 90: dodgeBonus = 8; break;
    case 85: dodgeBonus = 6; break;
    case 80: dodgeBonus = 4; break;
    case 75: dodgeBonus = 2; break;
    default: dodgeBonus = 14; break;
  }
  if (roll === 20) type = "criticalSuccess";
  else if (roll === 1) type = 'criticalFail';
  else {
    const typeAttack = attacker.dragon.selectedAttack.actual;
    const attackRoll = rollDice(20) + (typeAttack * 2);
    const dodgeRoll = rollDice(20) + dodgeBonus;
    if (attackRoll >= dodgeRoll) type = 'success';
    else type = 'fail';
  }
  return { type };
};

const calculateDamage = (attacker) => {
  const roll = rollDice(12);
  return roll + attacker.dragon.selectedAttack.actual;
};

const calcAbsorption = (defender, damage) => {
  const maxChance = 35;
  const minChance = 10;
  const maxVitalidade = 200;
  const minVitalidade = 155;
  let dificulty = 0;
  if (defender.dragon.vitalidade.actual > maxVitalidade) dificulty = maxChance;
  else if (defender.dragon.vitalidade.actual <= minVitalidade) dificulty = minChance;
  else {
    const chance = ((30 - minChance) / (maxVitalidade - minVitalidade)) * (defender.dragon.vitalidade.actual - minVitalidade) + minChance;
    dificulty = Math.round(chance);
  }
  var roll = rollDice(100);
  if (roll <= dificulty) {
    const percentToRemove = dificulty / 100;
    const amountToRemove = Math.floor(damage * percentToRemove);
    return damage - amountToRemove;
  } return damage;
};

const updateStamina = (defender, totalDamage, critical, name) => {
  const finalDamage = totalDamage;
  let text = '';
  if(critical) text = defender.dragon.name + ' recebeu ' + totalDamage + ' de Dano Crítico de um ataque de ' + name + '!';
  else text = defender.dragon.name + ' recebeu ' + totalDamage + ' de Dano de um ataque de ' + name + '!';
  return { finalDamage, text };
};

const applyDamage = async (matchId, attacker, defender, finalDamage, text) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const currDt = battleDocSnapshot.data();
      let userTurn = '';
      if (currDt.userTurn === attacker.email ) userTurn = defender.email;
      else if (currDt.userTurn === defender.email) userTurn = attacker.email;
      const attackerUser = currDt.users.find((user) => user.email === attacker.email);
      const defenderUser = currDt.users.find((user) => user.email === defender.email);
      defenderUser.dragon.vitalidade.actual -= finalDamage;
      let message = '';
      if (defenderUser.dragon.vitalidade.actual <= 0) {
        defenderUser.dragon.vitalidade.actual = 0;
        message = ' ' + attackerUser.displayName + ' venceu o combate!';
        await updateDoc(battleDocRef, { winner: attackerUser.email, userTurn: '', timeTurn: Date.now(), message: text + message, users: [ attackerUser, defenderUser ] });
        if (currDt.type === 'pvp') {
            await applyVictoryOrDefeat(attackerUser, 'winsPVP');
            await applyVictoryOrDefeat(defenderUser, 'lossesPVP');
        } else {
          await applyVictoryOrDefeat(attackerUser, 'winsIA');
          await applyVictoryOrDefeat(defenderUser, 'lossesIA');
        }
      } else {
        message = ' Vez de ' + defenderUser.displayName + '!';
        const getHora = await getHoraOficialBrasil();
        const updtdMsg = [
          ...currDt.message,
          { text: text + message, date: getHora },
        ];
        let damage = '';
        let turnAttack = defenderUser.email;
        if (text.includes('Errou')) damage = 'Errou';
        else damage = -finalDamage;
        await updateDoc(battleDocRef, {
          userTurn,
          turnAttack,
          damage,
          message: updtdMsg,
          users: [ attackerUser, defenderUser ]
        });
      }
    }
  } catch (error) {
    return false;
  }
}

export const createNewMessage = async (matchId, message) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const sameMessage = data.message.find((msg) => msg.text.includes('A Batalha começou! Vez de '));
      if (!sameMessage) {
        const getHora = await getHoraOficialBrasil();
        const updtdMsg = [...data.message, { text: message, date: getHora }];
        await updateDoc(battleDocRef, { message: updtdMsg });
      }
    }
  } catch (error) {
    return false;
  }
}

export const endMatch = async (matchId, emailUser) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (battleDocSnapshot.exists()) {
      const data = battleDocSnapshot.data();
      if (data.type === 'ia') await deleteDoc(battleDocRef);
      else {
        const endList = data.end;
        const findEnd = endList.find((dataEnd) => dataEnd === emailUser);
        if (!findEnd) {
          endList.push(emailUser);
          await updateDoc(battleDocRef, { end: endList });
        }
        if (endList.length === 2) await deleteDoc(battleDocRef);
      }
      return true;
    }
  } catch (error) {
    window.alert('Erro ao encerrar batalha:', error.message);
  }
}