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

const userStore = useUserStore()
const participationStore = useParticipationStore()
const definitionStore = useDefinitionStore()
const toastStore = useToastStore()

if (!userStore.user.email) {
  // if profile is already got from SSR, do not fetch again
  userStore.refreshProfile()
}
if (userStore.user.email && !participationStore.id) {
  console.log("In default layout, get current participation")
  participationStore.getCurrentParticipation()
}
definitionStore.getDefinitions()
</script>
