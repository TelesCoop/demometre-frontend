<template>
  <section>
    <div>
      <div
        :aria-expanded="isOpen"
        :aria-controls="`collapse${props.id}`"
        class="is-flex is-clickable is-justify-content-space-between"
        @click.prevent="toggleAccordion()"
      >
        <slot name="title"> </slot>
        <i class="icon">
          <Icon v-if="isOpen" size="24" name="arrow-down-s-line" />
          <Icon v-else size="24" name="arrow-right-s-line" />
        </i>
      </div>
    </div>
    <div v-show="isOpen" :id="`collapse${props.id}`">
      <div colspan="100%" class="mb-2">
        <slot name="content"> </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: Number, required: true },
})

const isOpen = ref<boolean>(false)
function toggleAccordion() {
  isOpen.value = !isOpen.value
}
</script>
