<template>
  <div>
    <span class="rich-text" v-html="props.richText"></span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  richText: { type: String, default: "" },
})
</script>

<style scoped lang="sass">
.rich-text :deep(ol)
  margin-left: 1.5rem
.rich-text :deep(ul)
  margin-left: 1.5rem
  list-style-type: inherit
.rich-text :deep(li)
  margin-bottom: 4px
.rich-text :deep(p)
  padding-bottom: 6px
</style>
