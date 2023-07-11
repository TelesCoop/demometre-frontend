<template>
  <div>
    <!-- <p>### {{ block.type }} ###</p> -->
    <ArticleContentBlockImage
      v-if="block.type == 'image'"
      :block="block"
    />
    <ArticleContentBlockPdf
      v-else-if="block.type == 'pdf'"
      :block="block"
    />
    <ArticleContentBlockSection
      v-else-if="block.type == 'section'"
      :block="block"
    />
    <ArticleContentBlockTitle
      v-else-if="block.type == 'heading'"
      :block="block"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Block } from "~/composables/types"

defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})
</script>
