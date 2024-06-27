<template>
  <Navigation />
  <div class="h-screen flex items-center justify-center">
    Home
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
export default {
  name: 'HomePage',
  components: {
    Navigation,
    Footer,
  }
}
</script>
