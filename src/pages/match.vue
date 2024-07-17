<template>
  <NavigationBattle />
  <div class="h-screen flex flex-col items-center justify-center bg-wallpaper bg-cover text-white">
    <div class="w-full h-80vh flex items-start justify-center py-5">
      <div class="grid grid-cols-20 grid-rows-8 relative">
        <button
          type="button"
          @click="movementDragon(userLogged)"
          class="transition-all duration-500 flex flex-col absolute h-4rem w-4rem cursor-pointer"
          :style="computedPosition(userLogged.dragon)"
        >
          <div class="flex items-end justify-start">
            <div class="dragon text-black relative flex">
              <img
                id="top-dragon"
                class="rounded-full border-4 border-golden object-fit"
                :src="userLogged.dragon.imageIconURL"
              />
            </div>
          </div>
        </button>
        <button
          type="button"
          class="transition-all duration-500 flex flex-col absolute h-4rem w-4rem cursor-pointer"
          :style="computedPosition(userOponent.dragon)"
        >
          <div class="flex items-end justify-start">
            <div class="dragon text-black relative flex">
              <img
                id="top-dragon"
                class="rounded-full border-4 border-golden object-fit"
                :src="userOponent.dragon.imageIconURL"
              />
            </div>
          </div>
        </button>
        <div
          v-for="(item, index) in grid"
          :key="index"
          :id="item.number"
          :column="item.column"
          :row="item.row"
          :class="getSquareClass(item)"
          @click="squareClicked(item)"
          class="h-4rem w-4rem border border-white/10 hover:border-white transition-colors duration-300 cursor-pointer text-sm"
        >
        </div>
      </div>
    </div>
    <div class="w-full h-20vh bg-black/80 rounded-t-xl mt-1 z-20">
      <div class="transition-all duration-500 flex h-full px-2 w-full">
        <div class="transition-all duration-500 w-full h-full grid grid-cols-4">
          <div class="col-span-1 relative transition-all duration-500 flex items-center h-full w-full">
            <div class="transition-all duration-500 relative w-40">
              <button
                type="button"
                @click="hideInfoUser"
                class="transition-all duration-500 h-5 w-5 object-cover rounded-full absolute z-20 top-1 left-2 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer"
              >
                <FontAwesomeIcon :icon="['fas', 'info']" />
              </button>
              <div class="absolute top-7 left-0 z-20">
                <div v-if="notifyMessages"
                  class="w-2 h-2 rounded-full bg-red-500"
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
                class="transition-all duration-500 h-10 w-10 object-cover rounded-full absolute z-20 bottom-0 left-0 bg-black border-2 border-golden"
              />
              <img
                :src="userLogged.dragon.imageIconURL"
                :class="['ml-6', 'transition-all', 'duration-500', 'mb-3', 'h-20', 'w-20', 'object-cover', 'rounded-full', 'relative', 'border-4', 'border-golden']"
              />
            </div>
            <div class="transition-all duration-500 col-span-3 flex w-full mr-2 ml-1">
              <div class="transition-all duration-500 flex flex-col items-start justify-center w-full">
                <div class="transition-all duration-500 flex flex-col items-start w-full pr-1">
                  <p class="transition-all duration-500 text-xs bg-green-700 px-2 rounded-full text-white w-full border-2 border-golden mb-1">
                    hp
                    {{
                      userLogged.dragon.vitalidade.actual
                      + userLogged.dragon.vitalidade.bonus
                    }} / 
                    {{ userLogged.dragon.vitalidade.total }} {{ userLogged.dragon.vitalidade  .bonus !== 0 ? '+' + userLogged.dragon.vitalidade .bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 text-xs bg-blue-800 px-2 rounded-full border-2 border-golden w-8/12 text-white mb-1">
                    vel.
                    {{ userLogged.dragon.velocidade.actual }} {{ userLogged.dragon.velocidade.bonus !== 0 ? '+' + userLogged.dragon.velocidade.bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 text-xs bg-red-700 px-2 rounded-full text-white border-2 w-1/2 border-golden mb-1">
                    reb.
                    {{ userLogged.dragon.rebeldia.actual }} {{ userLogged.dragon.rebeldia.bonus !== 0 ? '+' + userLogged.dragon.rebeldia.bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 leading-2 text-xs pl-1">Seu Turno ({{userLogged.dragon.actions.position === 'ground' ? 'Em Terra' : 'Voando'}})</p>
                </div>
              </div>
              
            </div>
          </div>
          
          <div class="col-span-2 grid grid-cols-2 w-full">
            <div class="col-span-2 w-full h-full flex flex-col items-center justify-center gap-2 p-1">
              <div class="flex w-full justify-center items-center gap-2">
                <div
                  @mouseover="setTooltip('Dracarys')"
                  @mouseout="setTooltip('')"
                  class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
                >
                  <img
                    src="@/assets/icons/dracarys.png"
                    class="transition-all duration-500 h-8 w-8 object-cover"
                  />
                  <div
                    v-if="tooltip === 'Dracarys'"
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">Dracarys - Ação Padrão</p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Ataca o oponente com uma torrente de chamas ardentes, expelindo um poderoso jato de fogo de suas mandíbulas.</p>
                      <p class="w-full pt-1">Ataque: {{ this.userLogged.dragon.actions.dracarys.actual }} - De {{(1 + this.userLogged.dragon.actions.dracarys.actual) * 2}} a {{ (12 + this.userLogged.dragon.actions.dracarys.actual) * 2 }} de dano</p>
                      <p class="w-full">Alcance: {{ Math.ceil(this.userLogged.dragon.alcance.actual / 2) }}</p>
                      <p class="pt-1"></p>
                    </div>
                  </div>
                </div>
                <div
                  @mouseover="setTooltip('Mordida')"
                  @mouseout="setTooltip('')"
                  class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
                >
                  <img
                    src="@/assets/icons/mordida.png"
                    class="transition-all duration-500 h-8 w-8 object-cover"
                  />
                  <div
                    v-if="tooltip === 'Mordida'"
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">Mordida - Ação Padrão</p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Ataca o oponente com uma mordida feroz, cravando suas afiadas presas na carne inimiga e causando danos devastadores.</p>
                      <p class="w-full pt-1">Ataque: {{ this.userLogged.dragon.actions.mordida.actual }} - De {{(1 + this.userLogged.dragon.actions.mordida.actual) * 2}} a {{ (12 + this.userLogged.dragon.actions.mordida.actual) * 2 }} de dano</p>
                      <p class="w-full">Alcance: {{ this.userLogged.dragon.alcance.actual }}</p>
                      <p class="pt-1"></p>
                    </div>
                  </div>
                </div>
                <div
                  @mouseover="setTooltip('Garras')"
                  @mouseout="setTooltip('')"
                  class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
                >
                  <img
                    src="@/assets/icons/garras.png"
                    class="transition-all duration-500 h-8 w-8 object-cover"
                  />
                  <div
                    v-if="tooltip === 'Garras'"
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">Garras - Ação Padrão</p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Ataca o oponente com suas garras afiadas, desferindo golpes rápidos e precisos.</p>
                      <p class="w-full pt-1">Ataque: {{ this.userLogged.dragon.actions.garras.actual }} - De {{(1 + this.userLogged.dragon.actions.garras.actual) * 2}} a {{ (12 + this.userLogged.dragon.actions.garras.actual) * 2 }} de dano</p>
                      <p class="w-full">Alcance: {{ this.userLogged.dragon.alcance.actual }}</p>
                      <p class="pt-1"></p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
                  1
                </div>
                <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
                  2
                </div>
              </div>
              <div class="flex w-full justify-center items-center gap-2">
                <div
                  @mouseout="setTooltip('')"
                  @mouseover="setTooltip(this.userLogged.dragon.actions.position === 'ground' ? 'Caçar': 'Derrubar')"
                  class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
                >
                  <img
                    :src="this.userLogged.dragon.actions.position === 'ground'
                        ? require('@/assets/icons/sheep.png')
                        : require('@/assets/icons/derrubar.png')"
                    class="transition-all duration-500 h-8 w-8 object-cover"
                    :class="this.userLogged.dragon.actions.hunt === 0 ? 'opacity-1' : 'opacity-40'"
                  />
                  <div
                    v-if="tooltip === 'Caçar'"  
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">                        
                        Caçar - Ação Bônus e de Movimento
                      </p>
                      <hr />
                      <p class="w-full pt-1 leading-4">O dragão avista uma ovelha, avança rapidamente e a devora com voracidade, recuperando {{ Math.ceil(Math.ceil(this.userLogged.dragon.vitalidade.total / 5) / 10) }}d10 pontos de vida. Esta ação só pode ser realizada uma vez durante o combate.</p>
                    </div>
                  </div>
                  <div
                    v-if="tooltip === 'Derrubar'"  
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">                        
                        Derrubar - Ação Bônus e de Movimento
                      </p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Ambos os Dragões precisam estar Voando para que esta ação seja possível, além de que é necessário estar fora do alcance do Oponente. Executando esta ação, o alvo é derrubado dos céus ao chão, precisando ter sucesso em um teste de Vitalidade para que não fique Atordoado.</p>
                    </div>
                  </div>
                </div>
                <div
                  @mouseover="setTooltip(this.userLogged.dragon.actions.position === 'ground' ? 'Voar': 'Aterrisar')"
                  @mouseout="setTooltip('')"
                  class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
                >
                  <img
                    :src="this.userLogged.dragon.actions.position === 'ground'
                      ? require('@/assets/icons/voar.png')
                      : require('@/assets/icons/aterrisar.png')"
                    class="transition-all duration-500 h-8 w-8 object-cover"
                  />
                  <div
                    v-if="tooltip === 'Voar'"
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">Voar - Ação De Movimento</p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Com um poderoso bater de asas, o dragão se ergue do solo e alça voo aos céus. Concede Ataque de Oportunidade caso as circunstâncias permitam.</p>
                    </div>
                  </div>
                  <div
                    v-if="tooltip === 'Aterrisar'"
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">Aterrisar - Ação De Movimento</p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Com um último bater de asas, o dragão toca o chão suavemente, pronto para enfrentar qualquer desafio em solo que o aguarde. Concede Ataque de Oportunidade caso as circunstâncias permitam.</p>
                    </div>
                  </div>
                </div>
                <div
                  @mouseout="setTooltip('')"
                  @mouseover="setTooltip('Mover')"
                  @click="movementDragon(userLogged)"
                  class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
                >
                  <img
                    src="@/assets/icons/move.png"
                    class="transition-all duration-500 h-8 w-8 object-cover"
                  />
                  <div
                    v-if="tooltip === 'Mover'"  
                    class="fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col items-center justify-center"
                  >
                    <div class="bg-black/80 w-1/3 rounded p-1 px-2 h-full">
                      <p class="w-full pb-1">Deslocar-se - Ação De Movimento</p>
                      <hr />
                      <p class="w-full pt-1 leading-4">Permite que o Dragão se mova baseado no seu valor de deslocamento e também pode ser feito clicando diretamente no ícone do Dragão. Pode gerar Ataque de Oportunidade caso esteja saindo da área de alcance do oponente.</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
                  3
                </div>
                <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
                  4
                </div>
              </div>

              <!-- Voar
              Caçar
              Dracarys
              Mordida
              Garras
              Skill1
              Skill2
              Mover -->
            </div>
          </div>
          
          <div class="col-span-1 relative transition-all duration-500 flex justify-start items-center h-full w-full">
            <div class="transition-all duration-500 col-span-3 flex w-full mr-2 ml-1">
              <div class="transition-all duration-500 flex flex-col items-end justify-center w-full">
                <div class="transition-all duration-500 flex flex-col items-end w-full">
                  <p class="transition-all duration-500 text-right text-xs bg-green-700 px-2 rounded-full text-white w-full border-2 border-golden mb-1">
                    hp
                    {{
                      userOponent.dragon.vitalidade.actual
                      + userOponent.dragon.vitalidade.bonus
                    }} / 
                    {{ userOponent.dragon.vitalidade.total }} {{ userOponent.dragon.vitalidade  .bonus !== 0 ? '+' + userOponent.dragon.vitalidade .bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 text-right text-xs bg-blue-800 px-2 rounded-full border-2 border-golden w-8/12 text-white mb-1">
                    vel.
                    {{ userOponent.dragon.velocidade.actual }} {{ userOponent.dragon.velocidade.bonus !== 0 ? '+' + userOponent.dragon.velocidade.bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 text-right text-xs bg-red-700 px-2 rounded-full text-white border-2 w-1/2 border-golden mb-1">
                    reb.
                    {{ userOponent.dragon.rebeldia.actual }} {{ userOponent.dragon.rebeldia.bonus !== 0 ? '+' + userOponent.dragon.rebeldia.bonus : '' }}
                  </p>
                  <p class="transition-all duration-500 leading-2 text-sm pl-1">Seu oponente: {{ userOponent.dragon.name }}</p>
                </div>
              </div>
              
            </div>
            <div class="transition-all duration-500 relative w-40">
              <button
                type="button"
                @click="hideInfoUser"
                class="transition-all duration-500 h-5 w-5 object-cover rounded-full absolute z-20 top-1 right-2 border-2 border-golden text-golden flex items-center justify-center text-xs cursor-pointer"
              >
                <FontAwesomeIcon :icon="['fas', 'info']" />
              </button>
              <img
                :src="userOponent.profileImage"
                class="transition-all duration-500 h-10 w-10 object-cover rounded-full absolute z-20 bottom-0 right-0 bg-black border-2 border-golden"
              />
              <img
                :src="userOponent.dragon.imageIconURL"
                :class="['mr-6', 'transition-all', 'duration-500', 'mb-3', 'h-20', 'w-20', 'object-cover', 'rounded-full', 'relative', 'border-4', 'border-golden']"
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { authenticate } from '@/firebase/authenticate';
import { useRouter } from 'vue-router';
import NavigationBattle from '@/components/navigationBattle.vue';
import { updateDragonPosition } from '@/firebase/battle';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faInfo, faCaretUp, faCaretDown, faCaretRight, faCaretLeft, faCircleXmark, faList } from '@fortawesome/free-solid-svg-icons';
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
    NavigationBattle,
    FontAwesomeIcon
  },
  data() {
    const router = useRouter();
    return {
      tooltip: '',
      grid: [],
      email: '',
      rangeSquaresLogged: [],
      affectedSquaresLogged: [],
      rangeSquaresOponent: [],
      affectedSquaresOponent: [],
      initialPosition: { column: 0, row: 0 },
      router: router,
      matchId: router.currentRoute.value.params.battleId,
    }
  },
  async created() {
    const auth = await authenticate();
    if (auth) {
      this.email = auth.email;
      this.fetchMatchData({ matchId: this.matchId, auth });
      let number = 1;
      for (let row = 1; row <= 7; row += 1) {
        for (let col = 1; col <= 20; col += 1) {
          this.grid.push({ column: col, row: row, number });
          number += 1;
        }
      }
      this.grid = this.grid.sort((a, b) => a.row - b.row);
      const updateRanges = this.updateRangedSquare();
      this.rangeSquaresLogged = updateRanges.rangeSquaresLogged
      this.rangeSquaresOponent = updateRanges.rangeSquaresOponent;
    } else this.router.push("/login");
  },
  computed: {
    ...mapState(['userLogged', 'userOponent', 'type', 'winner', 'userTurn']),
    squareClasses() {
      return (item) => {
        const isUserLoggedAffected = this.affectedSquaresLogged.includes(item);
        const isUserOponentAffected = this.affectedSquaresOponent.includes(item);
        const isUserLoggedRange = this.rangeSquaresLogged.includes(item);
        const isUserOponentRange = this.rangeSquaresOponent.includes(item);

        return {
          'bg-golden/40': isUserLoggedAffected || isUserOponentAffected,
          'bg-black/40': isUserLoggedRange,
          'bg-green-500/30': isUserOponentRange,
          'border': true,
          'border-white/10': true,
          'hover:border-white': true,
          'transition-colors': true,
          'duration-300': true,
          'cursor-pointer': true,
          'text-sm': true,
        };
      };
    },
  },
  methods: {
    ...mapActions(['fetchMatchData']),
    setTooltip(item) {
      this.tooltip = item;
    },
    updateRangedSquare() {
      const rangeSquaresLogged = this.grid.filter(item => {
        const distance = Math.abs(item.column - this.userLogged.dragon.column) + Math.abs(item.row - this.userLogged.dragon.row);
        return distance <= this.userLogged.dragon.alcance.actual;
      });
      const rangeSquaresOponent = this.grid.filter(item => {
        const distance = Math.abs(item.column - this.userOponent.dragon.column) + Math.abs(item.row - this.userOponent.dragon.row);
        return distance <= this.userOponent.dragon.alcance.actual;
      });
      return {rangeSquaresLogged, rangeSquaresOponent };
    },
    computedPosition(dragon) {
      return { top: `${dragon.row * 4 - 4}rem`, left: `${dragon.column * 4 - 4}rem` };
    },
    movementDragon(userLogged) {
      const dragon = userLogged.dragon;
      if (this.affectedSquaresLogged.length > 0) {
        this.affectedSquaresLogged = [];
        this.rangeSquaresLogged = this.grid.filter(item => {
          const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
          return distance <= dragon.alcance.actual;
        });
      } else {
        this.rangeSquaresLogged = [];
        this.initialPosition = { column: dragon.column, row: dragon.row };
        this.affectedSquaresLogged = this.grid.filter(item => {
          const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
          return distance <= dragon.deslocamento.actual;
        });
      }
    },
    getSquareClass(item) {
      const updateRanges = this.updateRangedSquare();
      return (
        (this.affectedSquaresLogged.includes(item) ? 'bg-golden/40' : '') ||
        (this.affectedSquaresOponent.includes(item) ? 'bg-golden/40' : '') ||
        (updateRanges.rangeSquaresLogged.includes(item) ? 'bg-black/40' : '') ||
        (updateRanges.rangeSquaresOponent.includes(item) ? 'bg-green-500/30' : '')
      );
    },
    squareClicked(item) {
      if (this.affectedSquaresLogged.includes(item)) this.moveDragonTo(item.column, item.row);
    },
    async moveDragonTo(column, row) {
      this.affectedSquaresLogged = [];
      const paths = this.calculateAllPaths(this.initialPosition.column, this.initialPosition.row, column, row, this.userLogged.dragon.deslocamento.actual);
      let safePath = null;
      let oportunity = '';
      if (paths && paths.length > 0) {
        for (const path of paths) {
          const { safe, oportunity: pathOportunity } = this.isPathSafe(path);
          if (safe) {
            safePath = path;
            oportunity = pathOportunity;
            break;
          }
        }

        if (safePath) {
          safePath.forEach(square => {
            this.affectedSquaresLogged.push(this.grid.find(item => item.column === square.column && item.row === square.row));
          });
          const finalSquare = safePath[safePath.length - 1];
          await updateDragonPosition(this.matchId, this.email, finalSquare.column, finalSquare.row);
        } else {
          paths[0].forEach(square => {
            this.affectedSquaresLogged.push(this.grid.find(item => item.column === square.column && item.row === square.row));
          });

          const finalSquare = paths[0][paths[0].length - 1];
          await updateDragonPosition(this.matchId, this.email, finalSquare.column, finalSquare.row);
          oportunity = 'Ataque de Oportunidade';
        }

        if (oportunity) {
          this.selectedDragon.oportunity = 'Ataque de Oportunidade';
          const selectedDragonName = this.selectedDragon.name;
          setTimeout(() => {
            const another = this.dragons.find((dragon) => selectedDragonName !== dragon.name);
            const same = this.dragons.find((dragon) => selectedDragonName === dragon.name);
            same.oportunity = '';
            this.dragons = [another, same];
          }, 3000);
        }
        const updateRanges = this.updateRangedSquare();
        this.rangeSquaresLogged = updateRanges.rangeSquaresLogged
        this.rangeSquaresOponent = updateRanges.rangeSquaresOponent;
        this.affectedSquaresLogged = [];
        this.affectedSquaresOponent = [];
      }
    },
    calculateAllPaths(startColumn, startRow, endColumn, endRow, deslocamento) {
      const paths = [];
      const queue = [{ column: startColumn, row: startRow, path: [] }];
      while (queue.length > 0) {
        const { column, row, path } = queue.shift();
        if (path.length > deslocamento) continue;
        if (column === endColumn && row === endRow) {
          paths.push([...path, { column, row }]);
          continue;
        }
        const directions = [
          { column: column + 1, row },
          { column: column - 1, row },
          { column, row: row + 1 },
          { column, row: row - 1 },
        ];

        for (const direction of directions) {
          if (direction.column > 0 && direction.column <= 20 && direction.row > 0 && direction.row <= 7) {
            queue.push({ ...direction, path: [...path, { column, row }] });
          }
        }
      }
      return paths;
    },
    isPathSafe(path) {
      let isStartInRange = false;
      let isAnyIntermediateOutOfRange = false;
      let isEndInRange = false;
      const startSquare = path[0];
      const endSquare = path[path.length - 1];
      const startInRange = this.rangeSquaresOponent.find(square => square.column === startSquare.column && square.row === startSquare.row);
      if (startInRange) isStartInRange = true;
      const endInRange = this.rangeSquaresOponent.some(square => square.column === endSquare.column && square.row === endSquare.row);
      if (endInRange) isEndInRange = true;
      for (let i = 1; i < path.length - 1; i++) {
        const square = path[i];
        const intermediateInTheRange = this.rangeSquaresOponent.some(s => s.column === square.column && s.row === square.row);
        if (intermediateInTheRange) isAnyIntermediateOutOfRange = true;
      }
      if (isStartInRange && isEndInRange) return { safe: true, oportunity: '' };
      else if (!isStartInRange && !isEndInRange && isAnyIntermediateOutOfRange) return { safe: false, oportunity: 'Ataque de Oportunidade' }; 
      else if (!isStartInRange && !isEndInRange) return { safe: true, oportunity: '' }; 
      else if (!isStartInRange && isEndInRange) return { safe: true, oportunity: '' }; 
      else if (isStartInRange && !isEndInRange) return { safe: false, oportunity: 'Ataque de Oportunidade' };
      else return { safe: false, oportunity: 'Ataque de Oportunidade' };
    }
  },
}
</script>


<!-- <div class="col-span-1 w-4/5">
  <div v-if="!hideMessages" class="transition-all duration-500 border border-golden w-full rounded ">
    <div
      class="transition-all duration-500 w-full flex flex-col h-full items-center justify-center"
    >
      <p class="transition-all duration-500 w-full px-2 pt-1 border-b-golden border border-transparent text-sm">Histórico</p>
      <div class="transition-all duration-500 w-full justify-end relative overflow-y-auto h-14vh py-2 px-2">
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
  <div v-if="hideInfo" class="transition-all duration-500 border border-golden rounded w-full">
    <div
      class="transition-all duration-500 w-full flex flex-col h-full items-center justify-center relative"
    >
      <p class="transition-all duration-500 w-full px-2 pt-1 border-b-golden border border-transparent text-sm">Status</p>
      <div class="transition-all duration-500 w-full justify-end relative overflow-y-auto h-15vh py-2 px-2">
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
             <p class="transition-all duration-500 text-sm leading-5 pl-1">- desvantagem nas rolagens de ataque e rolagens de ataque.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> -->