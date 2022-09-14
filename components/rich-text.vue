<template>
  <div>
    <span v-links-in-new-window class="rich-text" v-html="richText"></span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  richText: { type: String, default: "" },
})
const vLinksInNewWindow = {
  mounted: (el) => {
    const anchors = el.querySelectorAll("a")
    anchors.forEach((anchor) => (anchor.target = "_blank"))
  },
}
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
