<template>
  <Navigation />
  <div class="h-screen flex items-start justify-center bg-black text-white pt-5">
    News
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
export default {
  name: 'NewsPage',
  components: {
    Navigation,
    Footer,
  }
}
</script>
