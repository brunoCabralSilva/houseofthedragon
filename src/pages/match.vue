<template>
  <NavigationBattle />
  <div class="h-screen flex items-center justify-center bg-wallpaper bg-cover text-white">
    <div class="grid grid-cols-16 w-80rem grid-rows-7 h-35rem relative">
      <button
        type="button"
        @click="movementDragon(userLogged)"
        class="transition-all duration-500 flex flex-col absolute h-5rem w-5rem cursor-pointer"
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
        class="transition-all duration-500 flex flex-col absolute h-5rem w-5rem cursor-pointer"
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
        class="h-5rem w-5rem border border-white/10 hover:border-white transition-colors duration-300 cursor-pointer text-sm"
      >
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

export default {
  name: 'MatchPage',
  components: {
    NavigationBattle,
  },
  data() {
    const router = useRouter();
    return {
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
        for (let col = 1; col <= 16; col += 1) {
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
      return { top: `${dragon.row * 5 - 5}rem`, left: `${dragon.column * 5 - 5}rem` };
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
      console.log(paths);
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
          if (direction.column > 0 && direction.column <= 16 && direction.row > 0 && direction.row <= 7) {
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
