<template>
  <div class="break-words z-50 fixed top-0 left-0 w-full flex items-center justify-center bg-black/90 px-3 sm:px-0 h-screen">
    <div class="break-words w-full h-95vh flex flex-col justify-center items-center">
      <div class="break-words pt-4 sm:pt-3 px-3 w-full flex justify-end top-0 right-0 pb-2">
        <FontAwesomeIcon
          :icon="['fas', 'circle-xmark']"
          class="break-words text-3xl text-golden cursor-pointer duration-500 transition-colors absolute top-3 right-3"
          @click="hideLogout"
        />
      </div>
      <div class="px-2 pb-4 w-full h-full flex items-center justify-center">
        <img
          :src="image"
          class="h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>
  
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleXmark  } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCircleXmark);

export default {
  name: 'ZoomImage',
  components: {
    FontAwesomeIcon,
  },
  props: {
    link: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      image: '',
    }
  },
  async created() {
    this.image = this.link;
  },
  methods: {
    hideLogout() {
      this.name = '';
      this.$emit('zoom-image');
    }
  }
}
</script>
  