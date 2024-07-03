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
            Crie uma Publicação
          </div>
          <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Insira um título</p>
            <input
              type="title"
              id="title"
              v-model="title"
              placeholder="Título"
              class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </label>
          <label htmlFor="image" className="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Escolha uma Imagem para a Publicação (mínimo de 1280 x 800)</p>
            <input 
              id="image"
              name="image"
              type="file"
              @change="handleImage"
              className="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </label>
          <label htmlFor="firstName" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p class="break-words w-full mb-3 sm:mb-1 text-white">Insira aqui o seu texto. Para cada novo parágrafo, clique em " + " (clique em algum parágrafo já adicionado para editá-lo)</p>
            <div class="flex w-full">
              <textarea
                type="title"
                id="title"
                :value="text"
                @input="updateText($event.target.value)"
                placeholder="Seu texto aqui"
                class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden mr-2"
              />
              <div
                @click="addText"
                class="flex items-center justify-center bg-golden cursor-pointer p-2"
              >
                <FontAwesomeIcon
                  :icon="['fas', 'plus']"
                  class="text-2xl text-black"
                />
              </div>
            </div>
          </label>
          <div :class="[ texts.length > 0 ? 'border': '', texts.length > 0 ? 'border-golden' : '', 'py-2', 'w-full', 'mb-2']">
            <label
              v-for="(paragraph, index) in texts"
              :key="index"
              class="break-words flex flex-col items-center w-full">
              <div
                class="px-4 break-words bg-black w-full p-2 cursor-pointer text-white text-justify"
              >
                <div
                  v-if="editText.edit && editText.number === paragraph.number">
                  <textarea
                    type="editText"
                    id="editText"
                    :value="editText.newText"
                    @input="editNewText($event.target.value)"
                    placeholder="Seu texto aqui"
                    class="break-words bg-black border border-golden w-full p-3 cursor-pointer text-white text-left focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden mr-2"
                  />
                  <div class="flex gap-2 text-black">
                    <div
                      @click="updateEditedText"
                      class="bg-green-500 p-2"
                    >
                      Save
                    </div>
                    <div
                      @click="cancelEditText"
                      class="bg-red-500 p-2"
                    >
                      cancel
                    </div>
                  </div>
                </div>
                <div
                  @click="edit(paragraph)"
                  v-else
                >
                  {{ paragraph.text }}
                </div>
              </div>
            </label>
          </div>
          <label htmlFor="last-password" class="break-words mb-3 sm:mb-4 flex flex-col items-center w-full">
            <p v-if="changePassword" class="break-words w-full mb-3 sm:mb-1 text-white">Digite a senha antiga para confirmar as alterações</p>
            <p v-else class="break-words w-full mb-3 sm:mb-1 text-white">Digite a senha para realizar a publicação</p>
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
import { registerNews } from '@/firebase/news';
import { getUserByEmail } from '@/firebase/user';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { authenticate, signIn } from '@/firebase/authenticate';
library.add(faPlus );

export default {
  name: 'CreateNews',
  components: {
    Footer,
    Loading,
    Navigation,
    FontAwesomeIcon,
  },
  data() {
    return {
      id: '',
      email: '',
      displayName: '',
      title: '',
      image: '',
      loading: false,
      showData: false,
      password: '',
      text: '',
      texts: [],
      editText: { edit: false, newText: '' },
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
    edit(paragraph) {
      this.editText = { edit: true, newText: paragraph.text, number: paragraph.number };
    },
    editNewText(data) {
      this.editText = { ...this.editText, newText: data };
    },
    updateEditedText() {
      if (this.editText.newText === '') {
        const sameTexts = this.texts.filter((dataText) => dataText.number !== this.editText.number);
        this.texts = sameTexts.sort((a, b) => a.number - b.number);
      } else {
        const newText = this.texts.find((dataText) => dataText.number === this.editText.number);
        const sameTexts = this.texts.filter((dataText) => dataText.number !== this.editText.number);
        const list = [...sameTexts, { ...newText, text: this.editText.newText }];
        this.texts = list.sort((a, b) => a.number - b.number);
      }
      this.editText = { edit: false, newText: '', number: 0 };
    },
    cancelEditText() {
      this.editText = { edit: false, newText: '', number: 0 };
    },
    addText() {
      if (this.text !== '' && this.text !== ' ') {
        let maxNumber = 0;
        if (this.texts.length > 0) {
          maxNumber = this.texts.reduce((max, dataText) => {
            return dataText.number > max ? dataText.number : max;
          }, this.texts[0].number);
        }
        this.texts.push({ text: this.text, number: maxNumber + 1 });
        this.text = '';
        console.log(this.texts);
      }
    },
    updateText(dataText) {
      this.text = dataText;
    },
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
      if (!log) {
        window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
      } else if (this.title < 2) {
        window.alert('Necessário preencher um parágrafo com pelo menos três caracteres');
      } else if(this.image.length === 0 || this.image === '') {
        window.alert('Necessário escolher uma imagem de publicação');
      } else if (this.texts.length === 0){
        window.alert('Necessário adicionar pelo menos um parágrafo');
      } else {
        await registerNews(this.email, this.title, this.image, this.texts, this.displayName);
        this.title = '';
        this.image = null;
        this.password = null;
        this.text = '';
        this.texts = [];
        this.editText = { edit: false, newText: '', number: 0 };
        this.loading = false;
      }
    },

    hideEditProfile() {
      this.$emit('edit-profile');
    }
  }
}
</script>