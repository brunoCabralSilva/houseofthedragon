<template>
  <div class="col-span-2 grid grid-cols-2 w-full">
    <div class="col-span-2 w-full h-full flex flex-col items-center justify-center gap-2 p-1">
      <div class="flex w-full justify-center items-center gap-2">
        <button
          type="button"
          :disabled="userTurn !== userLogged.email || verifyAction('default')"
          @click="attackOponent('dracarys')"
          @mouseover="setTooltip(
            true,
            'Dracarys - Ação Padrão',
            'Ataca o oponente com uma torrente de chamas ardentes, expelindo um poderoso jato de fogo de suas mandíbulas.',
            'Ataque: ' + this.userLogged.dragon.actions.dracarys.actual + ' - De ' + (1 + this.userLogged.dragon.actions.dracarys.actual) * 2 + ' a ' + (12 + this.userLogged.dragon.actions.dracarys.actual) * 2 + ' de dano.',
            'Alcance: ' + Math.ceil(this.userLogged.dragon.alcance.actual / 2)
          )"
          @mouseout="setTooltip(false, '', '', '', '')"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            src="@/assets/icons/dracarys.png"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('default') ? 'opacity-40' : 'opaticy-1'"
          />
        </button>
        <button
          type="button"
          :disabled="userTurn !== userLogged.email || this.verifyAction('default')"
          @click="attackOponent('mordida')"
          @mouseover="setTooltip(
            true,
            'Mordida - Ação Padrão',
            'Ataca o oponente com uma mordida feroz, cravando suas afiadas presas na carne inimiga e causando danos devastadores.',
            'Ataque: ' + this.userLogged.dragon.actions.mordida.actual + ' - De ' + (1 + this.userLogged.dragon.actions.mordida.actual) * 2 + ' a ' + (12 + this.userLogged.dragon.actions.mordida.actual) * 2 + ' de dano.',
            'Alcance: ' + Math.ceil(this.userLogged.dragon.alcance.actual / 2)
          )"
          @mouseout="setTooltip(false, '', '', '', '')"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            src="@/assets/icons/mordida.png"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('default') ? 'opacity-40' : 'opaticy-1'"
          />
        </button>
        <button
          type="button"
          :disabled="userTurn !== userLogged.email || verifyAction('default')"
          @click="attackOponent('garras')"
          @mouseover="setTooltip(
            true,
            'Garras - Ação Padrão',
            'Ataca o oponente com suas garras afiadas, desferindo golpes rápidos e precisos.',
            'Ataque: ' + this.userLogged.dragon.actions.garras.actual + ' - De ' + (1 + this.userLogged.dragon.actions.garras.actual) * 2 + ' a ' + (12 + this.userLogged.dragon.actions.garras.actual) * 2 + ' de dano.',
            'Alcance: ' + Math.ceil(this.userLogged.dragon.alcance.actual / 2)
          )"
          @mouseout="setTooltip(false, '', '', '', '')"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            src="@/assets/icons/garras.png"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('default') ? 'opacity-40' : 'opaticy-1'"
          />
        </button>
        <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
          1
        </div>
        <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
          2
        </div>
      </div>
      <div class="flex w-full justify-center items-center gap-2">
        <button 
          type="button"
          v-if="this.userLogged.dragon.actions.position === 'ground'"
          :disabled="this.userLogged.dragon.actions.hunt !== 0 || userTurn !== userLogged.email  || verifyAction('movement-bonus')"
          @click="huntSheep"
          @mouseout="setTooltip(false, '', '', '', '')"
          @mouseover="setTooltip(
            true,
            'Caçar - Ação Bônus e de Movimento',
            'O dragão avista uma ovelha, avança rapidamente e a devora com voracidade, recuperando ' + Math.ceil(Math.ceil(this.userLogged.dragon.vitalidade.total / 5) / 10) + 'd10 pontos de vida. Esta ação só pode ser realizada uma vez durante o combate.',
            '', '',
          )"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            :src="require('@/assets/icons/sheep.png')"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="this.userLogged.dragon.actions.hunt !== 0 || userTurn !== userLogged.email || verifyAction('movement-bonus') ? 'opacity-40' : 'opacity-1'"
          />
        </button>
        <button 
          v-else
          type="button"
          :disabled="userTurn !== userLogged.email || verifyAction('movement-default')"
          @click="knockDown"
          @mouseout="setTooltip(false, '', '', '', '')"
          @mouseover="setTooltip(
            true,
            'Derrubar - Ação Bônus e de Movimento',
            'Ambos os Dragões precisam estar Voando para que esta ação seja possível, além de que é necessário estar fora do alcance do Oponente. Executando esta ação, o alvo é derrubado dos céus ao chão, precisando ter sucesso em um teste de Vitalidade para que não fique Atordoado.',
            '', '',
          )"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            :src="require('@/assets/icons/derrubar.png')"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('movement-default') ? 'opacity-40' : 'opacity-1'"
          />
        </button>
        <button
          v-if="this.userLogged.dragon.actions.position === 'ground'"
          type="button"
          @click="changeDragonPosition"
          @mouseover="setTooltip(
            true,
            'Voar - Ação De Movimento',
            'Com um poderoso bater de asas, o dragão se ergue do solo e alça voo aos céus. Concede Ataque de Oportunidade caso as circunstâncias permitam.',
            '', '',
          )"
          @mouseout="setTooltip(false, '', '', '', '')"
          :disabled="userTurn !== userLogged.email || this.verifyAction('movement')"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            :src="require('@/assets/icons/voar.png')"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('movement') ? 'opacity-40' : 'opacity-1'"
          />
        </button>
        <button
          type="button"
          v-else
          @click="changeDragonPosition"
          @mouseover="setTooltip(
            true,
            'Aterrisar - Ação De Movimento',
            'Com um único bater de asas, o dragão toca o chão suavemente, pronto para enfrentar qualquer desafio em solo que o aguarde. Concede Ataque de Oportunidade caso as circunstâncias permitam.',
            '', '',
          )"
          @mouseout="setTooltip(false, '', '', '', '')"
          :disabled="userTurn !== userLogged.email || this.verifyAction('movement')"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            :src="require('@/assets/icons/aterrisar.png')"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('movement') ? 'opacity-40' : 'opacity-1'"
          />
        </button>
        <button
          type="button"
          :disabled="userTurn !== userLogged.email || verifyAction('movement')"
          @mouseout="setTooltip(false, '', '', '', '')"
          @mouseover="setTooltip(
            true,
            'Deslocar-se - Ação De Movimento',
            'Permite que o Dragão se mova baseado no seu valor de deslocamento e também pode ser feito clicando diretamente no ícone do Dragão. Pode gerar Ataque de Oportunidade caso esteja saindo da área de alcance do oponente.',
            '', '',
          )"
          @click="setMovementDragon"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            src="@/assets/icons/move.png"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn !== userLogged.email || verifyAction('movement') ? 'opacity-40' : 'opacity-1'"
          />
        </button>
        <div class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer">
          3
        </div>
        <button
          type="button"
          @mouseout="setTooltip(false, '', '', '', '')"
          @mouseover="setTooltip(
            true,
            'Encerrar Turno',
            'Passa a vez para o oponente, permitindo que ele faça suas ações enquanto o dragão aguarda sua próxima oportunidade de agir.',
            '', '',
          )"
          @click="finishTurn"
          :disabled="userTurn !== userLogged.email"
          class="flex items-center justify-center border-golden border rounded w-10 h-10 cursor-pointer"
        >
          <img
            src="@/assets/icons/end.png"
            class="transition-all duration-500 h-8 w-8 object-cover"
            :class="userTurn === userLogged.email ? 'opacity-1' : 'opacity-40'"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { changePosition, endTurn, hunt, verifyActions } from '@/firebase/battle';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'UserActions',
  components: { },
  computed: { ...mapState(['userLogged', 'userTurn', 'matchId', 'email']) },
  data() { return { } },
  methods: {
    ...mapActions(['setMovementDragon', 'showTooltip']),
    setTooltip(show, title, description, ataque, alcance) { 
      this.showTooltip({ show, title, description, ataque, alcance });
     },
    knockDown() { console.log('Knock Down') },
    attackOponent(type) { console.log('Attack: ' + type) },
    verifyAction(type) { return verifyActions(type, this.userLogged) },
    async finishTurn() { await endTurn(this.matchId, this.email) },
    async changeDragonPosition() { await changePosition(this.matchId, this.email) },
    async huntSheep() {
      this.disabledHunt = true;
      await hunt(this.matchId, this.email, Math.ceil(Math.ceil(this.userLogged.dragon.vitalidade.total / 5) / 10))
    },
  }
}
</script>
