<template>
  <div class="h-screen flex items-center justify-center bg-wallpaper bg-cover text-white">
    <div class="grid grid-cols-16 w-80rem grid-rows-7 h-35rem">
      <div v-for="index in 112" :key="index" :id="index" class="h-5rem w-5rem border border-transparent hover:border-white transition-colors duration-300">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapPage',
}
</script>
