<template>
  <div>
    <div
      v-for="(responseChoice, responseChoiceIndex) of data.value"
      :key="responseChoiceIndex"
      class="mb-1"
    >
      <ResponseChoice
        :response-choice="{
          id: responseChoiceIndex,
          responseChoice: responseChoice.label,
          description: '',
        }"
        :response-choice-index="parseInt(responseChoiceIndex)"
        :selected="responseChoice.value === 1"
        :color="color"
        response-choice-size="is-size-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: { type: Object, required: true },
  color: { type: String, required: true },
})
</script>

<style scoped lang="sass"></style>
