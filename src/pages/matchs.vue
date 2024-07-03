<template>
    <Navigation />
    <div class="h-screen flex flex-col items-start justify-start bg-black text-white pt-5">
      <p>Nome do Usuário</p>
      <p>Procurar um oponente</p>
      <p>Duelo contra IA</p>
      <p>Número de combates</p>
      <p>Nível</p>
      <p>XP</p>
      <p>Dragões Evoluídos</p>
    </div>
    <Footer />
  </template>
  
  <script>
  import Navigation from '@/components/navigation.vue';
  import Footer from '@/components/footer.vue';
  export default {
    name: 'GamingPage',
    components: {
      Navigation,
      Footer,
    },
  }
  </script>
  