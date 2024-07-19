<template>
  <div class="col-span-1 relative transition-all duration-500 flex justify-start items-center h-full w-full">
    <div class="transition-all duration-500 col-span-3 flex w-full mr-2 ml-1">
      <div class="transition-all duration-500 flex flex-col items-end justify-center w-full">
        <div class="transition-all duration-500 flex flex-col items-end w-full">
          <div
            class="transition-all duration-500 text-right text-xs rounded-full text-white w-full border-2 mb-1"
            :class="this.userOponent.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
          >
            <div class="relative flex">
              <p
                class="transition-all duration-500 text-right text-xs px-2 rounded-full text-white w-full absolute z-10"
              >
                hp
                {{
                  userOponent.dragon.vitalidade.actual
                  + userOponent.dragon.vitalidade.bonus
                }} / 
                {{ userOponent.dragon.vitalidade.total }} {{ userOponent.dragon.vitalidade  .bonus !== 0 ? '+' + userOponent.dragon.vitalidade .bonus : '' }}
              </p>
              <div :class="[percentage() >= 12 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4', 'rounded-l-full']"></div>
              <div :class="[percentage() >= 11 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 10 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 9 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 8 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 7 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 6 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 5 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 4 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 3 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 2 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4']"></div>
              <div :class="[percentage() >= 1 ? 'bg-green-700': 'bg-transparent', 'w-1/12', 'h-4', 'rounded-r-full']"></div>
            </div>
          </div>
          <p
            class="transition-all duration-500 text-right text-xs bg-blue-800 px-2 rounded-full border-2 w-8/12 text-white mb-1"
            :class="this.userOponent.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
          >
            vel.
            {{ userOponent.dragon.velocidade.actual }} {{ userOponent.dragon.velocidade.bonus !== 0 ? '+' + userOponent.dragon.velocidade.bonus : '' }}
          </p>
          <p
            class="transition-all duration-500 text-right text-xs bg-red-700 px-2 rounded-full text-white border-2 w-1/2 mb-1"
            :class="this.userOponent.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
          >
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
        class="transition-all duration-500 h-5 w-5 object-cover rounded-full absolute z-20 top-1 right-2 border-2 flex items-center justify-center text-xs cursor-pointer"
        :class="this.userOponent.dragon.actions.position === 'fly' ? 'border-blue-300 text-blue-300' : 'border-golden text-golden'"
      >
        <FontAwesomeIcon :icon="['fas', 'info']" />
      </button>
      <img
        :src="userOponent.profileImage"
        class="transition-all duration-500 h-10 w-10 object-cover rounded-full absolute z-20 bottom-0 right-0 bg-black border-2"
        :class="this.userOponent.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
      />
      <img
        :src="userOponent.dragon.imageIconURL"
        :class="['mr-6', 'transition-all', 'duration-500', 'mb-3', 'h-20', 'w-20', 'object-cover', 'rounded-full', 'relative', 'border-4', this.userOponent.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden']"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
library.add(faInfo);

export default {
  name: 'DataUserOponent',
  components: { FontAwesomeIcon },
  computed: {
    ...mapState(['userOponent']),
  },
  methods: {
    percentage() {
      const currentHP = this.userOponent.dragon.vitalidade.actual;
      const totalHP = this.userOponent.dragon.vitalidade.total;
      return Math.floor((currentHP / totalHP) * 12);
    }
  }
}
</script>
