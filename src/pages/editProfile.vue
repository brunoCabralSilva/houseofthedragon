<template>
    <div :class="['break-words', 'w-full', 'min-h-screen', 'flex', 'flex-col', 'items-start', 'justify-center', 'bg-black', 'sm:px-0', 'h-full']">
      <Navigation />
      <div v-if="!showData" class="w-full py-10 h-full flex justify-center items-center bg-black">
        <Loading />
      </div>
      <div v-else class="break-words w-full h-full flex flex-col justify-center items-center relative p-5">
        <div class="break-words w-full h-full overflow-y-auto flex flex-col justify-center items-center">
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
          <label class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Seu Nickname</p>
            <div
              class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            >
              {{ nickname }}
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
    <Footer />
  </template>
    
<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
import Loading from '@/components/loading.vue';
import { authenticate, signIn } from '@/firebase/authenticate';
import { useRouter } from 'vue-router';
import { getUserByEmail, updateUserById } from '@/firebase/user';

export default {
  name: 'ForgotPassword',
  components: {
    Navigation,
    Footer,
    Loading,
  },
  data() {
    return {
      id: '',
      email: '',
      image: '',
      nickname: '',
      lastName: '',
      firstName: '',
      loading: false,
      showData: false,
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
      this.nickname = user.nickname;
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
    