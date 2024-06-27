<template>
  <div
    class="bg-black w-full flex justify-between items-center text-white px-4 py-2"
  >
    <div
      class="flex items-center gap-2 cursor-pointer"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    >
      <img
        :src="require(`@/assets/${imageIcon}`)"
        class="w-8 sm:w-12 object-contain"
        alt="Emblema dourado da cara Targaryen"
      >
      <div :class="['hidden','sm:flex', 'sm:flex-col', 'sm:justify-center', 'sm:items-start', imageIcon === 'targaryen-icon.png' ? 'text-golden' : 'text-white']">
        <p class="my-0 font-sedan-sc  font-bold leading-none">Valyrian</p>
        <p class="my-0 font-sedan-sc font-bold text-2xl">Wars</p>
      </div>
    </div>
    <div :class="['sm:hidden','flex', 'justify-center', 'items-center', 'w-full']">
      <p class="my-0 font-sedan-sc text-golden font-bold leading-none">Valyrian Wars</p>
    </div>
    <ul class="hidden sm:flex w-full justify-center gap-4 lg:gap-8">
      <li class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        O Jogo
      </li>
      <li class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Dragões
      </li>
      <li class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Notícias
      </li>
      <li class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Comunidade
      </li>
    </ul>
    <button
      type="button"
      class="hidden sm:flex bg-golden hover:bg-white rounded whitespace-nowrap px-3 py-2 text-black font-bold transition-colors duration-300"
    >
      Jogue Agora
    </button>
    <div class="flex flex-col gap-1 sm:hidden cursor-pointer" @click="toggleMenu">
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra1()]" ></div>
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra2()]" ></div>
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra3()]" ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationIcon',
  data() {
    return {
      showMenu: false,
      imageIcon: 'targaryen-icon.png',
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    handleMouseOver() {
      this.imageIcon = "targaryen-white-icon.png"
    },

    handleMouseOut() {
      this.imageIcon = "targaryen-icon.png"
    },

    barra1() {
      if(!this.showMenu) {
        return 'rotate-0 transition duration-500 z-0';
      } return 'rotate-45 transition duration-500 translate-y-2 z-40';
    },

    barra2() {
      if(!this.showMenu) {
        return 'rotate-0 transition duration-500 z-0';
      } return '-rotate-45 transition duration-500 z-40';
    },

    barra3() {
      if(!this.showMenu) {
        return 'opacity-1 transition duration-500 z-0';
      } return 'opacity-0 transition duration-500 z-40';
    },

  }
}
</script>
<style>
  .font-sedan-sc {
    font-family: "Sedan SC", serif;
  }

  .black-ops-one-regular {
    font-family: "Black Ops One", system-ui;
    font-weight: 400;
    font-style: normal;
  }

</style>
