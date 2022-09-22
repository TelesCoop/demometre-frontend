<template>
  <ModalCancelParticipationModal></ModalCancelParticipationModal>
  <ModalSaveParticipationModal></ModalSaveParticipationModal>
  <div
    class="has-navbar-fixed-top default-page"
    :style="`padding-top: ${height}px;`"
  >
    <HeaderNavbar @change-header-height="onChangeHeaderHight($event)" />
    <div class="default-page-content">
      <Breadcrumb />
      <slot></slot>
    </div>
    <Footer v-if="showFooter" />
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
.default-page
  width: 100vw
  overflow: hidden
  padding-top: 75px
  display: flex
  flex-direction: column
  min-height: 100vh

  &-content
    flex-grow: 1
</style>
