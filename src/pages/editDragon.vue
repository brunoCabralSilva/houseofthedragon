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
          Editar um Dragão
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
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Alcance</p>
              <input
                type="number"
                id="alcance"
                v-model="alcance"
                placeholder="alcance"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Deslocamento</p>
              <input
                type="number"
                id="deslocamento"
                v-model="deslocamento"
                placeholder="deslocamento"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
            <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
              <p class="break-words w-full mb-3 sm:mb-1 text-white">Nível</p>
              <input
                type="number"
                id="nivel"
                v-model="nivel"
                placeholder="nivel"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
              />
            </label>
        </div>
        <label
          @click="showChangeImage"
          class="flex w-full gap-2 items-start sm:items-center mt-4 mb-6 cursor-pointer"
        >
          <div v-if="changeImage" class="w-4 h-4 bg-golden border border-black"></div>
          <div v-else class="w-4 h-4 bg-black border border-golden"></div>
          <p class="break-words w-full text-white leading-4">Quero alterar a imagem do Dragão</p>
        </label>
        <label
          v-if="changeImage"
          htmlFor="image"
          className="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
          <p class="break-words w-full mb-3 sm:mb-1 text-white">Escolha uma Imagem para o Dragão (mínimo de 1280 x 800)</p>
          <input 
            id="image"
            name="image"
            type="file"
            @change="handleImage"
            className="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
          />
        </label>
        <label
          v-if="changeImage"
          htmlFor="image"
          className="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
          <p class="break-words w-full mb-3 sm:mb-1 text-white">Escolha uma Imagem para o Dragão (Ícone 400 x 400)</p>
          <input 
            id="imageIcon"
            name="imageIcon"
            type="file"
            @change="handleImageIcon"
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
        <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
          <p class="break-words w-full mb-3 sm:mb-1 text-white">Nome da Fonte</p>
          <input
            type="nameFont"
            id="nameFont"
            v-model="nameFont"
            placeholder="Nome da Fonte"
            class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
          />
        </label>
        <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
          <p class="break-words w-full mb-3 sm:mb-1 text-white">Link da Fonte</p>
          <input
            type="linkFont"
            id="linkFont"
            v-model="linkFont"
            placeholder="Link da Fonte"
            class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
          />
        </label>
        <button
          @click="updateDragon"
          class="break-words relative inline-flex items-center justify-center p-0.5 sm:mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-golden to-dark-golden hover:from-dark-golden hover:to-golden hover:text-white w-full sm:mt-3 cursor-pointer transition-colors duration-500 focus:outline-none"
        >
          <span class="break-words relative px-2 sm:px-5 py-1 sm:py-2.5 transition-all ease-in duration-75 text-black font-bold sm:text-lg rounded-md group-hover:bg-opacity-0">
            {{ loading ? "Atualizando..." : "Atualizar" }}
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
import { authenticate } from '@/firebase/authenticate';
import { getDragonById, updateDragonById } from '@/firebase/dragons';
library.add(faPlus);

export default {
  name: 'EditDragon',
  components: {
    Footer,
    Loading,
    Navigation,
  },
  props: {
    dragonId: {
      type: String,
      required: true
    }
  },
  data() {
    const routerPage = useRouter();
    return {
      router: routerPage,
      id: '',
      loading: false,
      showData: false,
      changeImage: false,
      garras: 0,
      mordida: 0,
      dracarys: 0,
      rebeldia: 0,
      vitalidade: 0,
      velocidade: 0,
      alcance: 0,
      deslocamento: 0,
      nivel: 0,
      linkFont: '',
      nameFont: '',
      name: '',
      image: null,
      imageIcon: null,
      aparencia: '',
      description: '',
    }
  },
  async created() {
    const dragon = await getDragonById(this.dragonId);
    this.id = dragon.id;
    this.garras = dragon.garras;
    this.mordida = dragon.mordida;
    this.dracarys = dragon.dracarys;
    this.rebeldia = dragon.rebeldia;
    this.vitalidade = dragon.vitalidade;
    this.velocidade = dragon.velocidade;
    this.name = dragon.name;
    this.aparencia = dragon.aparencia;
    this.description = dragon.description;
    this.linkFont = dragon.linkFont;
    this.nameFont = dragon.nameFont;
    this.alcance = dragon.alcance;
    this.deslocamento = dragon.deslocamento;
    this.nivel = dragon.nivel;
    const auth = await authenticate();
    if (auth) {
      const user = await getUserByEmail(auth.email);
      this.displayName = user.firstName + ' ' + user.lastName;
      this.email = auth.email;
      this.showData = true;
    }
    else this.router.push('/login');
  },
  methods: {
    showChangeImage() {
      this.changeImage = !this.changeImage;
    },
    updateText(dataText) {
      this.description = dataText;
    },
    handleImageIcon(e) {
      if (e.target.files[0]) {
        this.imageIcon = e.target.files[0];
      }
    },
    handleImage(e) {
      if (e.target.files[0]) {
        this.image = e.target.files[0];
      }
    },
    async updateDragon() {
      this.loading = true;
      if (this.name < 3) {
        window.alert('Necessário preencher um Nome com pelo menos três caracteres');
      } else if(this.changeImage && (this.image.length === 0 || this.image === '') && (this.imageIcon.length === 0 || this.imageIcon === '')) {
        window.alert('Necessário escolher uma imagem do Dragão e seu ícone');
      } else if (this.vitalidade <= 0 || this.velocidade <= 0 || this.rebeldia <= 0 || this.dracarys <= 0 || this.mordida <= 0 || this.garras <= 0 || this.alcance <= 0 || this.deslocamento <= 0 || this.nivel <= 0) {
        window.alert('Todos os atributos devem ser maiores que zero');
      } else if(this.aparencia.length < 7) {
        window.alert('Necessário preencher uma Aparência com pelo menos sete caracteres');
      } else if(this.nameFont < 2) {
        window.alert('Necessário preencher um nome para a fonte com pelo menos sete caracteres');
      } else if(this.isLinkValid(this.linkFont)) {
        window.alert('Necessário preencher um Link para a fonte válido');
      } else {
        await updateDragonById(this.id, this.name, this.image, this.imageIcon, this.vitalidade, this.velocidade, this.rebeldia, this.dracarys, this.mordida, this.garras, this.alcance, this.deslocamento, this.nivel, this.description, this.nameFont, this.linkFont);
        this.router.push('/dragons');
      }
      this.loading = false;
    },
    isLinkValid(link) {
      return /^http?:\/\//i.test(link);
    },
  }
}
</script>