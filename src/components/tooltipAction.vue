<template>
  <div
    v-if="tooltip.show"
    class="z-20 fixed left-0 bottom-20vh h-25vh w-full text-white text-sm rounded py-1 px-2 flex flex-col justify-center"
    :class="!hideMessages || !hideInfo ? 'items-end': 'items-center'"
  >
    <div class="bg-black/80 w-1/3 rounded px-2 h-full p-2">
      <p class="w-full pb-1">{{ tooltip.title }}</p>
      <hr />
      <p class="w-full pt-1 leading-4">{{ tooltip.description }}</p>
      <p v-if="tooltip.ataque !== ''" class="w-full pt-1 leading-4">
        {{ tooltip.ataque }}
      </p>
      <p v-if="tooltip.alcance !== ''" class="w-full pt-1 leading-4">
        {{ tooltip.alcance }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TooltipActions',
  components: { },
  computed: { ...mapState(['tooltip', 'hideMessages', 'hideInfo']) },
}
</script>
