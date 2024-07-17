import { createStore } from 'vuex';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnmfij0BzqhrXm4mysV7RNPXaeYEnVgcQ",
  authDomain: "valyrian-wars-1.firebaseapp.com",
  projectId: "valyrian-wars-1",
  storageBucket: "valyrian-wars-1.appspot.com",
  messagingSenderId: "719626971606",
  appId: "1:719626971606:web:85eac82dd4166fdbce5c77",
  measurementId: "G-FZM2Y82780"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const store = createStore({
  state() {
    return {
      type: '',
      winner: '',
      userTurn: '',
      userLogged: {
        email: '',
        profileImage: '',
        displayName: '',
        actions: { movement: 0, default: 0, bonus: 0 },
        dragon: {
          id: '',
          name: '',
          nivel: 1,
          column: 0,
          row: 0,
          oportunity: '',
          actions: {
            dracarys: { actual: 0, total: 0, bonus: 0 },
            mordida: { actual: 0, total: 0, bonus: 0 },
            garras: { actual: 0, total: 0, bonus: 0 },
            hunt: 0,
            position: 'ground',
          },
          vitalidade: { actual: 0, total: 0, bonus: 0 },
          velocidade: { actual: 0, total: 0, bonus: 0 },
          rebeldia: { actual: 0, total: 0, bonus: 0 },
          deslocamento: { actual: 0, total: 0, bonus: 0 },
          alcance: { actual: 0, total: 0, bonus: 0 },
          selectedAttack: { name: 'dracarys', actual: 0, bonus: 0 },
          aparencia: '',
          description: '',
          imageURL: '',
          imageIconURL: '',
          linkFont: '',
          nameFont: '',
        }
      },
      userOponent: {
        email: '',
        profileImage: '',
        displayName: '',
        actions: { movement: 0, default: 0, bonus: 0 },
        dragon: {
          id: '',
          name: '',
          nivel: 1,
          column: 0,
          row: 0,
          oportunity: '',
          actions: {
            dracarys: { actual: 0, total: 0, bonus: 0 },
            mordida: { actual: 0, total: 0, bonus: 0 },
            garras: { actual: 0, total: 0, bonus: 0 },
            hunt: 0,
            position: 'ground',
          },
          vitalidade: { actual: 0, total: 0, bonus: 0 },
          velocidade: { actual: 0, total: 0, bonus: 0 },
          rebeldia: { actual: 0, total: 0, bonus: 0 },
          deslocamento: { actual: 0, total: 0, bonus: 0 },
          alcance: { actual: 0, total: 0, bonus: 0 },
          aparencia: '',
          description: '',
          imageURL: '',
          imageIconURL: '',
          linkFont: '',
          nameFont: '',
        }
      },
    };
  },
  mutations: {
    setUserLogged(state, userLogged)  { state.userLogged = userLogged },
    setUserOponent(state, userOponent) { state.userOponent = userOponent },
    setType(state, type) { state.type = type },
    setWinner(state, winner) { state.winner = winner },
    setUserTurn(state, userTurn) { state.userTurn = userTurn },
  },
  actions: {
    fetchMatchData({ commit }, { matchId, auth }) {
      onSnapshot(doc(db, 'battles', matchId), (snapshot) => {
        if (snapshot.data()) {
          const data = snapshot.data();
          commit('setType', data.type);
          commit('setWinner', data.winner);
          commit('setUserTurn', data.userTurn);
          const userLogged = data.users.find((user) => user.email === auth.email);
          const userOponent = data.users.find((user) => user.email !== auth.email);

          commit('setUserLogged', {
            ...userLogged,
            dragon: {
              ...userLogged.dragon,
              actions: {
                dracarys: { actual: userLogged.dragon.actions.dracarys.actual, total: userLogged.dragon.actions.dracarys.total, bonus: userLogged.dragon.actions.dracarys.bonus },
                mordida: { actual: userLogged.dragon.actions.mordida.actual, total: userLogged.dragon.actions.mordida.total, bonus: userLogged.dragon.actions.mordida.bonus },
                garras: { actual: userLogged.dragon.actions.garras.actual, total: userLogged.dragon.actions.garras.total, bonus: userLogged.dragon.actions.garras.bonus },
                hunt: userLogged.dragon.actions.hunt,
                position: userLogged.dragon.actions.position,
              },
              alcance: { actual: userLogged.dragon.alcance.actual, total: userLogged.dragon.alcance.total, bonus: userLogged.dragon.alcance.bonus },
              deslocamento: { actual: userLogged.dragon.deslocamento.actual, total: userLogged.dragon.deslocamento.total, bonus: userLogged.dragon.deslocamento.bonus },
            },
          });

          commit('setUserOponent', {
            ...userOponent,
            dragon: {
              ...userOponent.dragon,
              actions: {
                dracarys: { actual: userOponent.dragon.actions.dracarys.actual, total: userOponent.dragon.actions.dracarys.total, bonus: userOponent.dragon.actions.dracarys.bonus },
                mordida: { actual: userOponent.dragon.actions.mordida.actual, total: userOponent.dragon.actions.mordida.total, bonus: userOponent.dragon.actions.mordida.bonus },
                garras: { actual: userOponent.dragon.actions.garras.actual, total: userOponent.dragon.actions.garras.total, bonus: userOponent.dragon.actions.garras.bonus },
                hunt: userOponent.dragon.actions.hunt,
                position: userOponent.dragon.actions.position,
              },
              alcance: { actual: userOponent.dragon.alcance.actual, total: userOponent.dragon.alcance.total, bonus: userOponent.dragon.alcance.bonus },
              deslocamento: { actual: userOponent.dragon.deslocamento.actual, total: userOponent.dragon.deslocamento.total, bonus: userOponent.dragon.deslocamento.bonus },
            },
          });
        }
      });
    },
  },
  getters: {
    userLogged: state => state.userLogged,
    userOponent: state => state.userOponent,
    type: state => state.type,
    winner: state => state.winner,
    userTurn: state => state.userTurn,
  }
});

export default store;
