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
        dragon: {
          id: '',
          name: '',
          nivel: 1,
          column: 0,
          row: 0,
          oportunity: '',
          vitalidade: { actual: 0, total: 0, bonus: 0 },
          velocidade: { actual: 0, total: 0, bonus: 0 },
          rebeldia: { actual: 0, total: 0, bonus: 0 },
          deslocamento: { actual: 0, total: 0, bonus: 0 },
          alcance: { actual: 0, total: 0, bonus: 0 },
          selectedAttack: { name: 'dracarys', actual: 0, bonus: 0 },
          attacks: [
            { name: 'dracarys', actual: 0, total: 0, bonus: 0 },
            { name: 'mordida', actual: 0, total: 0, bonus: 0 },
            { name: 'garras', actual: 0, total: 0, bonus: 0 },
          ],
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
        dragon: {
          id: '',
          name: '',
          oportunity: '',
          nivel: 1,
          column: 0,
          row: 0,
          vitalidade: { actual: 0, total: 0, bonus: 0 },
          velocidade: { actual: 0, total: 0, bonus: 0 },
          rebeldia: { actual: 0, total: 0, bonus: 0 },
          deslocamento: { actual: 0, total: 0, bonus: 0 },
          alcance: { actual: 0, total: 0, bonus: 0 },
          selectedAttack: { name: 'dracarys', actual: 0, bonus: 0 },
          attacks: [
            { name: 'dracarys', actual: 0, total: 0, bonus: 0 },
            { name: 'mordida', actual: 0, total: 0, bonus: 0 },
            { name: 'garras', actual: 0, total: 0, bonus: 0 },
          ],
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
          const userLogged = data.users.find((user) => user.email === auth.email);
          const userOponent = data.users.find((user) => user.email !== auth.email);

          commit('setUserLogged', {
            ...userLogged,
            dragon: {
              ...userLogged.dragon,
              selectedAttack: { name: 'dracarys', actual: userLogged.dragon.dracarys.actual, bonus: userLogged.dragon.dracarys.bonus },
              attacks: [
                { name: 'dracarys', actual: userLogged.dragon.dracarys.actual, total: userLogged.dragon.dracarys.total, bonus: userLogged.dragon.dracarys.bonus },
                { name: 'mordida', actual: userLogged.dragon.mordida.actual, total: userLogged.dragon.mordida.total, bonus: userLogged.dragon.mordida.bonus },
                { name: 'garras', actual: userLogged.dragon.garras.actual, total: userLogged.dragon.garras.total, bonus: userLogged.dragon.garras.bonus },
              ],
              alcance: { actual: userLogged.dragon.alcance.actual, total: userLogged.dragon.alcance.total, bonus: userLogged.dragon.alcance.bonus },
              deslocamento: { actual: userLogged.dragon.deslocamento.actual, total: userLogged.dragon.deslocamento.total, bonus: userLogged.dragon.deslocamento.bonus },
              nivel: userLogged.dragon.nivel,
            },
          });

          commit('setUserOponent', {
            ...userOponent,
            dragon: {
              ...userOponent.dragon,
              selectedAttack: { name: 'dracarys', actual: userOponent.dragon.dracarys.actual, bonus: userOponent.dragon.dracarys.bonus },
              attacks: [
                { name: 'dracarys', actual: userOponent.dragon.dracarys.actual, total: userOponent.dragon.dracarys.total, bonus: userOponent.dragon.dracarys.bonus },
                { name: 'mordida', actual: userOponent.dragon.mordida.actual, total: userOponent.dragon.mordida.total, bonus: userOponent.dragon.mordida.bonus },
                { name: 'garras', actual: userOponent.dragon.garras.actual, total: userOponent.dragon.garras.total, bonus: userOponent.dragon.garras.bonus },
              ],
              alcance: { actual: userOponent.dragon.alcance.actual, total: userOponent.dragon.alcance.total, bonus: userOponent.dragon.alcance.bonus },
              deslocamento: { actual: userOponent.dragon.deslocamento.actual, total: userOponent.dragon.deslocamento.total, bonus: userOponent.dragon.deslocamento.bonus },
              nivel: userOponent.dragon.nivel,
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
