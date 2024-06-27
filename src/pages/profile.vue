<template>
  <Navigation />
  <div class="h-screen flex items-center justify-center">
    Profile
  </div>
  <Footer />
</template>

<script>
import Navigation from '@/components/navigation.vue';
import Footer from '@/components/footer.vue';
export default {
  name: 'ProfilePage',
  components: {
    Navigation,
    Footer,
  }
}
</script>
