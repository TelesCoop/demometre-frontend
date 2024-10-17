<template>
  <div>
    <ModalCancelParticipationModal />
    <ModalSaveParticipationModal />
    <div
      class="has-navbar-fixed-top default-page"
      :style="`padding-top: ${height}px;`"
    >
      <HeaderNavbar @change-header-height="onChangeHeaderHight($event)" />
      <div class="default-page-content">
        <Breadcrumb />
        <client-only>
          <Suspense>
            <slot />
            <template #fallback>
              <h1 class="mt-6 mb-6">
                CHARGEMENT....
              </h1>
            </template>
          </Suspense>
        </client-only>
      </div>
      <Footer v-if="showFooter" />
      <Toast
        v-if="messageStore.message"
        :message="messageStore.message"
      />
    </div>

    <!-- confirmation modal -->
    <div
      v-if="mainStore.confirmation.title"
      class="modal is-active"
    >
      <div
        class="modal-background"
        @click="emit('close')"
      />
      <div class="modal-content">
        <div class="modal-card-head">
          <h2>
            {{ mainStore.confirmation.title }}
          </h2>
        </div>
        <div class="modal-card-body">
          {{ mainStore.confirmation.text }}
        </div>
        <footer class="modal-card-foot">
          <button
            class="button is-rounded is-dark"
            @click="mainStore.confirmation.onConfirm"
          >
            <span>{{ mainStore.confirmation.confirmationLabel }}</span>
            <!--            <span class="icon">-->
            <!--              <icon-->
            <!--                size="16"-->
            <!--                name="check"-->
            <!--              />-->
            <!--            </span>-->
          </button>
          <button
            class="button is-rounded is-outlined is-dark"
            @click="mainStore.confirmation.onCancel"
          >
            Annuler
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from "~/stores/messageStore"
import { useMainStore } from "~/stores/mainStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

const messageStore = useMessageStore()
const mainStore = useMainStore()
const route = useRoute()

const assessmentStore = useAssessmentStore()
const participationStore = useParticipationStore()
const onRouteChange = async () => {
  const assessmentIdStr: string = (route.params.assessmentId as string)
  const assessmentId = parseInt(assessmentIdStr as string)
  if (isNaN(assessmentId)) {
    return
  }
  Promise.all([
    assessmentStore.getAssessmentOnce(assessmentId),
    participationStore.getParticipationForAssessmentOnce(assessmentId),
    participationStore.loadAssessmentOnce(assessmentId),
  ])
}
watch(route, onRouteChange)
onRouteChange()

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
