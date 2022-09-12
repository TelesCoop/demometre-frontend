<template>
  <ModalCancelParticipationModal></ModalCancelParticipationModal>
  <ModalSaveParticipationModal></ModalSaveParticipationModal>
  <div class="has-navbar-fixed-top test" :style="`padding-top: ${height}px;`">
    <div>
      <HeaderNavbar @change-header-height="onChangeHeaderHight($event)" />
      <Breadcrumb />
      <slot></slot>
      <Footer v-if="showFooter" />
    </div>
    <Toast :message="toastStore.message" />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "~/stores/toastStore"

const toastStore = useToastStore()
const route = useRoute()

const height = ref<number>(75)
const showFooter = computed(() => !route.path.includes("/evaluation"))

const onChangeHeaderHight = (newHeight) => {
  height.value = newHeight
}
</script>

<style scoped lang="sass">
.test
  width: 100vw
  overflow: hidden
</style>
