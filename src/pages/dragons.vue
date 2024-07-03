<template>
  <Navigation />
  <div class="min-h-screen flex flex-col justify-start items-center bg-black text-white pt-5 px-2 md:pr-5">
    <div v-if="isAdmin" class="w-full flex justify-between items-center cursor-pointer mb-4">
      <label htmlFor="select-sort" class="pl-4">
        <span class="pl-1 sm:pl-0">Ordenar por:</span>
        <select
          id="select-sort"
          @change="sortDragons($event.target.value)"
          class="bg-black sm:pl-1"
        >
          <option value="sum">Soma dos Atributos</option>
          <option value="alf">Ordem alfabética</option>
          <option value="vitalidade">Vitalidade</option>
          <option value="velocidade">Velocidade</option>
          <option value="rebeldia">Rebeldia</option>
          <option value="dracarys">Dracarys</option>
          <option value="mordida">Mordida</option>
          <option value="garras">Garras</option>
        </select>
      </label>
      <FontAwesomeIcon
        @click="createDragon"
        :icon="['fa', 'circle-plus']"
        class="text-3xl text-golden"
      />
    </div>
     <div
      :options="swiperOptions" class="w-full">
       <div
        v-for="(dragon, index) in dragons"
        :key="index"
        class="border border-golden p-2 sm:p-6 mb-2 md:mb-0 md:my-2 w-full px-4 flex flex-col md:flex-row gap-6"
      >
        <div class="md:hidden text-xl sm:text-3xl pt-5 sm:py-0 font-sedan-sc break-all md:pr-4 leading-6 flex items-center justify-between">
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
        <img
          :src="dragon.imageURL"
          @click="showImage(dragon.imageURL)"
          class="w-full md:h-50vh md:w-30vw object-cover cursor-zoom-in"
        />
        <div class="flex flex-col justify-between items-start w-full">
          <div>
            <div class="text-xl sm:text-3xl py-5 sm:py-0 font-sedan-sc break-all leading-6 hidden md:flex items-center justify-between w-full">
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
            <div
              v-if="dragon.vitalidade !== 1"
              class="w-full grid grid-cols-2 sm:grid-cols-3 md:mt-4 mb-2"
            >
              <p>Vitalidade: {{ dragon.vitalidade }}</p>
              <p>Velocidade: {{ dragon.velocidade }}</p>
              <p>Rebeldia: {{ dragon.rebeldia }}</p>
              <p>Dracarys: {{ dragon.dracarys }}</p>
              <p>Mordida: {{ dragon.mordida }}</p>
              <p>Garras: {{ dragon.garras }}</p>
            </div>
            <div v-else>
              <p class="md:mt-4 mb-2 w-full">Indisponível no momento</p>
            </div>
            <p class="break-words text-left md:text-justify py-2">{{ dragon.description }}</p>
          </div>
          <div class="my-3 md:my-0">
            <span class="pr-1">Fonte da Imagem:</span>
            <a
              target="_blank"
              class="text-golden underline font-bold hover:text-blue-300 transition-colors duration-500"
              :href="dragon.linkFont"
            >
              {{ dragon.nameFont }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <DeleteDragon
      v-if="deleteDragon.show"
      :id="deleteDragon.id"
      @delete-dragon="deleteDragon = { show: false, id: '' }"
    />
    <ZoomImage
      v-if="zoomImage.show"
      :link="zoomImage.link"
      @zoom-image="zoomImage = { show: false, link: '' }"
    />
  </div>
  <Footer />
</template>

<script>
import Footer from '@/components/footer.vue';
import Navigation from '@/components/navigation.vue';
import DeleteDragon from '@/components/deleteDragon.vue';
import ZoomImage from '@/components/zoomImage.vue';
import { useRouter } from 'vue-router';
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
    Navigation,
    ZoomImage,
    DeleteDragon,
    FontAwesomeIcon,
  },
  data() {
    const routerPage = useRouter();
    return {
      router: routerPage,
      showData: false,
      dragons: [],
      zoomImage: { show: false, link: '' },
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
      if (sumB !== sumA) return sumB - sumA;
      else return b.vitalidade - a.vitalidade;
    });
    this.dragons = sortedDragons;
    const auth = await authenticate();
    if (auth) {
      if (auth.email === 'bruno.cabral.silva2018@gmail.com') this.isAdmin = true;
    }
  },
  methods: {
    showImage(linkImage) {
      this.zoomImage = { show: true, link: linkImage };
    },
    sortDragons(field) {
      if(field === 'alf') {
        const newOrder = this.dragons.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.dragons = newOrder;
      } else if (field === 'sum') {
        const sortedDragons = this.dragons.sort((a, b) => {
          const sumA = this.calculateTotalStats(a);
          const sumB = this.calculateTotalStats(b);
          if (sumB !== sumA) return sumB - sumA;
          else return b.vitalidade - a.vitalidade;
        });
        this.dragons = sortedDragons;
      } else {
        const newOrder = this.dragons.sort((a, b) => {
          if (a[field] < b[field]) return 1;
          if (a[field] > b[field]) return -1;
          if (a[field] === b[field]) {
            if (a.vitalidade < b.vitalidade) return 1;
            if (a.vitalidade > b.vitalidade) return -1;
          }
          return 0;
        });
        this.dragons = newOrder;
      }
    },
    calculateTotalStats(dragon) {
      const { vitalidade, velocidade, dracarys, mordida, garras } = dragon;
      return vitalidade + velocidade + dracarys + mordida + garras;
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