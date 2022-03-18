<template>
  <div class="open">
    <label class="is-size-6bis mb-3 is-block has-text-grey">
      Réponse ouverte
    </label>
    <textarea
      class="textarea has-text-grey-dark"
      :class="`has-background-${props.color}-light has-border-${props.color}-dark`"
      rows="12"
      placeholder="..."
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: { type: String, required: true },
})
</script>

<style scoped lang="sass">
.open
  margin-right: 85px
  margin-left: 85px
</style>
