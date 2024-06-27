<template>
  <div
    class="bg-black w-full flex justify-between items-center text-white px-4 py-2"
  >
    <div>
      <router-link
        to="/"
        class="flex items-center gap-2 cursor-pointer"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
      >
        <img
          :src="require(`@/assets/${imageIcon}`)"
          class="w-8 sm:w-12 object-contain"
          alt="Emblema dourado da cara Targaryen"
        >
        <div :class="['hidden','md:flex', 'sm:flex-col', 'sm:justify-center', 'sm:items-start', imageIcon === 'targaryen-icon.png' ? 'text-golden' : 'text-white']">
          <p class="my-0 font-sedan-sc  font-bold leading-none">Valyrian</p>
          <p class="my-0 font-sedan-sc font-bold text-2xl leading-none">Wars</p>
        </div>
      </router-link>
    </div>
    <div :class="['md:hidden','flex', 'justify-center', 'items-center', 'w-full']">
      <p class="my-0 font-sedan-sc text-golden font-bold leading-none">Valyrian Wars</p>
    </div>

    <ul class="hidden md:flex justify-center gap-4 lg:gap-8">
      <router-link to="/gaming" class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        O Jogo
      </router-link>
      <router-link to="/dragons" class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Dragões
      </router-link>
      <router-link to="/news" class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Notícias
      </router-link>
      <router-link to="/community" class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Comunidade
      </router-link>
      <router-link to="/profile" class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300">
        Perfil
      </router-link>
      <div
        v-if="logged"
        @click="signOut"
        class="cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300 w-6"
      >
        <FontAwesomeIcon :icon="['fass', 'right-from-bracket']" />
      </div>
      <div v-else class="w-6"></div>
    </ul>

    <router-link
      to="/login"
      class="hidden md:flex bg-golden hover:bg-white rounded whitespace-nowrap px-3 py-2 text-black font-bold transition-colors duration-300"
    >
      Jogue Agora
    </router-link>

    <div class="flex flex-col gap-1 md:hidden cursor-pointer" @click="toggleMenu">
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra1()]" ></div>
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra2()]" ></div>
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra3()]" ></div>
    </div>
  </div>
</template>

<script>
import { authenticate, signOutFirebase } from '@/firebase/authenticate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faRightFromBracket );
export default {
  name: 'NavigationComponent',
  async mounted() {
    const auth = await authenticate();
    if (auth) this.logged = true;
    else this.logged = false;
  },
  data() {
    return {
      logged: false,
      showMenu: false,
      imageIcon: 'targaryen-icon.png',
    }
  },
  components: {
    FontAwesomeIcon,
  },
  methods: {
    async signOut() {
      const router = this.$router;
      await signOutFirebase();
      router.push('/');
      location.reload();
    },

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
