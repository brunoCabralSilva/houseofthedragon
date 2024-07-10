<template>
  <Navigation />
  <div v-if="!showData" class="w-full h-screen flex items-center justify-center">
    <Loading />
  </div>
  <div v-else class="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center justify-center bg-black text-white px-4 p-2 lg:pt-5">
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 h-full">
      <swiper
        effect="cube"
        :modules="modules"
        :slides-per-view="2.5"
        :space-between="10"
        :cubeEffect="{
          shadow: true,
          slideShadows: true,
          shadowOffset: 28,
          shadowScale: 0.70,
        }"
        :noMousewheelClass="false"
        :allowTouchMove="false"
        :keyboard="{ enabled: false }"
        :pagination="{ el: '.swiper-pagination', clickable: false }"
        :loop="true"
        :autoplay="{ delay: 0, disableOnInteraction: false }"
        @swiper="onSwiper"
        class="w-full lg:w-40vw sm:h-full relative z-5"
      >
        <swiper-slide
          v-for="(dragon, index) in dragons"
          :key="index"
          class="flex flex-col items-center justify-center"
        >
          <img
            :src="dragon.imageURL"
            :alt="dragon.name"
            class="object-contain w-full lg:h-80vh"
          />
        </swiper-slide>
      </swiper>
      <div v-if="showDragonData" class="hidden sm:flex sm:flex-col lg:hidden sm:justify-center sm:items-center sm:h-full pl-4">
        <p class="py-5 text-3xl w-full">{{ dataDragon.name }}</p>
        <div class="w-full grid grid-cols-2 md:mt-4 mb-4 gap-3">
          <p>Vitalidade: {{ dataDragon.vitalidade }}</p>
          <p>Velocidade: {{ dataDragon.velocidade }}</p>
          <p>Rebeldia: {{ dataDragon.rebeldia }}</p>
          <p>Dracarys: {{ dataDragon.dracarys }}</p>
          <p>Mordida: {{ dataDragon.mordida }}</p>
          <p>Garras: {{ dataDragon.garras }}</p>
        </div>
      </div>
      <div v-else class="w-full h-full hidden sm:flex lg:hidden flex-col items-center justify-center lg:justify-center animate-pulse">
        <img
          :src="require('@/assets/targaryen-icon.png')"
          class="w-8 sm:w-16 object-contain z-20"
          alt="Emblema dourado da cara Targaryen"
        >
        <p class="text-xl sm:text-3xl mt-5 lg:mt-10 text-center lg:text-left">Escolhendo o seu oponente...</p>
      </div>
    </div>
    <div v-if="showDragonData" class="w-full h-full flex flex-col items-start justify-center sm:justify-start lg:justify-center text-white lg:pr-6">
      <p class="py-5 sm:py-0 text-2xl sm:text-3xl flex sm:hidden lg:flex">{{ dataDragon.name }}</p>
      <div class="w-full grid sm:hidden lg:grid grid-cols-2 sm:grid-cols-3 md:mt-4 mb-4">
        <p>Vitalidade: {{ dataDragon.vitalidade }}</p>
        <p>Velocidade: {{ dataDragon.velocidade }}</p>
        <p>Rebeldia: {{ dataDragon.rebeldia }}</p>
        <p>Dracarys: {{ dataDragon.dracarys }}</p>
        <p>Mordida: {{ dataDragon.mordida }}</p>
        <p>Garras: {{ dataDragon.garras }}</p>
      </div>
      <p>{{ dataDragon.description }}</p>
      <div class="w-full lg:w-20 flex items-center justify-center">
        <button
          type="button"
          @click="startGame"
          class="bg-hard-dark-golden px-4 py-2 font-bolder mt-6 mb-6 lg:mb-0 border-2 border-transparent hover:border-white rounded w-full flex items-center justify-center"
        >
          Iniciar
        </button>
      </div>
    </div>
    <div v-else class="w-full h-full flex sm:hidden lg:flex flex-col items-center justify-start lg:justify-center animate-pulse">
      <img
        :src="require('@/assets/targaryen-icon.png')"
        class="w-8 sm:w-16 object-contain z-20"
        alt="Emblema dourado da cara Targaryen"
      >
      <p class="text-xl sm:text-3xl mt-5 lg:mt-10 text-center lg:text-left">Escolhendo o seu oponente...</p>
    </div>
  </div>
  <Footer />
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import Footer from '@/components/footer.vue';
import { getDragonsWithVitalityNotOne } from '@/firebase/dragons';
import 'swiper/css';
import { ref, onMounted } from 'vue';
import { Autoplay, EffectCube } from 'swiper';
import Navigation from '@/components/navigationBattle.vue';
import Loading from '@/components/loading.vue';
import { useRouter } from 'vue-router';
import { authenticate } from '@/firebase/authenticate';
import { chooseIaDragon, verifyIaBattle } from '@/firebase/battleIa';

export default {
  name: 'ChoosingIaOponent',
  components: {
    Swiper,
    Footer,
    Loading,
    Navigation,
    SwiperSlide,
  },
  props: { battleId: { type: String, required: true } },
  setup(props) {
    const dragons = ref(null);
    const modules = [Autoplay, EffectCube];
    let swiperInstance = null;
    let autoplayComplete = false;
    let autoplayLoops = 0;
    const router = useRouter();
    const dataDragon = ref({
      name: '',
      vitalidade: '',
      velocidade: '',
      rebeldia: '',
      dracarys: '',
      mordida: '',
      garras: '',
      description: '',
    });

    const showDragonData = ref(false);
    const isAutoplaying = ref(true);
    const showData = ref(false);
    const onSwiper = (swiper) => swiperInstance = swiper;
    const autoplayCompleteEvent = () => {
      autoplayLoops++;
      if (autoplayLoops === 1) {
        autoplayComplete = true;
      }
    };

    const loadData = async () => {
      const dragonsData = await getDragonsWithVitalityNotOne();
      dragons.value = dragonsData.map((dragon, index) => ({
        ...dragon,
        position: index + 1,
      }));
      swiperInstance.on('autoplayStop', autoplayCompleteEvent);
    };

    const startGame = () => {
      router.push('/match/' + props.battleId);
    }

    onMounted(async () => {
      const auth = await authenticate();
      if (auth) {
        const verify = await verifyIaBattle(props.battleId);
        if (verify) router.push('/match/' + props.battleId);
        else {
          showData.value = true;
          loadData();
          const randomTimeout = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
          setTimeout(async () => {
            if (!autoplayComplete) {
              autoplayComplete = true;
              swiperInstance.autoplay.stop();
              const index = swiperInstance.realIndex;
              const selectedDragon = dragons.value[index];
              await chooseIaDragon(dragons.value[index], props.battleId);
              dataDragon.value = {
                name: selectedDragon.name,
                vitalidade: selectedDragon.vitalidade,
                velocidade: selectedDragon.velocidade,
                rebeldia: selectedDragon.rebeldia,
                dracarys: selectedDragon.dracarys,
                mordida: selectedDragon.mordida,
                garras: selectedDragon.garras,
                description: selectedDragon.description,
              };
              showDragonData.value = true;
            }
          }, randomTimeout);
        }
      } else {
        router.push('/login');
      }
    });
    return {
      onSwiper,
      dragons,
      modules,
      isAutoplaying,
      dataDragon,
      showDragonData,
      showData,
      startGame,
    };
  },
};
</script>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: white;
}

.swiper-pagination-bullet-active {
  background-color: white;
}
</style>
