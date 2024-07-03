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
            Adicione um Dragão
          </div>
          <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Nome</p>
            <input
              type="name"
              id="name"
              v-model="name"
              placeholder="Nome do Dragão"
              class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 w-full gap-2 sm:gap-4">
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Vitalidade</p>
              <input
                type="number"
                id="vitalidade"
                v-model="vitalidade"
                placeholder="Vitalidade"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Carapaça</p>
              <input
                type="number"
                id="carapaca"
                v-model="carapaca"
                placeholder="Carapaça"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Velocidade</p>
              <input
                type="number"
                id="velocidade"
                v-model="velocidade"
                placeholder="Velocidade"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Tamanho</p>
              <input
                type="number"
                id="tamanho"
                v-model="tamanho"
                placeholder="Tamanho"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Ataque</p>
              <input
                type="number"
                id="ataque"
                v-model="ataque"
                placeholder="Ataque"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Rebeldia</p>
              <input
                type="number"
                id="rebeldia"
                v-model="rebeldia"
                placeholder="Rebeldia"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Dracarys</p>
              <input
                type="number"
                id="dracarys"
                v-model="dracarys"
                placeholder="Dracarys"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Mordida</p>
              <input
                type="number"
                id="mordida"
                v-model="mordida"
                placeholder="Mordida"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Garras</p>
              <input
                type="number"
                id="garras"
                v-model="garras"
                placeholder="Garras"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Aparência</p>
              <input
                type="text"
                id="aparencia"
                v-model="aparencia"
                placeholder="Aparência"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
          </div>
          <label htmlFor="image" className="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Escolha uma Imagem para o Dragão (mínimo de 1280 x 800)</p>
            <input 
              id="image"
              name="image"
              type="file"
              @change="handleImage"
              className="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </label>
          <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Insira uma beve descrição:</p>
            <div class="flex w-full">
              <textarea
                type="description"
                id="description"
                :value="description"
                @input="updateText($event.target.value)"
                placeholder="Seu texto aqui"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden mr-2"
              />
            </div>
          </label>
          <label htmlFor="last-password" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Digite a senha para realizar a publicação</p>
            <input
              type="password"
              id="last-password"
              v-model="oldPassword"
              placeholder="••••••"
              class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </label>
          <button
            @click="addDragon"
            class="break-words relative inline-flex items-center justify-center p-0.5 sm:mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-golden to-dark-golden hover:from-dark-golden hover:to-golden hover:text-white w-full sm:mt-3 cursor-pointer transition-colors duration-500 focus:outline-none"
          >
            <span class="break-words relative px-2 sm:px-5 py-1 sm:py-2.5 transition-all ease-in duration-75 text-black font-bold sm:text-lg rounded-md group-hover:bg-opacity-0">
              {{ loading ? "Validando..." : "Publicar" }}
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
import { faPlus  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'vue-router';
import { getUserByEmail } from '@/firebase/user';
import { authenticate, signIn } from '@/firebase/authenticate';
import { registerDragon } from '@/firebase/dragons';
library.add(faPlus);

export default {
  name: 'AddDragon',
  components: {
    Footer,
    Loading,
    Navigation,
  },
  data() {
    return {
      loading: false,
      showData: false,
      ataque: 0,
      garras: 0,
      mordida: 0,
      tamanho: 0,
      carapaca: 0,
      dracarys: 0,
      rebeldia: 0,
      vitalidade: 0,
      velocidade: 0,
      name: '',
      image: '',
      password: '',
      aparencia: '',
      description: '',
      oldPassword: '',
    }
  },
  async created() {
    const router = useRouter();
    const auth = await authenticate();
    if (auth) {
      const user = await getUserByEmail(auth.email);
      this.displayName = user.firstName + ' ' + user.lastName;
      this.email = auth.email;
      this.showData = true;
    }
    else router.push('/login');
  },
  methods: {
    updateText(dataText) {
      this.description = dataText;
    },
    handleImage(e) {
      if (e.target.files[0]) {
        this.image = e.target.files[0];
      }
    },
    async addDragon() {
      this.loading = true;
      const log = await signIn(this.email, this.oldPassword);
      if (!log) {
        window.alert('Não foi possível validar a senha. Por favor, verifique suas credenciais e tente novamente.');
      } else if (this.name < 3) {
        window.alert('Necessário preencher um Nome com pelo menos três caracteres');
      } else if(this.image.length === 0 || this.image === '') {
        window.alert('Necessário escolher uma imagem de publicação');
      } else if (this.vitalidade <= 0 || this.carapaca <= 0 || this.velocidade <= 0 || this.tamanho <= 0 || this.ataque <= 0 || this.rebeldia <= 0 || this.dracarys <= 0 || this.mordida <= 0 || this.garras <= 0) {
        window.alert('Todos os atributos devem ser maiores que zero');
      } else if(this.aparencia.length < 7) {
        window.alert('Necessário preencher uma Aparência com pelo menos sete caracteres');
      } else {
        await registerDragon(this.name, this.image, this.vitalidade, this.carapaca, this.velocidade, this.tamanho, this.ataque, this.rebeldia, this.dracarys, this.mordida, this.garras, this.aparencia, this.description);
        this.image = null;
        this.loading = false;
        this.garras = 0;
        this.ataque = 0;
        this.mordida = 0;
        this.tamanho = 0;
        this.rebeldia = 0;
        this.dracarys = 0;
        this.carapaca = 0;
        this.vitalidade = 0;
        this.velocidade = 0;
        this.name = '';
        this.aparencia = '';
        this.description = '';
        this.oldPassword = '';
      }
    },
  }
}
</script>