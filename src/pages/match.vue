<template>
  <Navigation />
  <div v-if="!showData" class="w-full h-screen flex items-center justify-center">
    <Loading />
  </div>
  <div v-else class="w-full min-h-screen items-center justify-center bg-black text-white px-4 p-2 lg:pt-5">
    <div class="w-full h-full">
      <p>timeTurn: {{ timeTurn }}</p>
      <div class="grid grid-cols-2 w-full">
        <div class="w-full">
          <div class="flex items-center justify-start gap-2 w-full mb-5">
            <img
            :src="userInviting.profileImage"
            class="w-20 h-20 object-cover rounded-full"
            />
            <div>
              <p>{{ userInviting.displayName }}</p>
              <p>Email: {{ userInviting.email }}</p>
            </div>
          </div>
          
          <img
          :src="userInviting.dragon.imageURL"
          class="w-full md:h-50vh md:w-30vw object-cover"
          />
          <p class="text-2xl">{{ userInviting.dragon.name }}</p>
          <div class="grid grid-cols-2 py-5">
            <p>Vitalidade: {{ userInviting.dragon.vitalidade.value }} ({{ userInviting.dragon.vitalidade.bonus }})</p>
            <p>Velocidade: {{ userInviting.dragon.velocidade.value }} ({{ userInviting.dragon.velocidade.bonus }})</p>
            <p>Rebeldia: {{ userInviting.dragon.rebeldia.value }} ({{ userInviting.dragon.rebeldia.bonus }})</p>
            <p>Dracarys: {{ userInviting.dragon.dracarys.value }} ({{ userInviting.dragon.dracarys.bonus }})</p>
            <p>Mordida: {{ userInviting.dragon.mordida.value }} ({{ userInviting.dragon.mordida.bonus }})</p>
            <p>Garras: {{ userInviting.dragon.garras.value }} ({{ userInviting.dragon.garras.bonus }})</p>
          </div>
          <p>Aparencia: {{ userInviting.dragon.aparencia }}</p>
        </div>
        <div class="w-full flex flex-col items-end">
          <div class="flex items-center justify-end gap-2 w-full mb-5">
            <div class="text-right">
              <p>{{ userInvited.displayName }}</p>
              <p>Email: {{ userInvited.email }}</p>
            </div>
            <img
              :src="userInvited.profileImage"
              class="w-20 h-20 object-cover rounded-full"
            />
          </div>
          <img
            :src="userInvited.dragon.imageURL"
            class="w-full md:h-50vh md:w-30vw object-cover"
          />
          <p class="text-2xl">{{ userInvited.dragon.name }}</p>
          <div class="grid grid-cols-2 py-5">
            <p>Vitalidade: {{ userInvited.dragon.vitalidade.value }} ({{ userInvited.dragon.vitalidade.bonus }})</p>
            <p>Velocidade: {{ userInvited.dragon.velocidade.value }} ({{ userInvited.dragon.velocidade.bonus }})</p>
            <p>Rebeldia: {{ userInvited.dragon.rebeldia.value }} ({{ userInvited.dragon.rebeldia.bonus }})</p>
            <p>Dracarys: {{ userInvited.dragon.dracarys.value }} ({{ userInvited.dragon.dracarys.bonus }})</p>
            <p>Mordida: {{ userInvited.dragon.mordida.value }} ({{ userInvited.dragon.mordida.bonus }})</p>
            <p>garras.value: {{ userInvited.dragon.garras.value }} ({{ userInvited.dragon.garras.bonus }})</p>
          </div>
          <p>Aparencia: {{ userInvited.dragon.aparencia }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { doc, getFirestore } from 'firebase/firestore';
  import { initializeApp } from 'firebase/app';
  import Navigation from '@/components/navigation.vue';
  import Loading from '@/components/loading.vue';
  import { onSnapshot } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  import { onUnmounted } from "vue";
  import { authenticate } from '@/firebase/authenticate';
  // import { getUserByEmail } from '@/firebase/user';
  export default {
    name: 'MatchPage',
    components: { Loading, Navigation },
    props: { battleId: { type: String, required: true } },
    data() {
      const router = useRouter();
      return {
        showData: false,
        router: router,
        matchId: router.currentRoute.value.params.battleId,
        type: '',
        timeTurn: '',
        userInvited: {
          email: '',
          profileImage: '',
          displayName: '',
          dragon: {
            id: '',
            name: '',
            vitalidade: { value: 0, bonus: 0 },
            velocidade: { value: 0, bonus: 0 },
            rebeldia: { value: 0, bonus: 0 },
            dracarys: { value: 0, bonus: 0 },
            mordida: { value: 0, bonus: 0 },
            garras: { value: 0, bonus: 0 },
            aparencia: '',
            description: '',
            imageURL: '',
            linkFont: '',
            nameFont: '',
          }
        }, 
        userInviting: {
          email: '',
          profileImage: '',
          displayName: '',
          dragon: {
            id: '',
            name: '',
            vitalidade: { value: 0, bonus: 0 },
            velocidade: { value: 0, bonus: 0 },
            rebeldia: { value: 0, bonus: 0 },
            dracarys: { value: 0, bonus: 0 },
            mordida: { value: 0, bonus: 0 },
            garras: { value: 0, bonus: 0 },
            aparencia: '',
            description: '',
            imageURL: '',
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
      const router = useRouter();
      const auth = await authenticate();
      if (auth) {
        // const userLogged = await getUserByEmail(auth.email);
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getFirestore(firebaseApp);
        const chatSnapShot = onSnapshot(
          doc(db, 'battles', this.matchId),
          async (snapshot) => {
            if (snapshot.data()) {
              const data = snapshot.data();
              this.type = data.type;
              this.timeTurn = data.timeTurn;
              this.userInvited = data.userInvited; 
              this.userInviting = data.userInviting; 
            }
          }
        );
        onUnmounted(chatSnapShot);
        this.showData = true;
      } else router.push("/login");
    },
    // async beforeCreate() {
    //   const auth = await authenticate();
    //   if (auth) {
    //     const match = await getMatchById(this.matchId);
    //     const userInvitedEmail = match.playersEmail.find((email) => email !== auth.email);
    //     const userInvited = await getUserByEmail(userInvitedEmail); 
    //     const userLogged = await getUserByEmail(auth.email);
    //     this.dataUserInvited = userInvited;
    //     this.dataUserLogged = userLogged;
    //   }
    // },
  }
</script>