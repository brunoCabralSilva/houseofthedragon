import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { applyVictoryOrDefeat } from "./mount";
import firebaseConfig from "./connection";

export const attack = async (attacker, defender, matchId, attackValue, attackName) => {
  let totalDamage = 0;
  let finalDamage = 0;
  let textAttacker = '';
  let textDefender = '';
  const testAttack = rollAttack(defender, attackValue);
  const { type } = testAttack;
  if (type === 'success') {
    const damage = calculateDamage(attackValue) * 2;
    totalDamage = calcAbsorption(defender, damage);
    const updtStamina = updateStamina(totalDamage, false, attackName);
    finalDamage = updtStamina.finalDamage;
    textAttacker = updtStamina.textAttacker;
    textDefender = updtStamina.textDefender;
  } else if (type === 'criticalSuccess') {
    totalDamage = (attackValue + 12) * 2;
    const updtStamina = updateStamina(totalDamage, true, attackName);
    finalDamage = updtStamina.finalDamage;
    textAttacker = updtStamina.textAttacker;
    textDefender = updtStamina.textDefender;
  } else if (type === 'criticalFail') {
    if (attackName === 'Ataque de Oportunidade') {
      textAttacker = 'Seu Dragão errou um Ataque de Oportunidade (FALHA CRÍTICA).'
      textDefender = 'Seu Dragão desviou de um Ataque de Oportunidade (FALHA CRÍTICA).'
    } else {
      textAttacker = 'Seu Dragão errou o Ataque ' + attackName + ' (FALHA CRÍTICA).';
      textDefender = 'Seu Dragão desviou do Ataque ' + attackName + ' (FALHA CRÍTICA).';
    }
  }
  else {
    if (attackName === 'Ataque de Oportunidade') {
      textAttacker = 'Seu Dragão errou um Ataque de Oportunidade.';
      textDefender = 'Seu Dragão desviou de um Ataque de Oportunidade.';
    } else {
      textAttacker = 'Seu Dragão errou o Ataque ' + attackName + '.';
      textDefender = 'Seu Dragão desviou do Ataque ' + attackName + '.';
    }
  }
  applyDamage(matchId, attacker, defender, finalDamage, textAttacker, textDefender);
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

const rollAttack = (defender, attackValue) => {
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
    const attackRoll = rollDice(20) + (attackValue * 2);
    const dodgeRoll = rollDice(20) + dodgeBonus;
    if (attackRoll >= dodgeRoll) type = 'success';
    else type = 'fail';
  }
  return { type };
};

const calculateDamage = (attackValue) => {
  const roll = rollDice(12);
  return roll + attackValue;
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

const updateStamina = (totalDamage, critical, name) => {
  const finalDamage = totalDamage;
  let textDefender = '';
  let textAttacker = '';
  if (name === 'Ataque de Oportunidade') {
    textAttacker = 'Seu Dragão causou ' + totalDamage + ' de Dano em um Ataque de Oportunidade!';
    textDefender = 'Seu Dragão sofreu um Ataque de Oportunidade que causou a ele ' + totalDamage + ' de Dano! Evite sair da área de alcance do Oponente ou atravessá-la.';
  } else if(critical) {
    textAttacker = 'Seu Dragão causou ' + totalDamage + ' de Dano Crítico em ataque de ' + name + '!';
    textDefender = 'Seu Dragão sofreu ' + totalDamage + ' de Dano Crítico em um ataque de ' + name + '!';
  } else {
    textAttacker = 'Seu Dragão causou ' + totalDamage + ' de Dano em um ataque de ' + name + '!';
    textDefender = 'Seu Dragão sofreu ' + totalDamage + ' de Dano em um ataque de ' + name + '!';
  }
  return { finalDamage, textAttacker, textDefender };
};

const applyDamage = async (matchId, attacker, defender, finalDamage, textAttacker, textDefender) => {
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
      const getHora = await getHoraOficialBrasil();
      if (defenderUser.dragon.vitalidade.actual <= 0) {
        defenderUser.dragon.vitalidade.actual = 0;
        const message = ' ' + attackerUser.displayName + ' venceu o combate!';
        const msgAttacker = [ ...attackerUser.messages, { text: textAttacker + message, date: getHora }];
        const msgDefender = [ ...defenderUser.messages, { text: textDefender + message, date: getHora }];
        attackerUser.messages = msgAttacker;
        defenderUser.messages = msgDefender;
        await updateDoc(battleDocRef, { winner: attackerUser.email, userTurn: '', users: [ attackerUser, defenderUser ] });
        if (currDt.type === 'pvp') {
            await applyVictoryOrDefeat(attackerUser, 'winsPVP');
            await applyVictoryOrDefeat(defenderUser, 'lossesPVP');
        } else {
          if (defenderUser.dispolayName !== 'IA')
            await applyVictoryOrDefeat(attackerUser, 'winsIA');
          if (defenderUser.dispolayName !== 'IA')
            await applyVictoryOrDefeat(defenderUser, 'lossesIA');
        }
      } else {
        const message = ' Vez de ' + defenderUser.displayName + '!';
        const msgAttacker = [ ...attackerUser.messages, { text: textAttacker + message, date: getHora }];
        const msgDefender = [ ...defenderUser.messages, { text: textDefender + message, date: getHora }];
        attackerUser.messages = msgAttacker;
        defenderUser.messages = msgDefender;
        const actualAttack = {
          damage: '',
          type: '',
          turnAttack: defenderUser.email,
        };

        if (textAttacker.includes('dracarys')) actualAttack.type = 'dracarys';
        else if(textAttacker.includes('mordida')) actualAttack.type = 'mordida';
        else if(textAttacker.includes('garras')) actualAttack.type = 'garras';
        else actualAttack.type = 'Ataque de Oportunidade';
        if (textAttacker.includes('Errou')) actualAttack.damage = 'Errou';
        else actualAttack.damage = -finalDamage;
        await updateDoc(battleDocRef, {
          userTurn,
          actualAttack,
          users: [ attackerUser, defenderUser ]
        });
      }
    }
  } catch (error) {
    return false;
  }
}

export const createNewMessage = async (matchId, email, messageLogged, messageOponent) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const userLogged = data.users.find((user) => user.email === email);
      const userOponent = data.users.find((user) => user.email !== email);
      const sameMessage = data.message.find((msg) => msg.text.includes('A Batalha começou! Vez de '));
      if (!sameMessage) {
        const getHora = await getHoraOficialBrasil();
        userLogged.messages = [...userLogged.messages, { text: messageLogged, date: getHora }];
        userOponent.messages = [...userOponent.messages, { text: messageOponent, date: getHora }];
        await updateDoc(battleDocRef, { users: [ userLogged, userOponent ] });
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

export const updateDragonPosition = async (matchId, email, column, row, oportunity) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const userUpdating = data.users.find((user) => user.email === email);
      userUpdating.dragon.column = column;
      userUpdating.dragon.row = row;
      userUpdating.actions = {
        bonus: userUpdating.actions.bonus,
        default: userUpdating.actions.default,
        movement: userUpdating.actions.movement + 1,
      }
      const otherUser = data.users.find((user) => user.email !== email);
      await updateDoc(battleDocRef, { users: [userUpdating, otherUser] });
      if (oportunity !== '') {
        let attackValue = 0;
        if (otherUser.dragon.actions.garras.actual > otherUser.dragon.actions.mordida.actual) {
          attackValue = otherUser.dragon.actions.garras.actual;
        } else attackValue = otherUser.dragon.actions.mordida.actual;
        await attack(otherUser, userUpdating, matchId, attackValue, oportunity);
      }
    }
  } catch (error) {
    return false;
  }
}

export const hunt = async (matchId, email, numberOfDices) => {
  let result = 0;
  for (let i = 0; i < numberOfDices; i += 1) {
    result += Math.floor(Math.random() * 10) + 1;
  }
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const userUpdating = data.users.find((user) => user.email === email);
      if (userUpdating.dragon.vitalidade.actual + result < userUpdating.dragon.vitalidade.total) {
        userUpdating.dragon.vitalidade.actual += result;
      } else userUpdating.dragon.vitalidade.actual = userUpdating.dragon.vitalidade.total;
      userUpdating.actions = {
        movement: userUpdating.actions.movement + 1,
        bonus: userUpdating.actions.bonus + 1,
        default: userUpdating.actions.default,
      }
      userUpdating.dragon.actions.hunt = 1;
      const otherUser = data.users.find((user) => user.email !== email);
      await updateDoc(battleDocRef, { users: [userUpdating, otherUser] });
    }
  } catch (error) {
    return false;
  }
}

export const changePosition = async (matchId, email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const userUpdating = data.users.find((user) => user.email === email);
      if (userUpdating.dragon.actions.position === 'ground') {
        userUpdating.dragon.actions.position = 'fly';
      } else userUpdating.dragon.actions.position = 'ground';
      userUpdating.actions = {
        bonus: userUpdating.actions.bonus,
        default: userUpdating.actions.default,
        movement: userUpdating.actions.movement + 1,
      }
      const otherUser = data.users.find((user) => user.email !== email);
      await updateDoc(battleDocRef, { users: [userUpdating, otherUser] });
    }
  } catch (error) {
    return false;
  }
}

export const endTurn = async (matchId, email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const userUpdating = data.users.find((user) => user.email === email);
      const otherUser = data.users.find((user) => user.email !== email);
      const userTurn = otherUser.email;
      otherUser.actions = { bonus: 0, default: 0, movement: 0 };
      await updateDoc(battleDocRef, { userTurn, users: [userUpdating, otherUser] });
    }
  } catch (error) {
    return false;
  }
}