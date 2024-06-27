<template>
  <div class="break-words z-50 fixed top-0 left-0 w-full flex items-center justify-center bg-black/80 px-3 sm:px-0 overflow-y-auto h-full">
    <div class="bg-black break-words w-11/12 md:w-1/2 lex flex-col justify-center items-center relative border-golden 0 border-2 pb-5">
      <div class="break-words pt-4 sm:pt-3 px-3 w-full flex justify-end top-0 right-0">
        <FontAwesomeIcon
          :icon="['fas', 'circle-xmark']"
          class="break-words text-3xl text-golden cursor-pointer duration-500 transition-colors"
          @click="hideForgotPassword"
        />
      </div>
      <div class="break-words px-6 sm:px-10 w-full">
        <div class="break-words w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
          <div class="break-words w-full text-white text-xl sm:text-2xl pb-3 font-bold text-left sm:text-center mt-2 mb-2">
            Esqueceu a senha?
          </div>
          <label htmlFor="email" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Digite o seu Email</p>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              v-model="email"
            />
          </label>
          <button
            @click="forgotUserPassword"
            class="break-words relative inline-flex items-center justify-center p-0.5 sm:mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-golden to-dark-golden hover:from-dark-golden hover:to-golden hover:text-white w-full sm:mt-3 cursor-pointer transition-colors duration-500 focus:outline-none"
          >
            <span class="break-words relative px-2 sm:px-5 py-1 sm:py-2.5 transition-all ease-in duration-75 text-black font-bold sm:text-lg rounded-md group-hover:bg-opacity-0">
              {{ loading ? "Enviando..." : "Enviar" }}
            </span>
          </button>
        </div>
      </div>    
    </div>
  </div>
</template>
  
<script>
import { forgotPassword } from '@/firebase/authenticate';
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
    async forgotUserPassword() {
      this.loading = true;
      const validate = /\S+@\S+\.\S+/;
      const vEmail = !this.email || !validate.test(this.email) || this.email === '';
      if (vEmail) {
        window.alert('Por favor, forneça um e-mail válido.');
        this.loading = false;
      } else { 
        await forgotPassword(this.email);
        window.alert('Enviamos para o Email informado um link para Reset de Senha.');
        this.loading = false;
        this.hideForgotPassword();
      }
    },

    hideForgotPassword() {
      this.$emit('close-forgot-password');
    }
  }
}
</script>
  