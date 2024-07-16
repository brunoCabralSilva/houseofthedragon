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
        @click="movementDragon(userOponent)"
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

export default {
  name: 'MatchPage',
  components: {
    NavigationBattle,
  },
  data() {
    const router = useRouter();
    return {
      grid: [],
      selectedDragon: null,
      initialPosition: { column: 0, row: 0 },
      router: router,
      matchId: router.currentRoute.value.params.battleId,
    }
  },
  computed: {
    ...mapState(['userLogged', 'userOponent', 'type', 'winner', 'userTurn']),
  },
  methods: {
    ...mapActions(['fetchMatchData']),
    computedPosition(dragon) {
      return { top: `${dragon.row * 5 - 5}rem`, left: `${dragon.column * 5 - 5}rem` };
    },
    movementDragon(user) {
      const dragon = user.dragon;
      let rangeSquares = [];
      let affectedSquares = [];
      if (dragon.affectedSquares.length > 0) {
        affectedSquares = [];
        rangeSquares = this.grid.filter(item => {
          const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
          return distance <= dragon.alcance;
        });
        this.setMovement(user, affectedSquares, rangeSquares);
      } else {
        this.selectedDragon = dragon;
        this.initialPosition = { column: dragon.column, row: dragon.row };
        affectedSquares = this.grid.filter(item => {
          const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
          return distance <= dragon.deslocamento;
        });
        this.setMovement(user, affectedSquares, rangeSquares);
      }
    },
    getSquareClass(item) {
      return (
        (this.userLogged.dragon.affectedSquares.includes(item) ? 'bg-golden/40' : '') ||
        (this.useroponent.dragon.affectedSquares.includes(item) ? 'bg-golden/40' : '') ||
        (this.userLogged.dragon.rangeSquares.includes(item) ? 'bg-black/40' : '') ||
        (this.userOponent.rangeSquares.includes(item) ? 'bg-green-500/30' : '')
      );
    },
    // squareClicked(item) {
    //   if (this.dragons.some(dragon => dragon.affectedSquares.includes(item) || dragon.rangeSquares.includes(item))) {
    //     this.moveDragonTo(item.column, item.row);
    //   }
    // },
  },
  async created() {
    const auth = await authenticate();
    if (auth) {
      this.fetchMatchData({ matchId: this.matchId, auth });
      let number = 1;
      for (let row = 1; row <= 7; row += 1) {
        for (let col = 1; col <= 16; col += 1) {
          this.grid.push({ column: col, row: row, number });
          number += 1;
        }
      }
      this.grid = this.grid.sort((a, b) => a.row - b.row);
    } else this.router.push("/login");
  }
}
</script>
