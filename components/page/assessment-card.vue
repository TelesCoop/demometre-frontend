<template>
  <div :class="`card has-background-${backgroundColor} is-fullheight`">
    <div class="card-content p-2">
      <div class="mb-1_5">
        <p class="is-size-4 has-text-shade-600 has-text-weight-bold">
          {{ props.assessmentType.title }}
        </p>
      </div>
      <div class="content">
        <div class="is-flex">
          <span class="icon"> <icon size="20" name="user" /> </span>
          <p class="is-family-secondary is-size-6 has-text-shade-600">
            {{ props.assessmentType.forWho }}
          </p>
        </div>
        <div class="is-flex">
          <span class="icon"> <icon size="20" name="file-text-line" /> </span>
          <p class="is-family-secondary is-size-6 has-text-shade-600">
            {{ props.assessmentType.what }}
          </p>
        </div>
        <div class="is-flex">
          <span class="icon"> <icon size="20" name="checkbox-line" /> </span>
          <p class="is-family-secondary is-size-6 has-text-shade-600">
            {{ props.assessmentType.forWhat }}
          </p>
        </div>
        <div class="is-flex">
          <span class="icon">
            <icon size="20" name="bar-chart-box-line" />
          </span>
          <p class="is-family-secondary is-size-6 has-text-shade-600">
            {{ props.assessmentType.results }}
          </p>
        </div>
        <div class="is-flex">
          <span class="icon">
            <icon size="20" name="money-euro-circle-line" />
          </span>
          <p class="is-family-secondary is-size-6 has-text-shade-600">
            {{ props.assessmentType.price }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  assessmentType: { type: Object, required: true },
  backgroundColor: { type: String, required: true },
})
</script>

<style scoped lang="sass"></style>
