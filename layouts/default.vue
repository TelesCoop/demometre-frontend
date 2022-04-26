<template>
  <div>
    <div>
      <Navbar />
      <Breadcrumb />
      <slot></slot>
      <Footer />
    </div>
    <Toast :message="toastStore.message" />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "../stores/toastStore"

const toastStore = useToastStore()
</script>
