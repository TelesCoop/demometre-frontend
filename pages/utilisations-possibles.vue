<template>
  <div>
    <PageIntro
      :title="pageStore.usagePage.title"
      :subtitle="pageStore.usagePage.tagLine"
      :introduction="pageStore.usagePage.introduction"
      youtube-video-id=""
      :image-url="pageStore.usagePage.introImageUrl"
    />
    <div class="has-background-shade-250">
      <PageSection
        :title="pageStore.usagePage.stepOfUseTitle"
        :intro="pageStore.usagePage.stepOfUseIntro"
      >
        <div class="columns mb-2 is-variable is-6">
          <div
            v-for="(step, index) in pageStore.usagePage.stepsOfUse"
            :key="index"
            class="column is-one-third"
          >
            <PageStepCard
              :step="step"
              :image-height="250"
              :index="index"
              background-color="white"
            />
          </div>
        </div>
      </PageSection>
    </div>
    <PageSection
      :title="pageStore.usagePage.participateBlockTitle"
      :intro="pageStore.usagePage.participateBlockIntro"
      button-text="Lancer l'évaluation"
      :button-link="userStep.url"
      button-color="cooperation"
      :button-outlined="true"
      :button-text-dark="true"
    >
      <div class="columns mb-2">
        <RichText
          :rich-text="pageStore.usagePage.participateLeftParagraph"
          class="is-family-secondary column"
        />
        <RichText
          :rich-text="pageStore.usagePage.participateRightParagraph"
          class="is-family-secondary column"
        />
      </div>
    </PageSection>
    <div class="has-background-shade-250">
      <PageSection
        :title="pageStore.usagePage.startAssessmentBlockTitle"
        :intro="pageStore.usagePage.startAssessmentBlockIntro"
      >
        <div class="columns mb-2">
          <div
            v-for="assessmentType in pageStore.usagePage
              .startAssessmentBlockData"
            :key="assessmentType.id"
            class="column is-one-third"
          >
            <PageAssessmentCard
              :assessment-type="assessmentType"
              background-color="white"
            />
          </div>
        </div>
      </PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Utilisations possibles",
  breadcrumb: "Utilisations possibles",
})

const userStep = useUserStep()
const pageStore = usePageStore()

if (!pageStore.usagePage.title) {
  pageStore.getUsagePage()
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
