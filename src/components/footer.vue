<template>
  <footer className="relative text-white px-4 flex flex-col sm:flex-row justify-between items-center w-full py-2 z-5 bg-black">
    <div className="pl-0 sm:w-1/4 flex flex-row justify-center sm:justify-start my-4 sm:my-0">
      <img
        :src="require(`@/assets/targaryen-icon.png`)"
        class="w-8 sm:w-12 object-contain"
        alt="Emblema dourado da cara Targaryen"
      >
    </div>
    <div className="sm:w-3/4 text-sm">
      <p className="text-center sm:text-right w-full">© 2024 WarnerMedia Direct, LLC. Todos os direitos reservados.</p>
      <p
        @click="scrollToTop"
        className="pt-3 pb-2 sm:py-0 text-center sm:text-right w-full  text-golden hover:text-white hover:underline font-bold transition-colors duration-500 cursor-pointer"
      >
        Retornar ao Topo
      </p>
    </div>
  </footer>
</template>
  
<script>
export default {
  name: 'FooterComponent',
  methods: {
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>
  