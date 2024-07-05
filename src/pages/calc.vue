<template>
  <div class="w-full h-screen flex flex-col items-start justify-center bg-black text-white pl-10">
    <div class="flex flex-col gap-5">
      <p>Rolagem de Ataque: {{ attackRoll }}</p>
      <p>Rolagem de Esquiva: {{ dodgeRoll }}</p>
      <p>Resultado no Teste: {{ typeTest }}</p>
      <p>Dano Total: {{ initialDamage }}</p>
      <p>Dificuldade de absorção para a vitalidade {{ vitality }}: {{ dificulty }}</p>
      <p>Teste de Absorção: {{ absorptionRoll }}</p>
      <p>Dano absorvido: {{ absorbedDamage }}</p>
      <p>{{ text }}</p>
    </div>
  </div>
  <Footer />
</template>
  
<script>
import Footer from '@/components/footer.vue';
export default {
  name: 'rollAttack',
  components: {
    Footer,
  },
  created() {
    this.attack(this.playerInviting, this.playerInvited);
  },
  data() {
    return {
      text: 0,
      attackRoll: 0,
      dodgeRoll: 0,
      typeTest: '',
      initialDamage: 0,
      vitality: 0,
      dificulty: 0,
      absorptionRoll: 0,
      absorbedDamage: 0,
      finalDamage: 0,
      playerInviting: {
        id: 'Meraxes-123456',
        name: 'Meraxes',
        vitalidade: 195,
        rebeldia: 20,
        velocidade: 80,
        typeOfAttack: 'dracarys',
        dracarys: 5,
        mordida: 3,
        garras: 2,
      },
      playerInvited: {
        id: 'Balerion-123456',
        name: 'Balerion',
        vitalidade: 200,
        velocidade: 75,
        typeOfAttack: '',
        rebeldia: 20,
        dracarys: 5,
        mordida: 3,
        garras: 2,
      },
    }
  },
  methods: {
    attack(attacker, defender) {
      let totalDamage = 0;
      const testAttack = this.rollAttack(attacker, defender);
      const { type } = testAttack;
      this.typeTest = type;
      if (type === 'success') {
        const damage = this.calcDamage(attacker) * 2;
        this.initialDamage = damage;
        totalDamage = this.calcAbsorption(defender, damage);
        this.updateStamina(defender, totalDamage, false);
      } else if (type === 'criticalSuccess') {
        totalDamage = (attacker[attacker.typeOfAttack] + 12) * 2;
        this.updateStamina(defender, totalDamage, true);
      } else if (type === 'criticalFail') {
        this.text = this.playerInviting.name + ' errou o ataque (FALHA CRÍTICA)!';
      } else {
        this.text = this.playerInviting.name + ' errou o ataque!';
      }
    },
    rollDice(faces) {
      return Math.floor(Math.random() * faces) + 1;
    },
    rollAttack(attacker, defender) {
      this.vitality = defender.vitalidade;
      const roll = this.rollDice(20);
      let type = '';
      let dodgeBonus = 0;
      switch (defender.velocidade) {
        case 100: dodgeBonus = 12; break;
        case 95: dodgeBonus = 10; break;
        case 90: dodgeBonus = 8; break;
        case 85: dodgeBonus = 6; break;
        case 80: dodgeBonus = 4; break;
        case 75: dodgeBonus = 2; break;
        default: dodgeBonus = 14; break;
      }
      if (roll === 20) {
        type = "criticalSuccess";
        this.attackRoll = roll;
      } else if (roll === 1) {
        type = 'criticalFail';
        this.attackRoll = roll;
      } else {
        const attackRoll = this.rollDice(20) + (attacker[attacker.typeOfAttack] * 2);
        this.attackRoll = attackRoll;
        const dodgeRoll = this.rollDice(20) + dodgeBonus;
        this.dodgeRoll = dodgeRoll;
        if (attackRoll >= dodgeRoll) type = 'success';
        else type = 'fail';
      }
      return { type };
    },
    calcDamage(attacker) {
      const roll = this.rollDice(12);
      return roll + attacker[attacker.typeOfAttack];
    },
    calcAbsorption(defender, damage) {
      const maxChance = 35;
      const minChance = 10;
      const maxVitalidade = 200;
      const minVitalidade = 155;
      let dificulty = 0;
      if (defender.vitalidade > maxVitalidade) dificulty = maxChance;
      else if (defender.vitalidade <= minVitalidade) dificulty = minChance;
      else {
        const chance = ((30 - minChance) / (maxVitalidade - minVitalidade)) * (defender.vitalidade - minVitalidade) + minChance;
        dificulty = Math.round(chance);
      }
      this.dificulty = dificulty;
      var roll = this.rollDice(100);
      this.absorptionRoll = roll;
      if (roll <= dificulty) {
        const percentToRemove = dificulty / 100;
        const amountToRemove = Math.floor(damage * percentToRemove);
        this.absorbedDamage = amountToRemove;
        return damage - amountToRemove;
      } return damage;
    },
    updateStamina(defender, totalDamage, critical) {
      this.finalDamage = totalDamage;
      if(critical) this.text = defender.name + ' recebeu ' + totalDamage + ' de Dano Crítico!';
      else this.text = defender.name + ' recebeu ' + totalDamage + ' de Dano!';
    },
  },
}
</script>
  