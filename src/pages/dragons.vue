<template>
  <Navigation />
  <div class="min-h-screen flex flex-col justify-start items-center bg-black text-white pt-5 pr-5">
    <div v-if="isAdmin" class="w-full flex justify-end items-center cursor-pointer mb-4">
      <FontAwesomeIcon
        @click="createDragon"
        :icon="['fa', 'circle-plus']"
        class="text-3xl text-golden"
      />
    </div>
    <!-- <swiper -->
     <div
      :options="swiperOptions" class="w-full">
      <!-- <swiper-slide -->
       <div
        v-for="(dragon, index) in dragons"
        :key="index"
        class="border border-golden p-2 sm:p-6 my-2 w-full px-4 flex gap-6"
      >
        <img
          :src="dragon.imageURL"
          class="w-30vw h-50vh object-cover my-2"
        />
        <div class="flex flex-col justify-center">
          <div class="text-xl sm:text-3xl py-5 sm:py-0 font-sedan-sc break-all pr-4 leading-6 flex items-center justify-between">
            {{ dragon.name }}
            <div
              v-if="isAdmin"
              class="flex gap-3"
            >
              <FontAwesomeIcon
                @click="removeDragon(dragon.id)"
                :icon="['fas', 'trash']"
                class="text-2xl text-golden cursor-pointer"
              />
              <FontAwesomeIcon
                @click="editDragon(dragon.id)"
                :icon="['fas', 'pen-to-square']"
                class="text-2xl text-golden cursor-pointer"
              />
            </div>
          </div>
          <div class="grid grid-cols-3 my-4">
            <p>Vitalidade: {{ dragon.vitalidade }}</p>
            <p>Carapaça: {{ dragon.carapaca }}</p>
            <p>Velocidade: {{ dragon.velocidade }}</p>
            <p>Tamanho: {{ dragon.tamanho }}</p>
            <p>Ataque: {{ dragon.ataque }}</p>
            <p>Rebeldia: {{ dragon.rebeldia }}</p>
            <p>Dracarys: {{ dragon.dracarys }}</p>
            <p>Mordida: {{ dragon.mordida }}</p>
            <p>Garras: {{ dragon.garras }}</p>
            <!-- <p>Aparência: {{ dragon.aparencia }}</p> -->
          </div>
          <p class="break-words text-justify py-2">{{ dragon.description }}</p>
        </div>
      </div>
      <!-- </swiper-slide> -->
    <!-- </swiper> -->
    </div>
    <DeleteDragon
      v-if="deleteDragon.show"
      :id="deleteDragon.id"
      @delete-dragon="deleteDragon = { show: false, id: '' }"
    />
  </div>
  <Footer />
</template>

<script>
import Footer from '@/components/footer.vue';
import Navigation from '@/components/navigation.vue';
import DeleteDragon from '@/components/deleteDragon.vue';
import { useRouter } from 'vue-router';
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { authenticate } from '@/firebase/authenticate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash, faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { getAllDragons } from '@/firebase/dragons';
import 'swiper/swiper-bundle.css';
library.add(faTrash);
library.add(faCirclePlus);
library.add(faPenToSquare);

export default {
  name: 'NewsPage',
  components: {
    Footer,
    // Swiper,
    Navigation,
    // SwiperSlide,
    DeleteDragon,
    FontAwesomeIcon,
  },
  data() {
    const routerPage = useRouter();
    return {
      router: routerPage,
      showData: false,
      dragons: [],
      deleteDragon: { show: false, id: '' },
      isAdmin: false,
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        spaceBetween: 0,
      },
    }
  },
  async created() {
    const dragons = await getAllDragons();
    const sortedDragons = dragons.sort((a, b) => {
      const sumA = this.calculateTotalStats(a);
      const sumB = this.calculateTotalStats(b);
      return sumB - sumA;
    });
    this.dragons = sortedDragons;
    const auth = await authenticate();
    if (auth) {
      if (auth.email === 'bruno.cabral.silva2018@gmail.com') this.isAdmin = true;
    }
  },
  methods: {
    calculateTotalStats(dragon) {
      const { vitalidade, carapaca, velocidade, tamanho, ataque, rebeldia } = dragon;
      return vitalidade + carapaca + velocidade + tamanho + ataque + rebeldia;
    },
    removeDragon(idDragon) {
      this.deleteDragon = { show: true, id: idDragon };
    },
    createDragon() {
      this.router.push('/add-dragon');
    },
    editDragon(dragonId) {
      this.router.push('/editDragon/' + dragonId);
    }
  }
}
</script>