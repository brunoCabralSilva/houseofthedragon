import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { applyVictoryOrDefeat } from "./mount";
import firebaseConfig from "./connection";

export const attack = async (attacker, defender, matchId, attackValue, attackName) => {
  let totalDamage = 0;
  let finalDamage = 0;
  let textAttacker = '';
  let textDefender = '';
  const testAttack = rollAttack(defender, JSON.parse(JSON.stringify(attackValue)));
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
    textDefender = 'Seu Dragão sofreu um Ataque de Oportunidade que causou a ele ' + totalDamage + ' de Dano! Ao estar na Área de Alcance do Oponente, evite sair dela ou atravessá-la caso não esteja.';
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
        await updateDoc(battleDocRef, { winner: attackerUser.email, users: [ attackerUser, defenderUser ] });
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
        if (textAttacker.includes('Seu Dragão causou') && textAttacker.includes('Dano Crítico')) {
          defenderUser.dragon.conditions.slow = true;
          defenderUser.dragon.deslocamento.actual = Math.ceil(defenderUser.dragon.deslocamento.actual / 2);
        }
        const msgAttacker = [ ...attackerUser.messages, { text: textAttacker, date: getHora }];
        const msgDefender = [ ...defenderUser.messages, { text: textDefender, date: getHora }];
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
        if (actualAttack.type !== 'Ataque de Oportunidade') {
          attackerUser.actions = {
            movement: attackerUser.actions.movement,
            default: attackerUser.actions.default + 1,
            bonus: attackerUser.actions.bonus,
          }
        }
        await updateDoc(battleDocRef, { actualAttack, users: [ attackerUser, defenderUser ] });
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
      const sameMessage = data.userLogged.messages.find((msg) => msg.text.includes('A Batalha começou! Vez de '));
      if (messageLogged.includes('A Batalha começou! Vez de ') && sameMessage) {
        return false;
      } else {
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
      const otherUser = data.users.find((user) => user.email !== email);
      userUpdating.dragon.column = column;
      userUpdating.dragon.row = row;
      userUpdating.actions = {
        bonus: userUpdating.actions.bonus,
        default: userUpdating.actions.default,
        movement: userUpdating.actions.movement + 1,
      }
      const getHora = await getHoraOficialBrasil();
      const textUserUpdating = 'Seu Dragão realizou uma Ação de movimento para se Deslocar de um ponto a outro.'
      const textOtherUser = 'O Dragão do Oponente realizou uma Ação de movimento para se Deslocar de um ponto a outro.';
      userUpdating.messages = [ ...userUpdating.messages, { text: textUserUpdating, date: getHora }];
      otherUser.messages = [ ...otherUser.messages, { text: textOtherUser, date: getHora }];
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
      const otherUser = data.users.find((user) => user.email !== email);
      const getHora = await getHoraOficialBrasil();
      let textUserUpdating = '';
      let textOtherUser = '';
      if (userUpdating.dragon.vitalidade.actual + result < userUpdating.dragon.vitalidade.total) {
        userUpdating.dragon.vitalidade.actual += result;
        textUserUpdating = 'Você usou a habilidade "Caçar" e seu Dragão recuperou ' + result + ' pontos de vida.';
        textOtherUser = 'O Oponente usou a habilidade "Caçar" e o Dragão dele recuperou ' + result + ' pontos de vida.';
      } else {
        userUpdating.dragon.vitalidade.actual = userUpdating.dragon.vitalidade.total;
        textUserUpdating = 'Você usou a habilidade "Caçar" e seu Dragão voltou a ter ' + userUpdating.dragon.vitalidade.actual + ' pontos de vida.';
        textOtherUser = 'O Oponente usou a habilidade "Caçar" e o Dragão dele voltou a ter ' + userUpdating.dragon.vitalidade.actual + ' pontos de vida.';
      }
      userUpdating.actions = {
        movement: userUpdating.actions.movement + 1,
        bonus: userUpdating.actions.bonus + 1,
        default: userUpdating.actions.default,
      }
      userUpdating.messages = [ ...userUpdating.messages, { text: textUserUpdating, date: getHora }];
      otherUser.messages = [ ...otherUser.messages, { text: textOtherUser, date: getHora }];
      userUpdating.dragon.actions.hunt = 1;
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
      const otherUser = data.users.find((user) => user.email !== email);
      const getHora = await getHoraOficialBrasil();
      let textUserUpdating = '';
      let textOtherUser = '';
      if (userUpdating.dragon.actions.position === 'ground') {
        userUpdating.dragon.actions.position = 'fly';
        textUserUpdating = 'Seu Dragão utilizou uma Ação de Movimento para Voar.';
        textOtherUser = 'O Dragão do Oponente utilizou uma Ação de Movimento para Voar.';
      } else {
        userUpdating.dragon.actions.position = 'ground';
        textUserUpdating = 'Seu Dragão utilizou uma Ação de Movimento para Aterrisar.';
        textOtherUser = 'O Dragão do Oponente utilizou uma Ação de Movimento para Aterrisar.';
      }
      userUpdating.actions = {
        bonus: userUpdating.actions.bonus,
        default: userUpdating.actions.default,
        movement: userUpdating.actions.movement + 1,
      }
      userUpdating.messages = [ ...userUpdating.messages, { text: textUserUpdating, date: getHora }];
      otherUser.messages = [ ...otherUser.messages, { text: textOtherUser, date: getHora }];
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
      if (userUpdating.dragon.conditions.slow || userUpdating.dragon.conditions.stunned) userUpdating.dragon.condicions = { slow: false, stunned: false };
      if(!otherUser.dragon.conditions.stunned) {
        otherUser.actions = { bonus: 0, default: 0, movement: 0 };
      }
      const getHora = await getHoraOficialBrasil();
      let textUserUpdating = 'Você encerrou o Turno. Vez do Oponente.';
      let textOtherUser = 'Seu Oponente encerrou o turno. Sua Vez.';
      userUpdating.messages = [ ...userUpdating.messages, { text: textUserUpdating, date: getHora }];
      otherUser.messages = [ ...otherUser.messages, { text: textOtherUser, date: getHora }];
      await updateDoc(battleDocRef, { userTurn, users: [userUpdating, otherUser] });
    }
  } catch (error) {
    return false;
  }
}

export const verifyActions = (type, userLogged) => {
  const actMove = userLogged.actions.movement;
  const actDefault = userLogged.actions.default;
  const actBonus = userLogged.actions.bonus;
  if (type === 'movement-default') {
    if (actDefault === 0 && actMove === 0 && actBonus <= 1) return false;
    return true;
  } else if (type === 'movement-bonus') {
    if (actDefault <= 1 && actMove === 0 && actBonus === 0) return false;
    if (actDefault === 0 && actMove <= 1 && actBonus === 0) return false;
    if (actDefault === 0 && actMove === 0 && actBonus <= 1) return false;
    return true;
  } else if (type === 'bonus') {
    if (actDefault <= 1 && actMove <= 1 && actBonus === 0) return false;
    if (actDefault === 0 && actMove <= 2 && actBonus === 0) return false;
    if (actDefault === 0 && actMove <= 1 && actBonus <= 1) return false;
    return true;
  } else if (type === 'movement') {
    if (actDefault <= 1 && actBonus <= 1 && actMove === 0) return false;
    if (actDefault === 0 && actBonus <= 2 && actMove === 0) return false;
    if (actDefault === 0 && actBonus <= 1 && actMove <= 1) return false;  
    return true;
  } else {
    if (actBonus <= 1 && actMove <= 1 && actDefault === 0) return false;
    return true;
  }
}

export const updateRangedSquare = (grid, userLogged, userOponent) => {
  const rangeSquaresLogged = grid.filter(item => {
    const distance = Math.abs(item.column - userLogged.dragon.column) + Math.abs(item.row - userLogged.dragon.row);
    return distance <= userLogged.dragon.alcance.actual;
  });
  const rangeSquaresOponent = grid.filter(item => {
    const distance = Math.abs(item.column - userOponent.dragon.column) + Math.abs(item.row - userOponent.dragon.row);
    return distance <= userOponent.dragon.alcance.actual;
  });
  return {rangeSquaresLogged, rangeSquaresOponent };
}

export const knockDown = async (matchId, email) => {
  try {
    const db = getFirestore(firebaseConfig);
    const battleDocRef = doc(db, 'battles', matchId);
    const battleDocSnapshot = await getDoc(battleDocRef);
    if (!battleDocSnapshot.exists()) window.alert('Batalha não encontrad(a). Por favor, atualize a página e tente novamente.');
    else {
      const data = battleDocSnapshot.data();
      const userUpdating = data.users.find((user) => user.email === email);
      const otherUser = data.users.find((user) => user.email !== email);
      userUpdating.actions = {
        bonus: userUpdating.actions.bonus + 1,
        movement: userUpdating.actions.movement + 1,
        default: 0,
      };
      const getHora = await getHoraOficialBrasil();
      let textUserUpdating = '';
      let textOtherUser = '';
      const rollUserUpdating = rollDice(20) + (userUpdating.dragon.vitalidade.total / 10);
      const rollOtherUser = rollDice(20) + (otherUser.dragon.vitalidade.total / 10);
      if (rollUserUpdating >= rollOtherUser) {
        textUserUpdating = 'Seu Dragão derrubou o Dragão do Oponente dos Céus.';
        textOtherUser = 'O Oponente derrubou dos Céus o Dragão que pertence a você';
        otherUser.actions.position = 'ground';
        otherUser.conditions.stunned = true;
      } else {
        textUserUpdating = 'Seu Dragão falhou em tentar derrubat o Dragão do Oponente dos Céus.';
        textOtherUser = 'O Oponente falhou em derrubar dos Céus o Dragão que pertence a você.';
      }
      userUpdating.messages = [ ...userUpdating.messages, { text: textUserUpdating, date: getHora }];
      otherUser.messages = [ ...otherUser.messages, { text: textOtherUser, date: getHora }];
      await updateDoc(battleDocRef, { users: [userUpdating, otherUser] });
    }
  } catch (error) {
    return false;
  }
}