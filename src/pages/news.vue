<template>
  <Navigation />
  <div class="min-h-screen flex flex-col justify-start items-center bg-black text-white pt-5 pr-5">
    <div v-if="isAdmin" class="w-full flex justify-end items-center cursor-pointer mb-4">
      <FontAwesomeIcon
        @click="createNews"
        :icon="['fa', 'circle-plus']"
        class="text-3xl text-golden"
      />
    </div>
    <div class="w-full">
      <div
        v-for="(newPub, index) in news"
        :key="index"
        class="border border-golden p-2 sm:p-10 my-2 w-full px-4"
      >
        <p class="text-xl sm:text-3xl py-5 sm:py-0 font-sedan-sc break-all pr-4 leading-6">
          {{ newPub.title }}
        </p>
        <img
          :src="newPub.imageURL"
          class="w-full h-40vh object-cover my-2 "
        />
        <div
          v-for="(text, index) in newPub.texts"
          :key="index"
          class=""
        >
          <p class="break-all py-2">{{ text.text }}</p>
        </div>
        <div class="text-golden flex justify-end items-center">
          <p>{{ newPub.displayName }}, {{newPub.date }}.</p>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
import { authenticate } from '@/firebase/authenticate';
import { useRouter } from 'vue-router';
import { getAllNews } from '@/firebase/news'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCirclePlus  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faCirclePlus );

export default {
  name: 'NewsPage',
  components: {
    Navigation,
    Footer,
    FontAwesomeIcon,
  },
  data() {
    const routerPage = useRouter();
    return {
      router: routerPage,
      showData: false,
      news: [],
      isAdmin: false,
    }
  },
  async created() {
    const news = await getAllNews();
    this.news = news;
    const auth = await authenticate();
    if (auth) {
      if (auth.email === 'bruno.cabral.silva2018@gmail.com') this.isAdmin = true;
    }
  },
  methods: {
    createNews() {
      this.router.push('/create-news');
    }
  }
}
</script>
