<template>
    <div class="flex flex-col gap-1 cursor-pointer fixed top-2 right-2 z-40
    " @click="toggleMenu">
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra1()]" ></div>
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra2()]" ></div>
      <div :class="['h-1', 'w-7', 'bg-gradient-to-r from-golden to-dark-golden rounded', barra3()]" ></div>
    </div>
  <div
    v-if="showMenu"
    class="fixed h-screen w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-black top-0 right-0 z-30"
  >
    <ul class="flex flex-col items-center justify-center gap-4 lg:gap-8 h-full">
      <router-link
        to="/"
        @click="toggleMenu"
        :class="['font-sedan-sc', 'cursor-pointer', 'text-golden', 'hover:text-white', 'font-bold', 'transition-colors', 'duration-300', 'text-xl', this.route === '/' ? 'underline' : '']"
      >
        Início
      </router-link>
      <router-link
        to="/gaming"
        @click="toggleMenu"
        :class="['font-sedan-sc', 'cursor-pointer', 'text-golden', 'hover:text-white', 'font-bold', 'transition-colors', 'duration-300', 'text-xl', this.route === '/gaming' ? 'underline' : '']"
      >
        O Jogo
      </router-link>
      <router-link
        to="/dragons"
        @click="toggleMenu"
        :class="['font-sedan-sc', 'cursor-pointer', 'text-golden', 'hover:text-white', 'font-bold', 'transition-colors', 'duration-300', 'text-xl', this.route === '/dragons' ? 'underline' : '']"
      >
        Dragões
      </router-link>
      <router-link
        to="/news"
        @click="toggleMenu"
        :class="['font-sedan-sc', 'cursor-pointer', 'text-golden', 'hover:text-white', 'font-bold', 'transition-colors', 'duration-300', 'text-xl', this.route === '/news' ? 'underline' : '']"
      >
        Notícias
      </router-link>
      <router-link
        to="/community"
        @click="toggleMenu"
        :class="['font-sedan-sc', 'cursor-pointer', 'text-golden', 'hover:text-white', 'font-bold', 'transition-colors', 'duration-300', 'text-xl', this.route === '/community' ? 'underline' : '']"
      >
        Comunidade
      </router-link>
      <router-link
        to="/profile"
        @click="toggleMenu"
        :class="['font-sedan-sc', 'cursor-pointer', 'text-golden', 'hover:text-white', 'font-bold', 'transition-colors', 'duration-300', 'text-xl', this.route === '/profile' ? 'underline' : '']"
      >
        Perfil
      </router-link>
      <router-link
        @click="toggleMenu"
        :to="logged ? '/matchs' :'/login'"
        class="mt-10 flex bg-golden hover:bg-white rounded whitespace-nowrap px-3 py-2 text-black font-bold transition-colors duration-300"
      >
        Jogue Agora
      </router-link>
      <div
        v-if="logged"
        @click="signOut"
        class="font-sedan-sc cursor-pointer text-golden hover:text-white font-bold transition-colors duration-300 text-xl"
      >
        Sair
      </div>
    </ul>
  </div>
  <Logout v-if="close" @logout-user="close = false" />
</template>

<script>
import Logout from '@/components/logout.vue';
import { authenticate } from '@/firebase/authenticate';

export default {
  name: 'NavigationBattle',
  async mounted() {
    const auth = await authenticate();
    if (auth) this.logged = true;
    else this.logged = false;
  },
  data() {
    return {
      close: false,
      logged: false,
      showMenu: false,
    }
  },
  components: {
    Logout,
  },
  methods: {
    signOut() {
      this.close = true;
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
