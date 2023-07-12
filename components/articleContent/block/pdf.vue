<template>
  <div class="mt-3">
    <a
      :href="block.value.url"
      target="_blank"
      class="button is-primary"
    >
      <icon
        name="file-download-line"
        size="16"
        class="mr-0_5"
      />
      Télécharger : {{ block.value.title }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Block } from "~/composables/types"

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})
</script>
