<template>
  <Navigation />
  <div v-if="!showData" class="w-full h-screen flex items-center justify-center">
    <Loading />
  </div>
  <div v-else class="w-full min-h-screen grid grid-cols-1 lg:grid-cols-11 items-center justify-center bg-black text-white">
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 h-full col-span-5">
      <div class="w-full h-full relative z-5 flex items-center justify-center">
        <div class="items-center justify-center relative">
          <p class="w-full text-center pb-5 text-golden text-4xl">{{ challengerUser.dragon.name }}</p>
          <img
            :src="challengerUser.dragon.imageURL"
            :alt="challengerUser.dragon.name"
            class="object-contain w-full h-full rounded-full border-4 border-golden aspect-square mb-10"
            />
            <div class="absolute bottom-0 right-0 flex flex-col items-center justify-center">
              <img
                :src="challengerUser.profileImage"
                :alt="challengerUser.displayName"
                class="object-contain w-28 rounded-full border-4 border-golden"
              />
              <div class="">{{ challengerUser.displayName }}</div>
            </div>
        </div>
      </div>
    </div>
    <div class="w-full h-full flex items-center justify-center text-5xl text-golden">
      x
    </div>
    <div v-if="challengedUser.dragon.name !== ''" class="col-span-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 h-full">
      <div class="w-full h-full relative z-5 flex items-center justify-center">
        <div class="items-center justify-center relative">
          <p class="w-full text-center pb-5 text-golden text-4xl">{{ challengedUser.dragon.name }}</p>
          <img
            :src="challengedUser.dragon.imageURL"
            :alt="challengedUser.dragon.name"
            class="object-contain w-full h-full rounded-full border-4 border-golden aspect-square mb-10"
            />
            <div class="absolute bottom-0 left-0 flex flex-col items-center justify-center">
              <img
                :src="challengedUser.profileImage"
                :alt="challengedUser.displayName"
                class="object-contain w-28 rounded-full border-4 border-golden"
              />
              <div class="">{{ challengedUser.displayName }}</div>
            </div>
        </div>
      </div>
    </div>
    <div v-else class="col-span-5 w-full h-full flex flex-col items-center justify-center lg:justify-center animate-pulse">
      <img
        :src="require('@/assets/targaryen-icon.png')"
        class="w-8 sm:w-16 object-contain z-20"
        alt="Emblema dourado da casa Targaryen"
      >
      <p class="text-xl sm:text-3xl mt-5 lg:mt-10 text-center lg:text-left">Escolhendo o seu oponente...</p>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigationBattle.vue';
import Footer from '@/components/footer.vue';
import { useRouter } from 'vue-router';
import { authenticate } from '@/firebase/authenticate';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { onUnmounted } from 'vue';
import Loading from '@/components/loading.vue';

export default {
name: 'GamingPage',
components: {
  Navigation,
  Loading,
  Footer,
},
data() {
  const routerPage = useRouter();
  return {
    showData: false,
    route: routerPage,
    matchId: routerPage.currentRoute.value.params.battleId,
    challengerUser: {
      email: '',
      profileImage: '',
      displayName: '',
      dragon: {
        id: '',
        name: '',
        vitalidade: { actual: 0, total: 0, bonus: 0 },
        velocidade: { actual: 0, total: 0, bonus: 0 },
        rebeldia: { actual: 0, total: 0, bonus: 0 },
        imageURL: '',
        imageIconURL: '',
        linkFont: '',
        nameFont: '',
      }
    },
    challengedUser: {
      email: '',
      profileImage: '',
      displayName: '',
      dragon: {
        id: '',
        name: '',
        vitalidade: { actual: 0, total: 0, bonus: 0 },
        velocidade: { actual: 0, total: 0, bonus: 0 },
        rebeldia: { actual: 0, total: 0, bonus: 0 },
        imageURL: '',
        imageIconURL: '',
        linkFont: '',
        nameFont: '',
      }
    },
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

  const auth = await authenticate();
  if (auth) {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatSnapShot = onSnapshot(
      doc(db, 'battles', this.matchId),
      async (snapshot) => {
        const data = snapshot.data();
        if (data) {
          if (data.end.find((dataEnd) => dataEnd === auth.email)) {
            this.route.push('/match/' + this.matchId);
          } else {
            this.ready = data.ready;
            const challengerUser = data.users.find((user) => user.email === data.userTurn);
            const challengedUser = data.users.find((user) => user.email !== data.userTurn);
            this.challengerUser = challengerUser;
            if (challengedUser) this.challengedUser = challengedUser;
            if (data.users.length === 2) this.route.push('/match/' + this.matchId);
          }
        }
      }
    );
    onUnmounted(chatSnapShot);
    this.showData = true;
  } else {
    this.route.push("/login");
  }
},
}
</script>
