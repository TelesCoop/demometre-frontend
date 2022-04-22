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
import { useUserStore } from "~/stores/userStore"
import { useDefinitionStore } from "~/stores/definitionStore"
import { useToastStore } from "~/stores/toastStore"
import { useParticipationStore } from "~/stores/participationStore"

const definitionStore = useDefinitionStore()
const toastStore = useToastStore()

definitionStore.getDefinitions()
</script>
