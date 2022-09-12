<template>
  <button
    :class="
      color === 'no-pillar' ? `is-shade-600` : `is-${color} text-color-hover`
    "
    class="button is-outlined is-rounded nav-questionnaire-button previous"
    type="button"
    @click.prevent="goBack"
  >
    <i class="icon">
      <Icon size="16" name="arrow-left-line" />
    </i>
  </button>
</template>

<script setup lang="ts">
// NB : To use this component
//  set class `nav-questionnaire-container` to the container
//  and `questionnaire-container` to the container of the container
defineProps({
  color: { type: String, required: true },
})

const emit = defineEmits<{
  (e: "go-back"): void
}>()

function goBack() {
  emit("go-back")
}
</script>
