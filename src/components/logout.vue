<template>
  <div class="break-words z-50 fixed top-0 left-0 w-full flex items-center justify-center bg-black/80 px-3 sm:px-0 overflow-y-auto h-full">
    <div class="bg-black break-words w-11/12 md:w-1/3 lex flex-col justify-center items-center relative border-golden 0 border-2">
      <div class="break-words pt-4 sm:pt-3 px-3 w-full flex justify-end top-0 right-0">
        <FontAwesomeIcon
          :icon="['fas', 'circle-xmark']"
          class="break-words text-3xl text-golden cursor-pointer duration-500 transition-colors"
          @click="hideLogout"
        />
      </div>
      <div class="break-words px-6 sm:px-10 w-full">
        <div class="break-words w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
          <div class="break-words w-full text-white text-xl pb-3 font-bold text-center sm:text-center mt-2 mb-2">
            Tem certeza que quer sair da Plataforma?
          </div>
          <div class="flex gap-2 w-full">
            <button
              @click="logout"
              class="break-words relative inline-flex items-center justify-center p-0.5 sm:mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br bg-red-500 hover:text-white w-full sm:mt-3 cursor-pointer transition-colors duration-500 focus:outline-none"
            >
              <span class="break-words relative px-2 sm:px-5 py-1 sm:py-2.5 transition-all ease-in duration-75 text-black font-bold rounded-md group-hover:bg-opacity-0">
                Sair
              </span>
            </button>
            <button
              @click="hideLogout"
              class="break-words relative inline-flex items-center justify-center p-0.5 sm:mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br bg-green-500 w-full sm:mt-3 cursor-pointer transition-colors duration-500 focus:outline-none"
            >
              <span class="font-bold break-words relative px-2 sm:px-5 py-1 sm:py-2.5 transition-all ease-in duration-75 text-black rounded-md group-hover:bg-opacity-0">
                Cancelar
              </span>
            </button>
          </div>
        </div>
      </div>    
    </div>
  </div>
</template>
  
<script>
import { signOutFirebase } from '@/firebase/authenticate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCircleXmark);

export default {
  name: 'ForgotPassword',
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      email: '',
      loading: false,
    }
  },
  methods: {
    async logout() {
      const router = this.$router;
      await signOutFirebase();
      router.push('/');
      location.reload();
    },

    hideLogout() {
      this.$emit('logout-user');
    }
  }
}
</script>
  