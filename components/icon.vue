<!-- regex
\s+<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="(.*)"/></svg>
\n    <template v-else-if="props.name === ''">
      <path
        :fill="props.color"
        d="$1"
      />
    </template>
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="props.size"
    :height="props.size"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <template v-if="props.name === 'mail-line'">
      <path
        :fill="props.color"
        d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"
      />
    </template>
    <template v-else-if="props.name === 'lock-line'">
      <path
        :fill="props.color"
        d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z"
      />
    </template>
    <template v-else-if="props.name === 'arrow-right-line'">
      <path
        :fill="props.color"
        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      />
    </template>
    <template v-else-if="props.name === 'chat-4'">
      <path
        :fill="props.color"
        d="M5.763 17H20V5H4v13.385L5.763 17zm.692 2L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455z"
      />
    </template>
    <template v-else-if="props.name === 'bar-chart-box'">
      <path
        :fill="props.color"
        d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm3 8h2v4H7v-4zm4-6h2v10h-2V7zm4 3h2v7h-2v-7z"
      />
    </template>
    <template v-else-if="props.name === 'question-mark'">
      <path
        :fill="props.color"
        d="M12 19c.828 0 1.5.672 1.5 1.5S12.828 22 12 22s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm0-17c3.314 0 6 2.686 6 6 0 2.165-.753 3.29-2.674 4.923C13.399 14.56 13 15.297 13 17h-2c0-2.474.787-3.695 3.031-5.601C15.548 10.11 16 9.434 16 8c0-2.21-1.79-4-4-4S8 5.79 8 8v1H6V8c0-3.314 2.686-6 6-6z"
      />
    </template>
    <template v-else-if="props.name === 'check'">
      <path
        d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
        :fill="props.color"
      />
    </template>
    <template v-else-if="props.name === 'arrow-down-line'">
      <path
        :fill="props.color"
        d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z"
      />
    </template>
    <template v-else-if="props.name === 'drag-drop-line'">
      <path
        :fill="props.color"
        d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  size: { default: "1x" },
  color: { default: "currentColor" },
})

const size = computed(() => {
  if (props.size == "1x") {
    return 24
  }
})
</script>
