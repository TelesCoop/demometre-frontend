<template>
  <div>
    <a
      :href="url"
      target="_blank"
    >ouvrir</a>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Block } from "~/composables/types"
import { useBackendUrl } from "~/composables/api"

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})
const url = `${useBackendUrl(false)}${props.block.value.url}`
</script>
