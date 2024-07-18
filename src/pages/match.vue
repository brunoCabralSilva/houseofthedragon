<template>
  <NavigationBattle />
  <div class="h-screen flex flex-col items-center justify-center bg-wallpaper bg-cover text-white">
    <div class="w-full h-80vh flex items-start justify-center py-5">
      <div class="grid grid-cols-20 grid-rows-8 relative">
        <!-- Ícone do Usuário Logado -->
        <button
          type="button"
          :disabled="userTurn !== userLogged.email || verifyAction('movement')"
          @click="setMovementDragon"
          class="transition-all duration-500 flex flex-col absolute cursor-pointer"
          :style="computedPosition(userLogged.dragon)"
        >
          <div
            class="flex items-end justify-start transition-all duration-500"
            :class="userLogged.dragon.actions.position === 'fly' ? '-mt-4': '-mt-0'"
          >
            <div class="dragon text-black relative flex flex-col">
              <img
                id="top-dragon"
                class="rounded-full border-4 object-fit h-4rem w-4rem mb-2 transition-all duration-500"
                :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
                :src="userLogged.dragon.imageIconURL"
              />
              <img
                v-if="userLogged.dragon.actions.position === 'fly'"
                id="top-dragon"
                class="w-4rem -mt-1"
                src="@/assets/icons/shadow.png"
              />
            </div>
          </div>
        </button>
        <!-- Ícone do Oponente -->
        <button
          type="button"
          class="transition-all duration-500 flex flex-col absolute"
          :style="computedPosition(userOponent.dragon)"
        >
          <div
            class="flex items-end justify-start transition-all duration-500"
            :class="userOponent.dragon.actions.position === 'fly' ? '-mt-4': '-mt-0'"
          >
            <div class="dragon text-black relative flex flex-col">
              <img
                id="top-dragon"
                class="rounded-full border-4 object-fit h-4rem w-4rem mb-2"
                :class="userOponent.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
                :src="userOponent.dragon.imageIconURL"
              />
              <img
                v-if="userOponent.dragon.actions.position === 'fly'"
                id="top-dragon"
                class="w-4rem -mt-1"
                src="@/assets/icons/shadow.png"
              />
            </div>
          </div>
        </button>
        <!-- Criação de Grid -->
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
        <div
          v-if="tooltip.show"
          class="z-20 fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col justify-center"
          :class="!hideMessages || !hideInfo ? 'items-end': 'items-center'"
        >
          <div class="bg-black/80 w-1/3 rounded px-2 h-full p-2">
            <p class="w-full pb-1">{{ tooltip.title }}</p>
            <hr />
            <p class="w-full pt-1 leading-4">{{ tooltip.description }}</p>
            <p v-if="tooltip.ataque !== ''" class="w-full pt-1 leading-4">
              {{ tooltip.ataque }}
            </p>
            <p v-if="tooltip.alcance !== ''" class="w-full pt-1 leading-4">
              {{ tooltip.alcance }}
            </p>
          </div>
        </div>
        <div class="transition-all duration-500 w-full h-full grid grid-cols-4">
          <DataUserLogged />
          <UserActions />
          <DataUserOponent />
          <MessageInfo />
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
import DataUserLogged from '@/components/dataUserLogged.vue';
import DataUserOponent from '@/components/dataUserOponent.vue';
import UserActions from '@/components/userActions.vue';
import MessageInfo from '@/components/messageInfo.vue';
import { updateDragonPosition, updateRangedSquare, verifyActions } from '@/firebase/battle';

export default {
  name: 'MatchPage',
  components: {
    MessageInfo,
    UserActions,
    DataUserLogged,
    NavigationBattle,
    DataUserOponent,
  },
  data() {
    const router = useRouter();
    return {
      email: '',
      router: router,
      disabledHunt: false,
      matchId: router.currentRoute.value.params.battleId,
    }
  },
  async created() {
    const auth = await authenticate();
    if (auth) {
      this.email = auth.email;
      this.fetchMatchData({ matchId: this.matchId, auth });
      let number = 1;
      const gridMount = [];
      for (let row = 1; row <= 7; row += 1) {
        for (let col = 1; col <= 20; col += 1) {
          gridMount.push({ column: col, row: row, number });
          number += 1;
        }
      }
      this.updateGrid(gridMount.sort((a, b) => a.row - b.row));
      const updateRanges = updateRangedSquare(gridMount, this.userLogged, this.userOponent);
      this.updateRangeSquaresLogged(updateRanges.rangeSquaresLogged);
      this.updateRangeSquaresOponent(updateRanges.rangeSquaresOponent);
      if (this.userLogged.dragon.hunt !== 0) this.disabledHunt = true;
    } else this.router.push("/login");
  },
  computed: {
    ...mapState(['userLogged', 'userOponent', 'type', 'winner', 'userTurn', 'messages', 'hideMessages', 'hideInfo', 'grid', 'rangeSquaresLogged', 'rangeSquaresOponent', 'affectedSquaresLogged', 'affectedSquaresOponent', 'initialPosition', 'tooltip']),
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
    ...mapActions(['fetchMatchData', 'setMovementDragon', 'updateGrid', 'updateAffectedSquaresLogged', 'updateAffectedSquaresOponent', 'updateRangeSquaresLogged', 'updateRangeSquaresOponent']),
    verifyAction(type) { return verifyActions(type, this.userLogged) },
    computedPosition(dragon) {
      return { top: `${dragon.row * 4 - 4}rem`, left: `${dragon.column * 4 - 4}rem` };
    },
    getSquareClass(item) {
      const updateRanges = updateRangedSquare(this.grid, this.userLogged, this.userOponent);
      const affectedSquares = JSON.stringify(this.affectedSquaresLogged);
        const affectedSquaresOponent = JSON.stringify(this.affectedSquaresOponent);
      const itemU = JSON.stringify(item);
      return (
        (affectedSquares.includes(itemU)
          ? this.userLogged.dragon.actions.position === 'fly'
            ? 'bg-blue-300/40'
            : 'bg-golden/40' : '') ||
        (affectedSquaresOponent.includes(itemU)
          ? this.userOponent.dragon.actions.position === 'fly'
            ? 'bg-blue-300/40'
            : 'bg-golden/40' : '') ||
        (updateRanges.rangeSquaresLogged.includes(item) ? 'bg-black/40' : '') ||
        (updateRanges.rangeSquaresOponent.includes(item) ? 'bg-green-500/30' : '')
      );
    },
    squareClicked(item) {
      if (this.affectedSquaresLogged.includes(item)) this.moveDragonTo(item.column, item.row);
    },
    async moveDragonTo(column, row) {
      this.updateAffectedSquaresLogged([]);
      const paths = this.calculateAllPaths(this.initialPosition.column, this.initialPosition.row, column, row, this.userLogged.dragon.deslocamento.actual);
      let safePath = null;
      let oportunity = '';
      if (paths && paths.length > 0) {
        for (const path of paths) {
          const { oportunity: pathOportunity } = this.isPathSafe(path);
          safePath = path;
          oportunity = pathOportunity;
          break;
        }
        if (safePath) {
          const affectedList = [];
          safePath.forEach(square => {
            affectedList.push(this.grid.find(item => item.column === square.column && item.row === square.row));
          });
          this.updateAffectedSquaresLogged(affectedList);
          const finalSquare = safePath[safePath.length - 1];
          await updateDragonPosition(this.matchId, this.email, finalSquare.column, finalSquare.row, oportunity);
        } else {
          const affectedList = [];
          paths[0].forEach(square => {
            affectedList.push(this.grid.find(item => item.column === square.column && item.row === square.row));
          });
          this.updateAffectedSquaresLogged(affectedList);
          const finalSquare = paths[0][paths[0].length - 1];
          await updateDragonPosition(this.matchId, this.email, finalSquare.column, finalSquare.row, oportunity);
        }
        const updateRanges = updateRangedSquare(this.grid, this.userLogged, this.userOponent);
        this.updateAffectedSquaresLogged([]);
        this.updateAffectedSquaresOponent([]);
        this.updateRangeSquaresLogged(updateRanges.rangeSquaresLogged);
        this.updateRangeSquaresOponent(updateRanges.rangeSquaresOponent);
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
      if (this.userLogged.actions.position === this.userOponent.actions.position) {
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
      } else return { safe: false, oportunity: '' };
    }
  },
}
</script>