<template>
  <NavigationBattle />
  <div v-if="!showData" class="transition-all duration-500 w-full h-screen flex items-center justify-center">
    <Loading />
  </div>
  <div v-else class="transition-all duration-500 w-full min-h-screen items-center justify-center bg-arena text-white bg-cover">
    <div class="transition-all duration-500 w-full h-full">
      <div
      class="transition-all duration-500 bg-yellow-500 flex items-center justify-center border border-golden"
        v-if="winner"
      >
        <div class="transition-all duration-500 w-full text-center p-2 relative">
          <div
            @click="endGame"
            class="transition-all duration-500 break-words p-3 w-full flex justify-end top-0 right-0"
          >
            <FontAwesomeIcon
              :icon="['fas', 'circle-xmark']"
              class="transition-all duration-500 break-words text-3xl text-golden cursor-pointer"
              @click="hideLogout"
            />
          </div>
          <p>{{ message }}</p>
          <p>Fim da Partida!</p>
        </div>
      </div>
      <div class="transition-all duration-500 flex flex-col justify-between h-screen items-end">
        <div class="transition-all duration-500 flex justify-start absolute top-0 left-0 p-2 pb-3 pr-3 bg-black/80 rounded-r">
          <div class="transition-all duration-500 relative flex items-end">
            <img
            :src="userOponent.profileImage !== '' ? userOponent.profileImage : '@/assets/Daemon.png'"
            class="transition-all duration-500 h-10 w-10 object-cover rounded-full absolute z-20 top-0 left-0 bg-black border-2 border-golden"
            />
            <img
            :src="userOponent.dragon.imageIconURL"
            class="transition-all duration-500 h-20 w-20 object-cover rounded-full relative border-4 border-golden mt-3 ml-2"
            />
            <button
              type="button"
              class="transition-all duration-500 h-5 w-5 object-cover rounded-full absolute z-20 bottom-0 left-0 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer"
            >
              <FontAwesomeIcon :icon="['fas', 'info']" />
            </button>
          </div>
          <div class="transition-all duration-500 flex flex-col items-start justify-center w-2/12">
            <div class="transition-all duration-500 grid grid-cols-1 pt-2 w-full">
              <p class="transition-all duration-500 text-left text-xs bg-green-700 px-2 rounded-full text-white border-2 border-golden w-44">
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
            <p class="transition-all duration-500 text-xl leading-4 mt-1 pl-1 text-white">
              {{ userOponent.dragon.name }}
            </p>
            <p v-if="userTurn === userOponent.email" class="transition-all duration-500 leading-2 text-xs pl-1 w-44">Turno do Oponente</p>
          </div>
        </div>

        <div class="transition-all duration-500 w-full h-screen flex flex-col absolute">
          <div class="w-1/2 h-50vh absolute top-0 right-0 flex items-end justify-start">
            <div class="dragon w-20 h-24 text-black relative flex flex-col justify-end" >
              <p id="damage-top" class="text-3xl w-full text-center font-bold text-red-500 top-0" :class="typeof damageTop === 'string' ? 'text-white text-xl' : 'text-red-500 text-3xl'">{{ damageTop }}</p>
              <img
                id="top-dragon"
                class="rounded-full"
                :class="'border-4 border-golden'"
                :src="userOponent.dragon.imageIconURL"
              />
            </div>
          </div>
          <div :v-if="damageType !== ''" class="w-full h-full flex items-center justify-center">
            <img
              v-if="damageType !== ''"
              :src="require(`@/assets/${damageType}.png`)"
              :alt="damageType"
              class="z-30 h-20 w-20"
            />
          </div>
          <div class="w-1/2 h-50vh absolute bottom-0 left-0 flex items-start justify-end">
            <div class="dragon absolute w-20 h-24 text-black">
              <img
              id="bottom-dragon"
              class="rounded-full"
              :class="'border-4 border-golden'"
              :src="userLogged.dragon.imageIconURL"
              />
              <p id="damage-bottom" class="text-3xl w-full text-center font-bold flex flex-col justify-end" :class="typeof damageBottom === 'string' ? 'text-white text-xl' : 'text-red-500 text-3xl'">{{ damageBottom }}</p>
            </div>
          </div>
        </div>
      
        <div class="transition-all duration-500 flex flex-col items-between px-3 pt-3 pb-2 bg-black/80 rounded-l-lg w-full sm:w-1/2 absolute bottom-0">
          <div v-if="!hideMessages" class="transition-all duration-500 mb-3 border border-golden w-full rounded h-20vh">
            <div
              class="transition-all duration-500 w-full flex flex-col h-full items-center justify-center"
            >
              <p class="transition-all duration-500 w-full px-2 pt-1 border-b-golden border border-transparent text-sm">Histórico</p>
              <div class="transition-all duration-500 w-full h-full justify-end relative overflow-y-auto py-2 px-2">
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  class="transition-all duration-500 leading-4"
                >
                  <span class="transition-all duration-500  pb-1 leading-3 text-golden pr-1">{{ message.date }}:</span>
                  <span :class="['transition-all', 'duration-500', 'pt-1', 'leading-3', 'text-sm', index === 0 ? 'underline': '']">
                    {{ message.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!hideInfo" class="transition-all duration-500 mb-3 border border-golden rounded h-20vh w-full">
            <div
              class="transition-all duration-500 w-full flex flex-col h-full items-center justify-center"
            >
              <p class="transition-all duration-500 w-full px-2 pt-1 border-b-golden border border-transparent text-sm">Status</p>
              <div class="transition-all duration-500 w-full h-full justify-end relative overflow-y-auto py-2 px-2">
                <div class="transition-all duration-500 flex w-full">
                  <div class="transition-all duration-500 w-1/2">
                    <p class="transition-all duration-500 pb-1">Jogador: {{  userLogged.displayName  }}</p>
                    <p class="transition-all duration-500 leading-5">
                      hp:
                      {{
                        userLogged.dragon.vitalidade.actual
                        + userLogged.dragon.vitalidade.bonus
                      }} / 
                      {{ userLogged.dragon.vitalidade.total }} + {{ userLogged.dragon.vitalidade.bonus }}
                    </p>
                    <p class="transition-all duration-500 leading-5">
                      velocidade:
                      {{ userLogged.dragon.velocidade.total }} + 
                      {{ userLogged.dragon.velocidade.bonus }}
                    </p>
                    <p class="transition-all duration-500 leading-5">
                      rebeldia: 
                      {{ userLogged.dragon.rebeldia.actual }} + {{ userLogged.dragon.rebeldia.bonus }}
                    </p>
                    <p
                      v-for="(attack, index) in userLogged.dragon.attacks"
                      :key="index"
                      class="transition-all duration-500 leading-5"
                    >
                      {{ attack.name }}: {{ attack.actual }} + {{ attack.bonus }}
                    </p>
                  </div>
                  <div class="transition-all duration-500 w-1/2 border-l-white border border-transparent pl-3">
                    <p class="transition-all duration-500 pb-1">Condições:</p>
                    <!-- <p class="transition-all duration-500 text-sm leading-5 pl-1">- desvantagem nas rolagens de ataque e rolagens de ataque.</p> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :class="['transition-all', 'duration-500','flex', userTurn === userLogged.email ? 'justify-between' : 'justify-end']">
            <div v-if="userTurn === userLogged.email" class="transition-all duration-500 col-span-3 w-full">
              <div class="transition-all duration-500 flex flex-col items-start w-full justify-between pl-1">
                <p class="transition-all duration-500 text-2xl leading-4 mt-1 pr-1 text-golden pb-1">
                  {{ userLogged.dragon.name }}
                  <span class="transition-all duration-500 text-base">lv 1</span>
                </p>
                <div class="transition-all duration-500 flex gap-1 items-center w-full">
                  <button
                    type="button"
                    @click="previousAttack"
                    class="transition-all duration-500 flex flex-col"
                  >
                    <FontAwesomeIcon :icon="['fas', 'caret-left']" class="transition-all duration-500 text-2xl cursor-pointer text-golden" />
                  </button>
                  <button
                    type="button"
                    :disabled="disableButton"
                    @click="attackOponent"
                    class="transition-all duration-500 p-1 px-2 cursor-pointer border-2 text-xs hover:text-black hover:font-bold border-golden bg-red-700 rounded-full text-center w-1/2 capitalize">
                    {{ userLogged.dragon.selectedAttack.name }} {{ userLogged.dragon.selectedAttack.actual }}
                </button>
                <button
                  type="button"
                  @click="nextAttack"
                  class="transition-all duration-500 flex flex-col">
                  <FontAwesomeIcon :icon="['fas', 'caret-right']" class="transition-all duration-500 text-2xl cursor-pointer text-golden" />
                </button>
                </div>
                <p class="transition-all duration-500 mt-1 text-sm w-full leading-3">
                  Ataca o inimigo com um golpe da desgraça. 
                </p>
              </div>
              <!-- <div v-else class="transition-all duration-500 flex flex-col items-start w-full h-full justify-between bg-gray-500">
              </div> -->
            </div>
            <div class="transition-all duration-500 col-span-3 flex w-full justify-end">
              <div class="transition-all duration-500 flex flex-col items-end justify-center w-full">
                <div class="transition-all duration-500 flex flex-col items-end w-full pr-1">
                  <p class="transition-all duration-500 text-right text-xs bg-green-700 px-2 rounded-full text-white w-full border-2 border-golden mb-1">
                    hp
                    {{
                      userLogged.dragon.vitalidade.actual
                      + userLogged.dragon.vitalidade.bonus
                    }} / 
                    {{ userLogged.dragon.vitalidade.total }} {{ userLogged.dragon.vitalidade  .bonus !== 0 ? '+' + userLogged.dragon.vitalidade .bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 text-right text-xs bg-blue-800 px-2 rounded-full border-2 border-golden w-8/12 text-white mb-1">
                    vel.
                    {{ userLogged.dragon.velocidade.actual }} {{ userLogged.dragon.velocidade.bonus !== 0 ? '+' + userLogged.dragon.velocidade.bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 text-right text-xs bg-red-700 px-2 rounded-full text-white border-2 w-1/2 border-golden mb-1">
                    reb.
                    {{ userLogged.dragon.rebeldia.actual }} {{ userLogged.dragon.rebeldia.bonus !== 0 ? '+' + userLogged.dragon.rebeldia.bonus : '' }}
                  </p>
                  <p v-if="userTurn === userLogged.email" class="transition-all duration-500 leading-2 text-xs pl-1">Seu Turno</p>
                </div>
              </div>
              <div :class="['relative', 'transition-all', 'duration-500', 'flex', 'justify-start', userTurn === userLogged.email ? 'w-1/2' : '']">
                <div class="transition-all duration-500 relative">
                  <button
                    type="button"
                    @click="hideInfoUser"
                    class="transition-all duration-500 h-5 w-5 object-cover rounded-full absolute z-20 top-1 right-2 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon :icon="['fas', 'info']" />
                  </button>
                  <div class="absolute top-7 right-0">
                    <div v-if="notifyMessages"
                      class="w-2 h-2 rounded-full bg-red-500 right-0 absolute"
                    >
                    </div>
                    <button
                      type="button"
                      @click="hideMessageUser"
                      class="transition-all duration-500 h-5 w-5 object-cover rounded-full border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer p-1"
                    >
                      <FontAwesomeIcon :icon="['fas', 'list']" />
                    </button>
                  </div>
                  <img
                    :src="userLogged.profileImage"
                    class="transition-all duration-500 h-10 w-10 object-cover rounded-full absolute z-20 bottom-0 right-0 bg-black border-2 border-golden"
                  />
                  <img
                    :src="userLogged.dragon.imageIconURL"
                    :class="[userTurn === userLogged.email ? 'mr-6' : 'mr-11', 'transition-all', 'duration-500', 'mb-3', 'h-20', 'w-20', 'object-cover', 'rounded-full', 'relative', 'border-4', 'border-golden']"
                  />
                </div>
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
      disableButton: true,
      damageTop: '',
      damageBottom: '',
      chatSnapShot: null,
      showData: false,
      router: router,
      matchId: router.currentRoute.value.params.battleId,
      type: '',
      winner: null,
      timeTurn: '',
      damageType: '',
      messages: [],
      userTurn: '',
      hideMessages: true,
      notifyMessages: false,
      hideInfo: true,
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
            const topDragon = document.getElementById('top-dragon');
            const bottomDragon = document.getElementById('bottom-dragon');
            bottomDragon.style.animation = 'none';
            topDragon.style.animation = 'none';
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
            let time = 1;
            if (data.actualAttack.turnAttack === auth.email) {
              setTimeout(() => {
                this.animationAttackTop(data.actualAttack.damage, data.actualAttack.type);
                time = 3000;
              }, 1000);
            } else if (data.actualAttack.turnAttack !== '') {
              setTimeout(() => {
                this.animationAttackBottom(data.actualAttack.damage, data.actualAttack.type);
                time = 3000;
              }, 1000);
            }
            setTimeout(() => {
              this.userTurn = data.userTurn;
              if (data.userTurn === auth.email) this.disableButton =false;
              this.messages = data.message.sort((a, b) => {
                let dateA = new Date(a.date.split(', ')[0].split('/').reverse().join('-') + 'T' + a.date.split(', ')[1]);
                let dateB = new Date(b.date.split(', ')[0].split('/').reverse().join('-') + 'T' + b.date.split(', ')[1]);
                return dateB - dateA;
              });
              this.notifyMessages = true;
              this.hideInfo = true;
              if (data.userTurn === 'ia') {
                setTimeout(async () => {
                  await rollIaTurn(this.matchId);
                }, time)
              }
            }, 3000);
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
    animationAttackBottom(damage, type) {
      this.damageBottom = '';
      const damageTop = document.getElementById('damage-top');
      const topDragon = document.getElementById('top-dragon');
      const bottomDragon = document.getElementById('bottom-dragon');
      bottomDragon.style.animation = 'animateAttackBottom 3s forwards';
      topDragon.style.animation = 'animateDamageTop 3s forwards';
      topDragon.style.animationDelay = '1.7s';
      damageTop.style.animation = 'animateDamageTop 3s forwards';
      damageTop.style.animationDelay = '1.7s';
      setTimeout(() => {
        this.damageTop = damage;
        this.damageType = type;
      }, 1700);

      setTimeout(() => {
        this.damageTop = '';
        damageTop.style.animation = 'none';
      }, 5000);

      setTimeout(() => {
        this.damageType = '';
      }, 2700);
    },
    animationAttackTop(damage, type) {
      this.damageTop = '';
      const damageBottom = document.getElementById('damage-bottom');
      const topDragon = document.getElementById('top-dragon');
      const bottomDragon = document.getElementById('bottom-dragon');
      bottomDragon.style.animation = 'animateDamageBottom 3s forwards';
      topDragon.style.animation = 'animateAttackTop 3s forwards';
      bottomDragon.style.animationDelay = '1.7s';
      damageBottom.style.animation = 'animateDamageBottom 3s forwards';
      damageBottom.style.animationDelay = '1.7s';
      setTimeout(() => {
        this.damageBottom = damage;
        this.damageType = type;
      }, 1700);

      setTimeout(() => {
        this.damageBottom = '';
        damageBottom.style.animation = 'none';
      }, 5000);

      setTimeout(() => {
        this.damageType = '';
      }, 2700);
    },
    hideMessageUser() {
      this.hideInfo = true;
      this.notifyMessages = false;
      this.hideMessages = !this.hideMessages;
    },
    hideInfoUser() {
      this.hideMessages = true;
      this.hideInfo = !this.hideInfo;
    },
    async endGame() {
      await endMatch(this.matchId, this.userLogged.email);
      this.$router.push('/matchs');
    },
    updateMessage() { this.message = '' },
    async attackOponent() {
      this.disableButton = true;
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
<style>
  .dragon {
    position: relative;
    transition: transform 5s ease-in-out;
  }

  @keyframes animateAttackBottom {
    0% { transform: translate(0, 0) }
    49% {
      border-color: #BE8E4A;
    }
    50% {
      transform: translate(-50px, 50px);
      border-color: red;
    }
    55% {
      transform: translate(20px, -20px);
    }
    100% { transform: translate(0, 0) }
  }

  @keyframes animateDamageTop {
    0% {
      transform: translate(0, 0);
      border-color: red;
    }
    5% { transform: translate(50px, -50px) }
    100% { transform: translate(0, 0) }
  }

  @keyframes animateAttackTop {
    0% { transform: translate(0, 0) }
    49% {
      border-color: #BE8E4A;
    }
    50% {
      transform: translate(50px, -50px);
      border-color: red;
    }
    55% {
      transform: translate(-20px, 20px);
    }
    100% { transform: translate(0, 0) }
  }

  @keyframes animateDamageBottom {
    0% {
      transform: translate(0, 0);
      border-color: red;
    }
    5% { transform: translate(-50px, 50px) }
    100% { transform: translate(0, 0) }
  }
</style>