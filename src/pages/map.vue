<template>
  <div class="h-screen flex items-center justify-center bg-wallpaper bg-cover text-white">
    <div class="grid grid-cols-16 w-80rem grid-rows-7 h-35rem relative">
      <button
        type="button"
        @click="movementDragon(dragons.find((dragon) => dragon.name === 'Caraxes'))"
        class="transition-all duration-500 flex flex-col absolute h-5rem w-5rem cursor-pointer"
        :style="computedPosition(dragons.find((dragon) => dragon.name === 'Caraxes'))"
      >
        <p v-if="dragons.find((dragon) => dragon.name === 'Caraxes').oportunity !== ''">
          Ataque de Oportunidade
        </p>
        <div class="flex items-end justify-start">
          <div class="dragon text-black relative flex">
            <img
              id="top-dragon"
              class="rounded-full border-4 border-golden object-fit"
              :src="dragons.find((dragon) => dragon.name === 'Caraxes').imageIconURL"
            />
          </div>
        </div>
      </button>
      <button
        type="button"
        @click="movementDragon(dragons.find((dragon) => dragon.name === 'Vhagar'))"
        class="transition-all duration-500 flex flex-col absolute h-5rem w-5rem cursor-pointer"
        :class="dragons.find((dragon) => dragon.name === 'Vhagar').oportunity ? 'bg-black' : ''"
        :style="computedPosition(dragons.find((dragon) => dragon.name === 'Vhagar'))"
      >
        <div class="flex items-end justify-start">
          <div class="dragon text-black relative flex">
            <img
              id="top-dragon"
              class="rounded-full border-4 border-golden object-fit"
              :src="dragons.find((dragon) => dragon.name === 'Vhagar').imageIconURL"
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
export default {
  name: 'MapPage',
  data() {
    return {
      grid: [],
      dragons: [
        {
          name: 'Caraxes',
          deslocamento: 3,
          alcance: 2,
          column: 6,
          row: 4,
          affectedSquares: [],
          oportunity: '',
          rangeSquares: [],
          imageIconURL: 'https://firebasestorage.googleapis.com/v0/b/valyrian-wars-1.appspot.com/o/images%2Fdragons%2FaAEp64nLgCM7M4l6R6yj%2FCaraxes%20(1).jpg?alt=media&token=c2bd4c57-def5-40b0-b255-acdfffaf53d1',
        },
        {
          name: 'Vhagar',
          deslocamento: 2,
          alcance: 3,
          oportunity: '',
          imageIconURL: 'https://firebasestorage.googleapis.com/v0/b/valyrian-wars-1.appspot.com/o/images%2Fdragons%2FEmDFfozqOMB9ueAftc1U%2FVhagar%20(1).jpg?alt=media&token=5fbfeb17-56d8-4551-8d7b-543868dc27b6',
          column: 11,
          row: 4,
          affectedSquares: [],
          rangeSquares: []
        }
      ],
      selectedDragon: null,
      initialPosition: { column: null, row: null }
    }
  },
  computed: {
    computedPosition() {
      return dragon => ({ top: `${dragon.row * 5 - 5}rem`, left: `${dragon.column * 5 - 5}rem` });
    },
  },
  methods: {
    movementDragon(dragon) {
      dragon.rangeSquares = [];
      if (dragon.affectedSquares.length > 0) {
        dragon.affectedSquares = [];
        dragon.rangeSquares = this.grid.filter(item => {
          const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
          return distance <= dragon.alcance;
        });
        const otherDragon = this.dragons.find(d => d !== dragon);
        this.dragons = [otherDragon, dragon];
      } else {
        this.selectedDragon = dragon;
        dragon.rangeSquares = [];
        this.initialPosition = { column: dragon.column, row: dragon.row };
        dragon.affectedSquares = this.grid.filter(item => {
          const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
          return distance <= dragon.deslocamento;
        });
        const otherDragon = this.dragons.find(d => d !== dragon);
        this.dragons = [otherDragon, dragon];
      }
    },
    getSquareClass(item) {
      return (
        (this.dragons[0].affectedSquares.includes(item) ? 'bg-golden/40' : '') ||
        (this.dragons[1].affectedSquares.includes(item) ? 'bg-golden/40' : '') ||
        (this.dragons[0].rangeSquares.includes(item) ? 'bg-black/40' : '') ||
        (this.dragons[1].rangeSquares.includes(item) ? 'bg-green-500/30' : '')
      );
    },
    squareClicked(item) {
      if (this.dragons.some(dragon => dragon.affectedSquares.includes(item) || dragon.rangeSquares.includes(item))) {
        this.moveDragonTo(item.column, item.row);
      }
    },
    moveDragonTo(column, row) {
      if (this.selectedDragon) {
        this.selectedDragon.affectedSquares = [];
        const otherDragon = this.dragons.find(d => d.name !== this.selectedDragon);

        const paths = this.calculateAllPaths(this.initialPosition.column, this.initialPosition.row, column, row, this.selectedDragon.deslocamento);
        let safePath = null;
        let oportunity = '';

        if (paths && paths.length > 0) {
          for (const path of paths) {
            const { safe, oportunity: pathOportunity } = this.isPathSafe(path, otherDragon);
            if (safe) {
              safePath = path;
              oportunity = pathOportunity;
              break;
            }
          }

          if (safePath) {
            safePath.forEach(square => {
              this.selectedDragon.affectedSquares.push(this.grid.find(item => item.column === square.column && item.row === square.row));
            });

            const finalSquare = safePath[safePath.length - 1];
            this.selectedDragon.column = finalSquare.column;
            this.selectedDragon.row = finalSquare.row;
          } else {
            paths[0].forEach(square => {
              this.selectedDragon.affectedSquares.push(this.grid.find(item => item.column === square.column && item.row === square.row));
            });

            const finalSquare = paths[0][paths[0].length - 1];
            this.selectedDragon.column = finalSquare.column;
            this.selectedDragon.row = finalSquare.row;
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

          this.dragons.forEach(dragon => {
            dragon.rangeSquares = this.grid.filter(item => {
              const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
              return distance <= dragon.alcance;
            });
          });
          this.dragons[0].affectedSquares = [];
          this.dragons[1].affectedSquares = [];
          this.selectedDragon = { oportunity: '' };
        }
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
    isPathSafe(path, otherDragon) {
      let isStartInRange = false;
      let isAnyIntermediateOutOfRange = false;
      let isEndInRange = false;

      const startSquare = path[0];
      const endSquare = path[path.length - 1];
      const startInRange = otherDragon.rangeSquares.find(square => square.column === startSquare.column && square.row === startSquare.row);
      if (startInRange) isStartInRange = true;
      const endInRange = otherDragon.rangeSquares.some(square => square.column === endSquare.column && square.row === endSquare.row);
      if (endInRange) isEndInRange = true;

      for (let i = 1; i < path.length - 1; i++) {
        const square = path[i];
        const intermediateInTheRange = otherDragon.rangeSquares.some(s => s.column === square.column && s.row === square.row);
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
  mounted() {
    let number = 1;
    for (let row = 1; row <= 7; row += 1) {
      for (let col = 1; col <= 16; col += 1) {
        this.grid.push(
          { column: col, row: row, number }
        );
        number += 1;
      }
    }
    this.grid = this.grid.sort((a, b) => a.row - b.row);

    this.dragons.forEach(dragon => {
      dragon.rangeSquares = this.grid.filter(item => {
        const distance = Math.abs(item.column - dragon.column) + Math.abs(item.row - dragon.row);
        return distance <= dragon.alcance;
      });
    });
  },
}
</script>

