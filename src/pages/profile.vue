<template>
  <div :class="['min-h-screen', 'bg-black', 'flex', 'flex-col', 'justify-start', showData ? 'items-start' : 'items-start']">
    <Navigation />
    <div v-if="!showData" class="mt-20 w-full flex items-center justify-center">
      <Loading />
    </div>
    <div v-else class="flex flex-col items-center justify-start w-full text-white">
      <div class="w-28 h-28 mt-10">
        <img
          class="w-full h-full object-cover rounded-full border-2 border-golden"
          :src="user.imageURL"
          :alt="'imagem de ' + user.displayName"
        />
      </div>
      <p class="text-xl pt-5 capitalize">{{ user.displayName }}</p>
      <p class="text-sm">{{ user.nickname }}</p>
      <p class="mt-4 text-sm break-all text-center px-3">{{ user.email }}</p>
      <p
        @click="editProfile"
        class="mt-5 border border-white px-3 py-2 rounded cursor-pointer hover:border-golden hover:text-golden mb-10"
      >
        Editar Perfil
      </p>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
import { getUserByEmail } from '@/firebase/user';
import { authenticate } from '@/firebase/authenticate';
import { useRouter } from 'vue-router';
import Loading from '@/components/loading.vue';
export default {
  name: 'ProfilePage',
  components: {
    Footer,
    Loading,
    Navigation,
  },
  data() {
    const routerPage = useRouter();
    return {
      user: {
        id: '',
        displayName: '',
        nickname: '',
        email: '',
        imageURL: '',
      },
      showData: false,
      router: routerPage,
    }
  },
  async created() {
    const auth = await authenticate();
    if (auth) {
      const user = await getUserByEmail(auth.email);
      this.user = {
        id: user.id,
        email: user.email,
        imageURL: user.imageURL,
        nickname: user.nickname,
        displayName: user.firstName + ' ' + user.lastName,
      }
      this.showData = true;
    } else this.router.push('/login');
  },
  methods: {
    editProfile() {
      this.router.push('/edit-profile');
    },
  }
}
</script>
