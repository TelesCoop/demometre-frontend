<template>
  <tr>
    <td
      :aria-expanded="isOpen"
      :aria-controls="`collapse${_uid}`"
      @click.prevent="toggleAccordion()"
    >
      <i class="icon">
        <Icon v-if="isOpen" size="24" name="arrow-down-s-line" />
        <Icon v-else size="24" name="arrow-right-s-line" />
      </i>
    </td>
    <slot name="title" />
  </tr>
  <tr v-show="isOpen" :id="`collapse${_uid}`">
    <td colspan="100%" class="px-3">
      <slot name="content" />
    </td>
  </tr>
</template>

<script setup lang="ts">
const isOpen = ref<boolean>(false)
function toggleAccordion() {
  isOpen.value = !isOpen.value
}
</script>
