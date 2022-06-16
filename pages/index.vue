<template>
  <div class="homepage">
    <PageIntro
      :title="pageStore.homePage.title"
      :subtitle="pageStore.homePage.tagLine"
      :introduction="pageStore.homePage.introduction"
      :youtube-video-id="pageStore.homePage.introYoutubeVideoId"
      :image-url="pageStore.homePage.introImageUrl"
      :column-gap="16"
      class="pt-2"
    />

    <!-- Connected section -->

    <QuestionnaireProgressBars
      v-if="assessmentStore.currentAssessment"
      class="mb-4"
    />

    <PageSection
      v-if="assessmentStore.currentAssessment"
      :title="assessmentStore.participationBoardTitle"
      :intro="assessmentStore.currentAssessment.municipality.name"
    >
      <ParticipationBoard
        :assessment="assessmentStore.currentAssessment"
      ></ParticipationBoard>
    </PageSection>

    <!-- Feedbacks -->
    <div class="has-background-shade-250">
      <PageSection
        :title="pageStore.homePage.feedbackBlockTitle"
        :intro="pageStore.homePage.feedbackBlockIntro"
      >
        <div class="columns mb-2">
          <Carousel
            :settings="settings"
            :breakpoints="breakpointsSmallElements"
          >
            <Slide
              v-for="feedback in pageStore.homePage.feedbacks"
              :key="feedback.id"
              class="column is-one-third"
            >
              <PageFeedbackCard
                :feedback="feedback"
                background-color="white"
                class="carousel-item"
              />
            </Slide>
          </Carousel>
        </div>
      </PageSection>
    </div>

    <!-- Blog -->
    <PageSection
      :title="pageStore.homePage.blogBlockTitle"
      :intro="pageStore.homePage.blogBlockIntro"
      button-text="Explorer les articles"
      button-link="/blog"
    >
      <div class="columns mb-2">
        <Carousel :settings="settings" :breakpoints="breakpointsLargeElements">
          <Slide
            v-for="blogPost of pageStore.homePage.blogPosts"
            :key="blogPost.id"
            class="column is-one-third"
          >
            <PageArticleCard
              :article="blogPost"
              background-color="shade-100"
              :image-height="260"
              class="carousel-item"
            />
          </Slide>
        </Carousel>
      </div>
    </PageSection>

    <!-- Resources -->
    <div class="has-background-shade-250">
      <PageSection
        :title="pageStore.homePage.resourcesBlockTitle"
        :intro="pageStore.homePage.resourcesBlockTitle"
        button-text="Explorer les ressources"
        button-link="/ressources"
      >
        <div class="columns mb-2" style="display: block">
          <Carousel
            :settings="settings"
            :breakpoints="breakpointsSmallElements"
          >
            <Slide
              v-for="resource of pageStore.homePage.resources"
              :key="resource.id"
              class="column is-one-third"
            >
              <PageArticleCard
                :article="resource"
                background-color="white"
                :image-height="300"
                class="carousel-item"
              />
            </Slide>
          </Carousel>
        </div>
      </PageSection>
    </div>

    <!-- Parteners -->
    <PageSection
      :title="pageStore.homePage.partnerBlockTitle"
      :intro="pageStore.homePage.partnerBlockIntro"
    >
      <div
        class="is-flex is-flex-direction-row is-flex-wrap-wrap"
        style="column-gap: 4rem"
      >
        <figure
          v-for="partner of pageStore.homePage.partners"
          :key="partner.id"
          class="image"
        >
          <img
            :src="MADIA_BASE_URL + partner.logoImageUrl"
            alt=""
            style="height: 80px"
          />
        </figure>
      </div>
    </PageSection>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide } from "vue3-carousel"

import "vue3-carousel/dist/carousel.css"
import { usePageStore } from "~/stores/pageStore"
import { MADIA_BASE_URL } from "~/composables/api"
import { useParticipationStore } from "~/stores/participationStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"

definePageMeta({
  title: "Accueil",
  breadcrumb: "Accueil",
})

const pageStore = usePageStore()
const assessmentStore = useAssessmentStore()

const participationStore = useParticipationStore()
participationStore.getCurrentParticipation()

if (!pageStore.homePage.title) {
  pageStore.getHomePage()
}

const settings = {
  itemsToShow: 1.05,
  snapAlign: "start",
}
const breakpointsLargeElements = {
  1024: {
    itemsToShow: 3.1,
    snapAlign: "start",
  },
}
const breakpointsSmallElements = {
  1024: {
    itemsToShow: 3.1,
    snapAlign: "start",
  },
}
</script>

<style scoped lang="sass">
.carousel-item
  width: 100%
  text-align: start
</style>
