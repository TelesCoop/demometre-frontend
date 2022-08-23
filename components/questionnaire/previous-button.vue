<template>
  <button
    class="button is-dark is-outlined is-rounded nav-questionnaire-button previous"
    type="button"
    @click.prevent="goBack"
  >
    <div>
      <i class="icon">
        <Icon size="16" name="arrow-left-line" class="mt-0_5" />
      </i>
    </div>
  </button>
</template>

<script setup lang="ts">
// NB : To use this component
//  set class `nav-questionnaire-container` to the container
//  and `questionnaire-container` to the container of the container
const emit = defineEmits<{
  (e: "go-back"): void
}>()

function goBack() {
  emit("go-back")
}
</script>
