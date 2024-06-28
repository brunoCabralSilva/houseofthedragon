<template>
  <div :class="['min-h-screen', 'bg-black', 'flex', 'flex-col', 'justify-start', showData ? 'items-start' : 'items-start']">
    <Navigation />
    <div v-if="!showData" class="mt-20 w-full flex items-center justify-center">
      <Loading />
    </div>
    <div v-else class="h-full flex flex-col items-start justify-start bg-black text-white pt-5 w-full gap-2 px-2">
      <p class="text-2xl sm:text-3xl font-sedan-sc text-center sm:text-left">Bem vindos à Comunidade!</p>
      <div class="flex w-full mt-5">
        <div class="break-words border-2 border-prot-light rounded flex w-full">
          <textArea
            id="text"
            :value="text"
            @input="updateText($event.target.value)"
            @keydown.enter.prevent="sendMessage"
            placeholder="Escreva aqui sua mensagem"
            class="break-words bg-black border-none outline-none text-white text-lg rounded block w-full p-2.5 placeholder-gray-400 sm:text-left"
          />
        </div>
        <button 
          type="button"
          id="sendMessage"
          @click="sendMessage"
          class="break-words bg-black border-2 border-prot-light transition-colors hover:border-golden text-white focus:ring-prot-light font-medium rounded text-lg px-3 text-center ml-1 flex items-center justify-center h-10"
        >
          <FontAwesomeIcon :icon="['fa', 'paper-plane']" />
        </button>
      </div>
      <div className="w-full flex flex-col gap-2 mt-5 mb-3">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="text-white bg-black w-full sm:pr-5 py-5"
          alt="Carta de campo"
          >
          <div class="bg-hard-dark-golden text-lg rounded-xl w-full p-2 mb-2">
            <div class="capitalize font-bold flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-white border-white border border-1.5">
                <img
                  class="w-full h-full object-cover rounded-full"
                  :src="message.imageURL"
                  :alt="'imagem de ' + message.user"
                />
              </div>
              {{ message.user }}
            </div>
            <p class="pl-10">{{ message.message }}</p>
            <p class="w-full text-lg sm:text-lg text-right">{{ message.date }}</p>
          </div>
          <div
            v-for="(response, index) in message.responses"
            :key="index"
            class="bg-gray-whats text-lg text-center rounded-xl p-2 mb-2 ml-2 sm:ml-10"
          >
            <div class="w-full capitalize font-bold flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-white border-white border border-1.5">
                <img
                  class="w-full h-full object-cover rounded-full"
                  :src="response.imageURL"
                  :alt="'imagem de ' + response.user"
                />
              </div>
              {{ response.user }}
            </div>
            <p class="pl-10 text-left">{{ response.message }}</p>
            <p class="w-full text-lg sm:text-lg text-right">{{ message.date }}</p>
          </div>
          <div class="flex mt-4 ml-2 sm:ml-10">
            <textArea
              id="response"
              :value="message.provisory"
              @input="updateResponse($event.target.value, message.id)"
              @keydown.enter.prevent="sendResponse(message.id)"
              placeholder="Responda a esta mensagem aqui"
              class="w-full bg-black text-white border border-white p-2 rounded text-lg"
            />
            <button
              type="button"
              class="border border-hard-dark-golden hover:border-white ml-1 py-0 w-10 px-2 bg-hard-dark-golden font-bold rounded h-10 flex items-center justify-center"
              @click="sendResponse(message.id)"
            >
              <FontAwesomeIcon :icon="['fa', 'paper-plane']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
import Loading from '@/components/loading.vue';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { authenticate } from '@/firebase/authenticate';
import { registerMessage, registerResponse } from '@/firebase/message';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'vue-router';
library.add(faPaperPlane );

export default {
  name: 'CommunityPage',
  components: {
    Footer,
    Loading,
    Navigation,
    FontAwesomeIcon,
  },
  data() {
    return {
      text: '',
      response: '',
      messages: [],
      showData: false,
    }
  },
  async mounted() {
    const firebaseConfig = {
      apiKey: "AIzaSyDnmfij0BzqhrXm4mysV7RNPXaeYEnVgcQ",
      authDomain: "valyrian-wars-1.firebaseapp.com",
      projectId: "valyrian-wars-1",
      storageBucket: "valyrian-wars-1.appspot.com",
      messagingSenderId: "719626971606",
      appId: "1:719626971606:web:85eac82dd4166fdbce5c77",
      measurementId: "G-FZM2Y82780"
    };
    const router = useRouter();
    const auth = await authenticate();
    if (auth) {
      this.showData = true;
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      onSnapshot(
        collection(db, 'community'),
        (snapshot) => {
          const messages = [];
          snapshot.forEach((doc) => messages.push({ id: doc.id, ...doc.data(), provisory: '' }));
          messages.sort((a, b) => {
            const parseDate = (str) => {
              const [time, date] = str.split(', ');
              const [hours, minutes, seconds] = time.split(':');
              const [day, month, year] = date.split('/');
              return new Date(year, month - 1, day, hours, minutes, seconds);
            };
            return parseDate(b.date) - parseDate(a.date);
          });
          this.messages = messages;
        }
      );
    } else router.push('/login');
  },
  methods: {
    updateText(dataText) {
      this.text = dataText;
    },
    updateResponse(dataText, id) {
      const provisory = this.messages.find((msg) => msg.id === id);
      const notprovisory = this.messages.filter((msg) => msg.id !== id);
      provisory.provisory = dataText;
      const list = [provisory, ...notprovisory];
      this.messages = list.sort((a, b) => {
        const parseDate = (str) => {
          const [time, date] = str.split(', ');
          const [hours, minutes, seconds] = time.split(':');
          const [day, month, year] = date.split('/');
          return new Date(year, month - 1, day, hours, minutes, seconds);
        };
        return parseDate(b.date) - parseDate(a.date);
      });
    },
    async sendMessage() {
      const auth = await authenticate();
      if (this.text !== '' && this.text !== ' ' && auth) {
        await registerMessage({
          message: this.text,
          user: auth,
        });
      }
      this.text = '';
    },
    async sendResponse(id) {
      const prov = this.messages.find((msg) => msg.id === id);
      const auth = await authenticate();
      if (prov.provisory !== '' && prov.provisory !== ' ' && auth) {
        await registerResponse({
          id,
          message: prov.provisory,
          user: auth,
        });
      }
    }
  },
}
</script>
<style>
  .font-sedan-sc {
    font-family: "Sedan SC", serif;
  }
</style>
