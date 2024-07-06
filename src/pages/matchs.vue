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
                <p class="text-light-golden font-bold text-xl">{{ winsIA }}</p>
              </div>
              <div class="flex gap-1 items-center justify-start">
                <span>Derrotas:</span>
                <span class="text-light-golden font-bold text-xl">{{ lossesIA }}</span>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-0">
            <p class="text-light-golden text-xl">PVP</p>
            <div class="flex gap-3">
              <div class="flex gap-1 items-center justify-start">
                <p>Vitórias:</p>
                <p class="text-light-golden font-bold text-xl">{{ winsPVP }}</p>
              </div>
              <div class="flex gap-1 items-center justify-start">
                <span>Derrotas:</span>
                <span class="text-light-golden font-bold text-xl">{{ lossesPVP }}</span>
              </div>
            </div>
          </div>
          <div class="selected" />
          <div class="col-span-2 flex flex-col py-5 sm:py-10 w-full">
            <div class="w-full">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full ">
                <img :src="selectedDragon.data.imageURL" :alt="selectedDragon.name" class="w-full sm:w-28 sm:h-28 object-cover rounded border-2 border-golden sm:mr-3" />
                <div class="flex flex-col">
                  <p class="text-xl text-light-golden">{{ selectedDragon.name }} (Selecionado)</p>
                  <span class="text-normal sm:text-sm text-light-golden">nível 1</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 text-normal sm:text-sm w-full">
                    <div class="pr-5 flex gap-2 items-center">
                      <span>vitalidade: {{ selectedDragon.data.vitalidade.value }}</span>
                      <span 
                        v-if="selectedDragon.data.vitalidade.bonus > 0"
                        class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ selectedDragon.data.vitalidade.bonus }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Dracarys: {{ selectedDragon.data.dracarys.value }}</span>
                      <span 
                        v-if="selectedDragon.data.dracarys.bonus > 0"
                        class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ selectedDragon.data.dracarys.bonus }}
                      </span>
                    </div>
                    <div class="pr-5 flex gap-2 items-center">
                      <span>Velocidade: {{ selectedDragon.data.velocidade.value }}</span>
                      <span 
                        v-if="selectedDragon.data.velocidade.bonus > 0"
                        class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ selectedDragon.data.velocidade.bonus }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Mordida: {{ selectedDragon.data.mordida.value }}</span>
                      <span 
                        v-if="selectedDragon.data.mordida.bonus > 0"
                        class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ selectedDragon.data.mordida.bonus }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Rebeldia: {{ selectedDragon.data.rebeldia.value }}</span>
                      <span 
                        v-if="selectedDragon.data.rebeldia.bonus > 0"
                        class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ selectedDragon.data.rebeldia.bonus }}
                      </span>
                    </div>
                    <div class="flex gap-2 items-center">
                      <span>Garras: {{ selectedDragon.data.garras.value }}</span>
                      <span 
                        v-if="selectedDragon.data.garras.bonus > 0"
                        class="text-light-golden text-normal sm:text-sm">
                        <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                        {{ selectedDragon.data.garras.bonus }}
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
            @click="startGame"
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
        :loop="mounts.length > 1"
        direction="horizontal"
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
            slidesPerView: 1.4,
            spaceBetween: 5
          },
          740: {
            slidesPerView: 1.7,
            spaceBetween: 5
          },
          1000: {
            slidesPerView: 2.3,
            spaceBetween: 10
          },
        }"
      >
        <swiper-slide v-for="(dragon, index) in mounts" :key="index" class="flex flex-col pl-4 py-4 w-full border border-golden rounded cursor-pointer relative">
          <div class="w-full">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <img
                :src="dragon.data.imageURL"
                :alt="dragon.name"
                class="w-full sm:w-28 sm:h-28 object-cover rounded border-2 border-golden mr-3"
              />
              <div class="flex flex-col">
                <div class="text-xl text-light-golden flex items-center justify-between gap-1 w-full">
                  <p>{{ dragon.name }}</p>
                  <div
                    v-if="dragon.selected"
                    class="flex items-center justify-center p-2 text-golden rounded-full w-8 h-8 sm:absolute top-3 right-3 transition-colors duration-500"
                  >
                    <FontAwesomeIcon :icon="['fas', 'check']" />
                  </div>
                  <div
                    v-else
                    @click="scrollToSelected(dragon)"
                    class="flex items-center justify-center p-2 bg-black hover:bg-white text-golden rounded-full w-8 h-8 sm:absolute top-3 right-3 hover:text-dark-golden transition-colors duration-500"
                  >
                    <FontAwesomeIcon :icon="['fa', 'circle-plus']" class="text-3xl" />
                  </div>
                </div>
                <span class="text-sm text-light-golden">nível 1</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 text-sm w-full">
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Vitalidade: {{ dragon.data.vitalidade.value }}</span>
                    <span
                      v-if="dragon.data.vitalidade.bonus !== 0"
                      class="text-light-golden text-sm"
                    >
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ dragon.data.vitalidade.bonus }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Dracarys: {{ dragon.data.dracarys.value }}</span>
                    <span
                      v-if="dragon.data.dracarys.bonus !== 0"
                      class="text-light-golden text-sm"
                    >
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ dragon.data.dracarys.bonus }}
                    </span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Velocidade: {{ dragon.data.velocidade.value }}</span>
                    <span
                      v-if="dragon.data.velocidade.bonus !== 0"
                      class="text-light-golden text-sm"
                    >
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ dragon.data.velocidade.bonus }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Mordida: {{ dragon.data.mordida.value }}</span>
                    <span
                      v-if="dragon.data.mordida.bonus !== 0"
                      class="text-light-golden text-sm"
                    >
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ dragon.data.mordida.bonus }}
                    </span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Rebeldia: {{ dragon.data.rebeldia.value }}</span>
                    <span
                      v-if="dragon.data.rebeldia.bonus !== 0"
                      class="text-light-golden text-sm"
                    >
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ dragon.data.rebeldia.bonus }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Garras: {{ dragon.data.garras.value }}</span>
                    <span
                      v-if="dragon.data.garras.bonus !== 0"
                      class="text-light-golden text-sm"
                    >
                      <FontAwesomeIcon :icon="['fas', 'arrow-up']" class="text-xs" />
                      {{ dragon.data.garras.bonus }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="w-full text-xl text-light-golden mt-5">
        Dragões Bloqueados
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
            slidesPerView: 1.4,
            spaceBetween: 5
          },
          740: {
            slidesPerView: 1.7,
            spaceBetween: 5
          },
          1000: {
            slidesPerView: 2.3,
            spaceBetween: 10
          },
        }"
      >
        <swiper-slide v-for="(dragon, index) in dragons" :key="index" class="flex flex-col pl-4 py-4 w-full border border-golden rounded cursor-pointer">
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
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 text-sm w-full">
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Vitalidade: {{ dragon.vitalidade }}</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Dracarys: {{ dragon.dracarys }}</span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Velocidade: {{ dragon.velocidade }}</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Mordida: {{ dragon.mordida }}</span>
                  </div>
                  <div class="pr-5 flex gap-2 items-center">
                    <span>Rebeldia: {{ dragon.rebeldia }}</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <span>Garras: {{ dragon.garras }}</span>
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
import { changeSelectedDragon, getMountsByEmail } from '@/firebase/mount';
import { createIaBattle } from '@/firebase/battle';
import { getDragonsWithVitalityNotOne } from '@/firebase/dragons';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUp, faChevronRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faArrowUp);
library.add(faChevronRight);
library.add(faCheck);
import 'swiper/css';

const objectDragon = {
  email: '',
  dragonId: '',
  name: '',
  data: {
    vitalidade: { value: 0, bonus: 0 },
    velocidade: { value: 0, bonus: 0 },
    rebeldia: { value: 0, bonus: 0 },
    dracarys: { value: 0, bonus: 0 },
    mordida: { value: 0, bonus: 0 },
    garras: { value: 0, bonus: 0 },
    imageURL: '',
    nameFont: '',
    linkFont: '',
    aparencia: '',
    description: '',
  },
}

export default {
  name: 'MatchsPage',
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
      router: useRouter(),
      email: '',
      profileImage: '',
      displayName: '',
      winsIA: 0,
      winsPVP: 0,
      lossesIA: 0,
      lossesPVP: 0,
      selectedDragon: objectDragon,
      showData: false,
      mounts: [ objectDragon ],
      dragons: [ { imageURL: '' }],
      user: { value: 0, bonus: 0 },
      nickname: '',
    }
  },
  async created() {
    const router = useRouter();
    const auth = await authenticate();
    if (auth) {
      this.showData = true;
      this.email = auth.email;
      const user = await getUserByEmail(auth.email);
      this.profileImage = user.imageURL;
      this.displayName = user.firstName + ' ' + user.lastName;
      const mounts = await getMountsByEmail(auth.email);
      this.mounts = mounts.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      this.selectedDragon = mounts.find((mount) => mount.selected === true);
      const totals = this.mounts.reduce((acc, mount) => {
        acc.winsIA += mount.winsIA;
        acc.winsPVP += mount.winsPVP;
        acc.lossesPVP += mount.lossesPVP;
        acc.lossesIA += mount.lossesIA;
        return acc;
      }, { winsIA: 0, winsPVP: 0, lossesPVP: 0, lossesIA: 0 });

      this.winsIA = totals.winsIA;
      this.winsPVP = totals.winsPVP;
      this.lossesPVP = totals.lossesPVP;
      this.lossesIA = totals.lossesIA;

      this.user = user;
      const dragons = await getDragonsWithVitalityNotOne();
      const mountNames = this.mounts.map(mount => mount.name);
      this.dragons = dragons
        .filter(dragon => !mountNames.includes(dragon.name))
        .sort((a, b) => {
          const sumA = this.calculateTotalStats(a);
          const sumB = this.calculateTotalStats(b);
          if (sumB !== sumA) return sumA - sumB;
          else return b.vitalidade - a.vitalidade;
        });
    } else router.push('/login');
  },
  methods: {
    async startGame() {
      const battleId = await createIaBattle(
        'ia',
        this.email,
        this.displayName,
        this.profileImage,
        this.selectedDragon,
      );
      this.router.push('/choosing-ia-dragon/' + battleId);
    },
    calculateTotalStats(dragon) {
      const { vitalidade, velocidade, dracarys, mordida, garras } = dragon;
      return vitalidade + velocidade + dracarys + mordida + garras;
    },
    async scrollToSelected(dataDragon) {
      await changeSelectedDragon(this.email, dataDragon.name);
      dataDragon.selected = true;
      this.selectedDragon = dataDragon;
      const mounts = this.mounts.filter((mount) => mount.name !== dataDragon.name);
      const mountsNotSelected = mounts.map((mount) => {
        return { ...mount, selected: false }
      });

      const updatedMounts = [ dataDragon, ...mountsNotSelected ];
      this.mounts = updatedMounts.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      
      const mountNames = this.mounts.map(mount => mount.name);
      this.dragons = this.dragons
      .filter(dragon => !mountNames.includes(dragon.name))
      .sort((a, b) => {
        const sumA = this.calculateTotalStats(a);
        const sumB = this.calculateTotalStats(b);
        if (sumB !== sumA) return sumA - sumB;
        else return b.vitalidade - a.vitalidade;
      });

      const selectedElement = document.querySelector('.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
};
</script>
