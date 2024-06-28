<template>
    <div class="break-words z-50 fixed top-0 left-0 w-full flex items-start justify-center bg-black/80 sm:px-0 h-full overflow-y-auto">
      <div class="bg-black break-words w-full flex flex-col justify-center items-center relative border-golden border-2 pb-5">
        <div class="break-words pt-4 sm:pt-3 px-3 w-full flex justify-end top-0 right-0">
          <FontAwesomeIcon
            :icon="['fas', 'circle-xmark']"
            class="break-words text-3xl text-golden cursor-pointer duration-500 transition-colors"
            @click="hideEditProfile"
          />
        </div>
        <div class="break-words px-6 sm:px-10 w-full">
          <div class="break-words w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
            <div
              class="break-words w-full text-white text-xl sm:text-2xl pb-3 font-bold text-left sm:text-center mt-2 mb-2"
            >
              Editar Perfil
            </div>
            <label class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Seu Email</p>
              <div
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              >
                {{ email }}
              </div>
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Primeiro Nome</p>
              <input
                type="firstName"
                id="firstName"
                v-model="firstName"
                placeholder="Insira um Nome"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="lastName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Sobrenome</p>
              <input
                type="lastName"
                id="lastName"
                v-model="lastName"
                placeholder="Insira um Sobrenome"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label
              @click="showChangeImage"
              class="flex w-full gap-2 items-start sm:items-center mb-2 cursor-pointer"
            >
              <div v-if="changeImage" class="w-4 h-4 bg-golden border border-black"></div>
              <div v-else class="w-4 h-4 bg-black border border-golden"></div>
              <p class="break-words w-full text-white leading-4">Quero alterar a imagem de Perfil</p>
            </label>
            <label v-if="changeImage" htmlFor="image" className="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Escolha uma Imagem de perfil</p>
              <input 
                id="image"
                name="image"
                type="file"
                @change="handleImage"
                className="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label
              @click="showChangePassword"
              class="flex w-full gap-2 items-center mb-2 cursor-pointer"
            >
            <div v-if="changePassword" class="w-4 h-4 bg-golden border border-black"></div>
            <div v-else class="w-4 h-4 bg-black border border-golden"></div>
              <p class="break-words w-full text-white leading-6">Quero alterar a senha</p>
            </label>
            <label v-if="changePassword" htmlFor="password" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Nova Senha</p>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="••••••"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label v-if="changePassword" htmlFor="password2" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Repita a Nova Senha</p>
              <input
                type="password"
                id="password2"
                v-model="password2"
                placeholder="••••••"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="last-password" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p v-if="changePassword" class="break-words w-full mb-3 sm:mb-1 text-white">Digite a senha antiga para confirmar as alterações</p>
              <p v-else class="break-words w-full mb-3 sm:mb-1 text-white">Digite a senha para confirmar as alterações</p>
              <input
                type="password"
                id="last-password"
                v-model="oldPassword"
                placeholder="••••••"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <button
              @click="updateProfile"
              class="break-words relative inline-flex items-center justify-center p-0.5 sm:mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-golden to-dark-golden hover:from-dark-golden hover:to-golden hover:text-white w-full sm:mt-3 cursor-pointer transition-colors duration-500 focus:outline-none"
            >
              <span class="break-words relative px-2 sm:px-5 py-1 sm:py-2.5 transition-all ease-in duration-75 text-black font-bold sm:text-lg rounded-md group-hover:bg-opacity-0">
                {{ loading ? "Alterando..." : "Alterar Dados" }}
              </span>
            </button>
          </div>
        </div>    
      </div>
    </div>
  </template>
    
<script>
import { authenticate, signIn } from '@/firebase/authenticate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
import { useRouter } from 'vue-router';
import { getUserByEmail, updateUserById } from '@/firebase/user';
library.add(faCircleXmark);

export default {
  name: 'ForgotPassword',
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      id: '',
      email: '',
      loading: false,
      lastName: '',
      image: '',
      firstName: '',
      oldPassword: '',
      changeImage: false,
      changePassword: false,
    }
  },
  async created() {
    const router = useRouter();
    const auth = await authenticate();
    if (auth) {
      const user = await getUserByEmail(auth.email);
      this.id = user.id;
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.showData = true;
    } else router.push('/login');
  },
  methods: {
    handleImage(e) {
      if (e.target.files[0]) {
        this.image = e.target.files[0];
      }
    },
    showChangePassword() {
      this.changePassword = !this.changePassword;
    },
    showChangeImage() {
      this.changeImage = !this.changeImage;
    },
    async updateProfile() {
      this.loading = true;
      const log = await signIn(this.email, this.oldPassword);
      if (this.firstName.length < 2) {
        window.alert('Necessário preencher um Nome com mais de 2 caracteres');
      } else if (this.lastName.length < 2) {
        window.alert('Necessário preencher um Sobrenome com mais de 2 caracteres');
      } else if(this.changeImage && (this.image.length === 0 || this.image === '')) {
        window.alert('Necessário escolher uma imagem de perfil');
      } else if (this.changePassword && (this.password.length < 6)) {
        window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
      } else if (this.changePassword && this.password !== this.password2) {
        window.alert('As Novas senhas inseridas não conferem');
      } else if (!log){
        window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
      } else {
        if(this.changePassword && this.changeImage) {
          await updateUserById(this.id, this.firstName.toLowerCase(), this.lastName.toLowerCase(), this.email, this.oldPassword, this.image, this.password);
          window.location.reload()
        } else if (this.changeImage) {
          await updateUserById(this.id, this.firstName.toLowerCase(), this.lastName.toLowerCase(), this.email, this.oldPassword, this.image, null);
          window.location.reload()
        } else if (this.changePassword) {
          await updateUserById(this.id, this.firstName.toLowerCase(), this.lastName.toLowerCase(), this.email, this.oldPassword, null, this.password);
        } else {
          await updateUserById(this.id, this.firstName.toLowerCase(), this.lastName.toLowerCase(), this.email, this.oldPassword, null, null);
        }
      }
      this.loading = false;
      this.changePassword = false;
      this.changeImage = false;
      this.oldPassword = '';
      this.image = null;
    },

    hideEditProfile() {
      this.$emit('edit-profile');
    }
  }
}
</script>
    