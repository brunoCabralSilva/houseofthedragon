<template>
  <Navigation />
  <div class="min-h-screen flex flex-col items-start justify-start bg-black text-white pt-5">
    <div v-if="!showData" class="pt-20 w-full flex items-start justify-center bg-black">
      <Loading />
    </div>
    <div v-else class="px-2 sm:px-5 w-full">
      <p class="text-3xl">{{ user.nickname }}</p>
      <div class="w-full h-2 border border-golden rounded my-2">
        <div class="bg-golden w-1/2 h-full rounded"></div>
      </div>
      <p>Nível 1 (10/100)</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 w-full">
        <div class="flex flex-col sm:col-span-2 sm:grid sm:grid-cols-2 w-full mt-5"> 
          <div>
            <p class="text-light-golden text-xl">Duelos contra IA</p>
            <div class="flex gap-3">
              <div class="flex gap-1 items-center justify-start">
                <p>Vitórias:</p>
                <p class="text-light-golden font-bold text-xl">{{ 65 }}</p>
              </div>
              <div class="flex gap-1 items-center justify-start">
                <span>Derrotas:</span>
                <span class="text-light-golden font-bold text-xl">{{ 65 }}</span>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-0">
            <p class="text-light-golden text-xl">PVP</p>
            <div class="flex gap-3">
              <div class="flex gap-1 items-center justify-start">
                <p>Vitórias:</p>
                <p class="text-light-golden font-bold text-xl">{{ 65 }}</p>
              </div>
              <div class="flex gap-1 items-center justify-start">
                <span>Derrotas:</span>
                <span class="text-light-golden font-bold text-xl">{{ 65 }}</span>
              </div>
            </div>
          </div>
          <div class="selected" />
          <div class="col-span-2 flex flex-col py-5 sm:py-10 w-full">
            <div class="w-full">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full ">
                <img :src="dragons[0].imageURL" :alt="dragons[0].name" class="w-full sm:w-28 sm:h-28 object-cover rounded border-2 border-golden sm:mr-3" />
                <div class="flex flex-col">
                  <p class="text-xl text-light-golden">{{ dragons[0].name }} (Selecionado)</p>
                  <span class="text-normal sm:text-sm text-light-golden">nível 1</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 text-normal sm:text-sm w-full">
                    <div class="pr-5 flex gap-2 items-center">
                      <span>Velocidade: {{ dragons[0].velocidade }}</span>
                      <span class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ 20 }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Dracarys: {{ dragons[0].dracarys }}</span>
                      <span class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ 20 }}
                      </span>
                    </div>
                    <div class="pr-5 flex gap-2 items-center">
                      <span>Velocidade: {{ dragons[0].velocidade }}</span>
                      <span class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ 20 }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Mordida: {{ dragons[0].mordida }}</span>
                      <span class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ 20 }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Rebeldia: {{ dragons[0].rebeldia }}</span>
                      <span class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ 20 }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Garras: {{ dragons[0].garras }}</span>
                      <span class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ 20 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1 md:w-full flex flex-col items-end justify-start">
          <button
            type="button"
            class="bg-golden text-black font-bold px-4 py-2 font-bolder sm:my-6 my-2 lg:mb-0 border-2 border-transparent hover:border-white rounded flex items-center justify-center w-full sm:w-1/2"
          >
            Buscar Oponente
          </button>
          <button
            type="button"
            class="bg-golden text-black font-bold px-4 py-2 font-bolder sm:my-6 my-2 lg:mb-0 border-2 border-transparent hover:border-white rounded flex items-center justify-center w-full sm:w-1/2"
          >
            Batalhar contra IA
          </button>
        </div>
      </div>
      <div class="w-full text-xl text-light-golden mt-5 sm:mt-0">
        Seus Dragões
        <FontAwesomeIcon
          :icon="['fas', 'chevron-right']"
          class="text-sm animate-pulse-1"
        />
        <FontAwesomeIcon
          :icon="['fas', 'chevron-right']"
          class="text-sm animate-pulse-2"
        />
        <FontAwesomeIcon
          :icon="['fas', 'chevron-right']"
          class="text-sm animate-pulse-3"
        />
      </div>
      <swiper
        :loop="true"
        class="w-full mt-5 flex"
        :breakpoints="{
          1: {
            slidesPerView: 1.2,
            spaceBetween: 5
          },
          355: {
            slidesPerView: 1.6,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 5
          },
          800: {
            slidesPerView: 2.1,
            spaceBetween: 10
          },
        }"
      >
        <swiper-slide v-for="(dragon, index) in dragons" :key="index" class="flex flex-col p-4 w-full border border-golden rounded cursor-pointer relative">
          <div class="w-full">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <img
                :src="dragon.imageURL"
                :alt="dragon.name"
                class="w-full sm:w-28 sm:h-28 object-cover rounded border-2 border-golden mr-3"
              />
              <div class="flex flex-col">
                <div class="text-xl text-light-golden flex items-center justify-between gap-1 w-full">
                  <p>{{ dragon.name }}</p>
                  <div
                    @click="scrollToSelected"
                    class="flex items-center justify-center p-2 bg-golden text-black rounded-full w-8 h-8 sm:absolute top-3 right-3 hover:bg-dark-golden hover:text-white border-2 border-golden hover:border-white transition-colors duration-500"
                  >
                    <FontAwesomeIcon :icon="['fas', 'check']" />
                  </div>
                </div>
                <span class="text-sm text-light-golden">nível 1</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 text-sm w-full">
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Velocidade: {{ dragon.velocidade }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Dracarys: {{ dragon.dracarys }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Velocidade: {{ dragon.velocidade }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Mordida: {{ dragon.mordida }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Rebeldia: {{ dragon.rebeldia }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Garras: {{ dragon.garras }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="w-full text-xl text-light-golden mt-5">
        Dragões Desbloqueados
        <FontAwesomeIcon
          :icon="['fas', 'chevron-right']"
          class="text-sm animate-pulse-1"
        />
        <FontAwesomeIcon
          :icon="['fas', 'chevron-right']"
          class="text-sm animate-pulse-2"
        />
        <FontAwesomeIcon
          :icon="['fas', 'chevron-right']"
          class="text-sm animate-pulse-3"
        />
      </div>
      <swiper
        :loop="true"
        class="w-full my-5 flex"
        :breakpoints="{
          1: {
            slidesPerView: 1.2,
            spaceBetween: 5
          },
          355: {
            slidesPerView: 1.6,
            spaceBetween: 10
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 5
          },
          800: {
            slidesPerView: 2.1,
            spaceBetween: 10
          },
        }"
      >
        <swiper-slide v-for="(dragon, index) in dragons" :key="index" class="flex flex-col p-4 w-full border border-golden rounded cursor-pointer">
          <div class="w-full">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <img
                :src="dragon.imageURL"
                :alt="dragon.name"
                class="w-full sm:w-28 sm:h-28 object-cover rounded border-2 border-golden mr-3"
              />
              <div class="flex flex-col">
                <div class="text-xl text-light-golden flex items-center justify-between gap-1 w-full">
                  <p>{{ dragon.name }}</p>
                  <div
                    @click="scrollToSelected"
                    class="flex items-center justify-center p-2 bg-golden text-black rounded-full w-8 h-8 sm:absolute top-3 right-3 hover:bg-dark-golden hover:text-white border-2 border-golden hover:border-white transition-colors duration-500"
                  >
                    <FontAwesomeIcon :icon="['fas', 'check']" />
                  </div>
                </div>
                <span class="text-sm text-light-golden">nível 1</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 text-sm w-full">
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Velocidade: {{ dragon.velocidade }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Dracarys: {{ dragon.dracarys }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Velocidade: {{ dragon.velocidade }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Mordida: {{ dragon.mordida }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Rebeldia: {{ dragon.rebeldia }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Garras: {{ dragon.garras }}</span>
                    <span class="text-light-golden text-sm">
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ 20 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
import { useRouter } from 'vue-router';
import { authenticate } from '@/firebase/authenticate';
import Loading from '@/components/loading.vue';
import { getUserByEmail } from '@/firebase/user';
import { getDragonsWithVitalityNotOne } from '@/firebase/dragons';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUp, faChevronRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faArrowUp);
library.add(faChevronRight);
library.add(faCheck);
import 'swiper/css';

export default {
  name: 'GamingPage',
  components: {
    Swiper,
    SwiperSlide,
    Navigation,
    Footer,
    Loading,
    FontAwesomeIcon,
  },
  data() {
    return {
      showData: false,
      dragons: [ { imageURL: '' }],
      user: {
        nickname: '',
      },
    };
  },
  async created() {
    const router = useRouter();
    const auth = await authenticate();
    if (auth) {
      this.showData = true;
      const user = await getUserByEmail(auth.email);
      this.user = user;
      const dragons = await getDragonsWithVitalityNotOne();
      this.dragons = dragons;
    } else {
      router.push('/login');
    }
  },
  methods: {
  scrollToSelected() {
    const selectedElement = document.querySelector('.selected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
};
</script>
