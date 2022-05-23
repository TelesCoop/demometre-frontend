<template>
  <div class="has-navbar-fixed-top" :style="`padding-top: ${height}px;`">
    <div>
      <HeaderNavbar @change-header-height="onChangeHeaderHight($event)" />
      <Breadcrumb />
      <slot></slot>
      <Footer />
    </div>
    <Toast :message="toastStore.message" />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "~/stores/toastStore"

const toastStore = useToastStore()

const height = ref<number>(75)

const onChangeHeaderHight = (newHeight) => {
  height.value = newHeight
}
</script>
