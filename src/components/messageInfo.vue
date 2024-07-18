<template>
  <div
    v-if="!hideMessages || !hideInfo"
    class="col-span-1 fixed left-0 bottom-20vh h-25vh w-full "
  >
    <div v-if="!hideMessages" class="transition-all duration-500 border border-golden rounded w-1/2 bg-black/80">
      <div
        class="transition-all duration-500 w-full flex flex-col h-full items-center justify-center"
      >
        <p class="transition-all duration-500 w-full px-2 pt-1 border-b-golden border border-transparent text-sm">Histórico</p>
        <div class="transition-all duration-500 w-full justify-end relative overflow-y-auto h-14vh py-2 px-2">
          <div
            v-for="(msg, index) in userLogged.messages"
            :key="index"
            class="transition-all duration-500 leading-4"
          >
            <span class="transition-all duration-500  pb-1 leading-3 text-golden pr-1">{{ msg.date }}:</span>
            <span :class="['transition-all', 'duration-500', 'pt-1', 'leading-3', 'text-sm', index === 0 ? 'underline': '']">
              {{ msg.text }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="hideInfo" class="transition-all duration-500 border border-golden rounded w-full">
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
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MessageInfo',
  components: { },
  computed: { ...mapState(['userLogged', 'hideMessages', 'hideInfo']) },
}
</script>
