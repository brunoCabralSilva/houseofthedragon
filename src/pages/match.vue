<template>
  <NavigationBattle />
  <div v-if="!showData" class="w-full h-screen flex items-center justify-center">
    <Loading />
  </div>
  <div v-else class="w-full min-h-screen items-center justify-center bg-arena text-white">
    <div class="w-full h-full">
      <div
      class="bg-yellow-500 flex items-center justify-center border border-golden"
        v-if="winner"
      >
        <div class="w-full text-center p-2 relative">
          <div
            @click="endGame"
            class="break-words p-3 w-full flex justify-end top-0 right-0"
          >
            <FontAwesomeIcon
              :icon="['fas', 'circle-xmark']"
              class="break-words text-3xl text-golden cursor-pointer duration-500 transition-colors"
              @click="hideLogout"
            />
          </div>
          <p>{{ message }}</p>
          <p>Fim da Partida!</p>
        </div>
      </div>
      <div class="flex flex-col justify-between h-full">
        <div class="flex justify-start absolute top-0 left-0 p-2 pb-3 pr-3 bg-black/80 rounded-r">
          <div class="relative flex items-end">
            <img
            :src="userOponent.profileImage !== '' ? userOponent.profileImage : '@/assets/Daemon.png'"
            class="h-10 w-10 object-cover rounded-full absolute z-20 top-0 left-0 bg-black border-2 border-golden"
            />
            <img
            :src="userOponent.dragon.imageIconURL"
            class="h-20 w-20 object-cover rounded-full relative border-4 border-golden mt-3 ml-2"
            />
            <button
              type="button"
              class="h-5 w-5 object-cover rounded-full absolute z-20 bottom-0 left-0 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer"
            >
              <FontAwesomeIcon :icon="['fas', 'info']" />
            </button>
          </div>
          <div class="flex flex-col items-start justify-center w-2/12">
            <div class="grid grid-cols-1 pt-2 w-full">
              <p class="text-left text-xs bg-green-700 px-2 rounded-full text-white border-2 border-golden w-44">
                {{
                  userOponent.dragon.vitalidade.actual
                  + userOponent.dragon.vitalidade.bonus
                }} / 
                {{
                  userOponent.dragon.vitalidade.total
                  + userOponent.dragon.vitalidade.bonus
                }}
              </p>
            </div>
            <p class="text-xl leading-4 mt-1 pl-1 text-white">
              {{ userOponent.dragon.name }}
            </p>
            <p v-if="userTurn === userOponent.email" class="leading-2 text-xs pl-1 w-44">Turno do Oponente</p>
          </div>
        </div>

        <div class="w-full h-screen">

        </div>
        
        
        <div class="flex flex-col justify-between absolute bottom-0 right-0 px-3 pt-3 pb-2 bg-black/80 rounded-l-lg">
          <div v-if="!hideMessages" class="mb-4 border border-golden rounded h-20vh">
            <div
              class="w-full flex flex-col h-full items-center justify-center"
            >
              <p class="w-full px-2 pt-1 border-b-golden border border-transparent text-sm">Histórico</p>
              <div class="w-full h-full justify-end relative overflow-y-auto pb-2 px-1">
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  class=""
                >
                  <span class=" pb-1 leading-4 text-golden">{{ message.date }}</span>
                  <span class="pt-1 leading-4 text-sm">{{ message.text }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <div v-if="userTurn === userLogged.email" class="pl-2">
              <div class="flex flex-col items-start w-full justify-between">
                <p class="text-2xl leading-4 mt-1 pr-1 text-golden pb-1">
                  {{ userLogged.dragon.name }}
                  <span class="text-base">lv 1</span>
                </p>
                <div class="flex gap-1 items-center w-full">
                  <button
                    type="button"
                    @click="previousAttack"
                    class="flex flex-col"
                  >
                    <FontAwesomeIcon :icon="['fas', 'caret-left']" class="text-2xl cursor-pointer text-golden" />
                  </button>
                  <button
                    type="button"
                    @click="attackOponent"
                    class="p-1 px-2 cursor-pointer border-2 text-xs hover:text-black hover:font-bold border-golden bg-red-700 duration-500 transition-colors rounded-full text-center w-1/2 capitalize">
                    {{ userLogged.dragon.selectedAttack.name }} {{ userLogged.dragon.selectedAttack.actual }}
                </button>
                <button
                  type="button"
                  @click="nextAttack"
                  class="flex flex-col">
                  <FontAwesomeIcon :icon="['fas', 'caret-right']" class="text-2xl cursor-pointer text-golden" />
                </button>
                </div>
                <p class="mt-1 text-sm">
                  Ataca o inimigo com um golpe da desgraça. 
                </p>
              </div>
            </div>
            <div class="flex justify-end items-center">
              <div class="flex flex-col items-end justify-center">
                <div class="flex flex-col items-end w-full pr-1">
                  <p class="text-right text-xs bg-green-700 px-2 rounded-full text-white w-44 border-2 border-golden mb-1">
                    hp
                    {{
                      userLogged.dragon.vitalidade.actual
                      + userLogged.dragon.vitalidade.bonus
                    }} / 
                    {{
                      userLogged.dragon.vitalidade.total
                      + userLogged.dragon.vitalidade.bonus
                    }}
                  </p>
                  <p class="text-right text-xs bg-blue-800 px-2 rounded-full border-2 border-golden w-28 text-white mb-1">
                    vel.
                    {{
                      userLogged.dragon.velocidade.actual 
                      + userLogged.dragon.velocidade.total
                    }}
                  </p>
                  <p class="text-right text-xs bg-red-700 px-2 rounded-full text-white border-2 w-20 border-golden mb-1">
                    reb.
                    {{
                      userLogged.dragon.rebeldia.actual
                      + userLogged.dragon.rebeldia.total
                    }}
                  </p>
                  <p v-if="userTurn === userLogged.email" class="leading-2 text-xs pl-1">Seu Turno</p>
                </div>
              </div>
              <div class="relative flex justify-end">
                <button
                  type="button"
                  class="h-5 w-5 object-cover rounded-full absolute z-20 top-1 right-2 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer"
                >
                  <FontAwesomeIcon :icon="['fas', 'info']" />
                </button>
                <button
                  type="button"
                  @click="hide"
                  class="h-5 w-5 object-cover rounded-full absolute top-7 right-0 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer p-1"
                >
                  <FontAwesomeIcon :icon="['fas', 'list']" />
                </button>
                <img
                  :src="userLogged.profileImage"
                  class="h-10 w-10 object-cover rounded-full absolute z-20 bottom-0 right-0 bg-black border-2 border-golden"
                />
                <img
                  :src="userLogged.dragon.imageIconURL"
                  class="mr-6 mb-3 h-20 w-20 object-cover rounded-full relative border-4 border-golden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavigationBattle from '@/components/navigationBattle.vue';
import Loading from '@/components/loading.vue';
import { doc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { onSnapshot } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { onUnmounted } from "vue";
import { authenticate } from '@/firebase/authenticate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfo, faCaretUp, faCaretDown, faCaretRight, faCaretLeft, faCircleXmark, faList } from '@fortawesome/free-solid-svg-icons';
import { attack, endMatch } from '@/firebase/battle';
import { rollIaTurn } from '@/firebase/battleIa';

library.add(faCircleXmark);
library.add(faCaretRight);
library.add(faCaretDown);
library.add(faCaretLeft);
library.add(faCaretUp);
library.add(faInfo);
library.add(faList);

export default {
  name: 'MatchPage',
  components: {
    Loading,
    NavigationBattle,
    FontAwesomeIcon
  },
  props: { battleId: { type: String, required: true } },
  data() {
    const router = useRouter();
    return {
      chatSnapShot: null,
      showData: false,
      router: router,
      matchId: router.currentRoute.value.params.battleId,
      type: '',
      winner: null,
      timeTurn: '',
      message: [],
      userTurn: '',
      hideMessages: true,
      userLogged: {
        email: '',
        profileImage: '',
        displayName: '',
        dragon: {
          id: '',
          name: '',
          vitalidade: { actual: 0, total: 0, bonus: 0 },
          velocidade: { actual: 0, total: 0, bonus: 0 },
          rebeldia: { actual: 0, total: 0, bonus: 0 },
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
          vitalidade: { actual: 0, total: 0, bonus: 0 },
          velocidade: { actual: 0, total: 0, bonus: 0 },
          rebeldia: { actual: 0, total: 0, bonus: 0 },
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
    }
  },
  async mounted() {
    const firebaseConfig = {
      apiKey: "AIzaSyDnmfij0BzqhrXm4mysV7RNPXaeYEnVgcQ",
      authDomain: "valyrian-wars-1.firebaseapp.com",
      projectId: "valyrian-wars-1",
      storageBucket: "valyrian-wars-1.appspot.com",
      messagingSenderId: "719626971606",
      appId: "1:719626971606:web:85eac82dd4166fdbce5c77",
      measurementId: "G-FZM2Y82780"
    };
    const auth = await authenticate();
    if (auth) {
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      this.chatSnapShot = onSnapshot(
        doc(db, 'battles', this.matchId),
        async (snapshot) => {
          if (snapshot.data()) {
            const data = snapshot.data();
            this.type = data.type;
            this.winner = data.winner;
            const userLogged = data.users.find((user) => user.email === auth.email);
            const userOponent = data.users.find((user) => user.email !== auth.email);
            this.userLogged = {
              ...userLogged,
              dragon: {
                ...userLogged.dragon,
                selectedAttack: { name: 'dracarys', actual: userLogged.dragon.dracarys.actual, bonus: userLogged.dragon.dracarys.bonus },
                attacks: [
                  // ...userLogged.dragon.attacks,
                  { name: 'dracarys',
                    actual: userLogged.dragon.dracarys.actual,
                    total: userLogged.dragon.dracarys.total,
                    bonus: userLogged.dragon.dracarys.bonus },
                  { name: 'mordida',
                    actual: userLogged.dragon.mordida.actual,
                    total: userLogged.dragon.mordida.total,
                    bonus: userLogged.dragon.mordida.bonus },
                  { name: 'garras',
                    actual: userLogged.dragon.garras.actual,
                    total: userLogged.dragon.garras.total,
                    bonus: userLogged.dragon.garras.bonus },
                ],
              },
            };
            this.userOponent = {
              ...userOponent,
              dragon: {
                ...userOponent.dragon,
                selectedAttack: { name: 'dracarys', actual: userOponent.dragon.dracarys.actual, bonus: userOponent.dragon.dracarys.bonus },
                attacks: [
                  { name: 'dracarys',
                    actual: userOponent.dragon.dracarys.actual,
                    total: userOponent.dragon.dracarys.total,
                    bonus: userOponent.dragon.dracarys.bonus },
                  { name: 'mordida',
                    actual: userOponent.dragon.mordida.actual,
                    total: userOponent.dragon.mordida.total,
                    bonus: userOponent.dragon.mordida.bonus },
                  { name: 'garras',
                    actual: userOponent.dragon.garras.actual,
                    total: userOponent.dragon.garras.total,
                    bonus: userOponent.dragon.garras.bonus },
                ],
              },
            };
            this.userTurn = data.userTurn;
            this.message = data.message;
            if (data.userTurn === 'ia') {
              setTimeout(async () => {
                await rollIaTurn(this.matchId);
              }, 3000)
            }
          }
        }
      );
      onUnmounted(this.chatSnapShot);
      this.showData = true;
    } else this.router.push("/login");
  },
  beforeUnmount() {
    if (this.chatSnapShot) {
      this.chatSnapShot();
    }
  },
  methods: {
    hide() {
      this.hideMessages = !this.hideMessages;
    },
    async endGame() {
      await endMatch(this.matchId, this.userLogged.email);
      this.$router.push('/matchs');
    },
    updateMessage() { this.message = '' },
    async attackOponent() {
      await attack(this.userLogged, this.userOponent, this.matchId);
    },
    previousAttack() {
      if (this.userLogged.dragon && this.userLogged.dragon.attacks) {
        const attacks = this.userLogged.dragon.attacks;
        const currentAttackIndex = attacks.findIndex(
          attack => attack.name === this.userLogged.dragon.selectedAttack.name
        );
        if (currentAttackIndex !== -1) {
          const previousAttackIndex = currentAttackIndex === 0 
            ? attacks.length - 1 
            : currentAttackIndex - 1;
          this.userLogged.dragon.selectedAttack = attacks[previousAttackIndex];
        }
      }
    },
    nextAttack() {
      if (this.userLogged.dragon && this.userLogged.dragon.attacks) {
        const attacks = this.userLogged.dragon.attacks;
        const currentAttackIndex = attacks.findIndex(
          attack => attack.name === this.userLogged.dragon.selectedAttack.name
        );
        if (currentAttackIndex !== -1) {
          const nextAttackIndex = currentAttackIndex === attacks.length - 1 
            ? 0 
            : currentAttackIndex + 1;
          this.userLogged.dragon.selectedAttack = attacks[nextAttackIndex];
        }
      }
    }
  }
}
</script>