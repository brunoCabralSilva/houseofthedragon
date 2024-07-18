<template>
  <div class="col-span-1 relative transition-all duration-500 flex items-center h-full w-full">
    <div class="transition-all duration-500 relative w-40">
      <button
        type="button"
        @click="hideInfoFromUser"
        class="transition-all duration-500 h-5 w-5 object-cover rounded-full absolute z-20 top-1 left-2 border-2 flex items-center justify-center text-xs cursor-pointer"
        :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300 text-blue-300' : 'text-golden border-golden'"
      >
        <FontAwesomeIcon :icon="['fas', 'info']" />
      </button>
      <div class="absolute top-7 left-0 z-20">
        <div v-if="notifyMessages"
          class="w-2 h-2 rounded-full bg-red-500">
        </div>
        <button
          type="button"
          @click="hideMessagesFromUser"
          class="transition-all duration-500 h-5 w-5 object-cover rounded-full border-2 flex items-center justify-center text-xs cursor-pointer p-1"
          :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300 text-blue-300' : 'text-golden border-golden'"
        >
          <FontAwesomeIcon :icon="['fas', 'list']" />
        </button>
      </div>
      <img
        :src="userLogged.profileImage"
        class="transition-all duration-500 h-10 w-10 object-cover rounded-full absolute z-20 bottom-0 left-0 bg-black border-2"
        :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
      />
      <img
        :src="userLogged.dragon.imageIconURL"
        class="ml-6 transition-all duration-500 mb-3 h-20 w-20 object-cover rounded-full relative border-4"
        :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
      />
    </div>
    <div class="transition-all duration-500 col-span-3 flex w-full mr-2 ml-1">
      <div class="transition-all duration-500 flex flex-col items-start justify-center w-full">
        <div class="transition-all duration-500 flex flex-col items-start w-full pr-1">
          <p
            class="transition-all duration-500 text-xs bg-green-700 px-2 rounded-full text-white w-full border-2 mb-1"
            :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
          >
            hp
            {{ userLogged.dragon.vitalidade.actual + userLogged.dragon.vitalidade.bonus }} /
            {{ userLogged.dragon.vitalidade.total }} {{ userLogged.dragon.vitalidade.bonus !== 0 ? '+' + userLogged.dragon.vitalidade.bonus : '' }}
          </p>
          <p
            class="transition-all duration-500 text-xs bg-blue-800 px-2 rounded-full border-2 w-8/12 text-white mb-1"
            :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
          >
            vel.
            {{ userLogged.dragon.velocidade.actual }} {{ userLogged.dragon.velocidade.bonus !== 0 ? '+' + userLogged.dragon.velocidade.bonus : '' }}
          </p>
          <p
            class="transition-all duration-500 text-xs bg-red-700 px-2 rounded-full text-white border-2 w-1/2 mb-1"
            :class="userLogged.dragon.actions.position === 'fly' ? 'border-blue-300' : 'border-golden'"
          >
            reb.
            {{ userLogged.dragon.rebeldia.actual }} {{ userLogged.dragon.rebeldia.bonus !== 0 ? '+' + userLogged.dragon.rebeldia.bonus : '' }}
          </p>
          <p class="transition-all duration-500 leading-2 text-xs pl-1">
            {{
              userTurn === userLogged.email
                ? `Seu Turno (${userLogged.dragon.actions.position === 'ground' ? 'Em Terra' : 'Voando'})`
                : `Turno do oponente (${userOponent.dragon.actions.position === 'ground' ? 'Em Terra' : 'Voando'})`
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfo, faList } from '@fortawesome/free-solid-svg-icons';
library.add(faInfo);
library.add(faList);

export default {
  name: 'DataUserLogged',
  components: { FontAwesomeIcon },
  computed: {
    ...mapState(['userLogged', 'userOponent', 'type', 'winner', 'userTurn', 'messages']),
  },
  methods: {
    ...mapActions(['hideMessagesFromUser', 'hideInfoFromUser']),
  }
}
</script>
