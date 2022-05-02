<template>
  <div class="homepage">
    <HomepageHomeIntro />
    <div class="has-background-shade-250">
      <HomepageSection
        :title="pageStore.homePage.feedbackBlockTitle"
        :intro="pageStore.homePage.feedbackBlockIntro"
      >
        <Carousel class="columns is-4 mb-2">
          <HomepageFeedbackCard
            v-for="(feedback, index) in pageStore.homePage.feedbacks"
            :key="feedback.id"
            :feedback="feedback"
            background-color="white"
            class="column is-one-third"
            :class="`item-${index}`"
          />
        </Carousel>
      </HomepageSection>
    </div>

    <HomepageSection
      :title="pageStore.homePage.blogBlockTitle"
      :intro="pageStore.homePage.blogBlockIntro"
    >
      <div class="columns is-4 mb-2">
        <div
          v-for="(blogPost, index) of pageStore.homePage.blogPosts"
          :key="blogPost.id"
          class="column is-half"
        >
          <HomepageArticleCard
            v-if="index < 2"
            :article="blogPost"
            background-color="shade-100"
            :image-height="260"
          />
        </div>
      </div>
    </HomepageSection>
    <div class="has-background-shade-250">
      <HomepageSection
        :title="pageStore.homePage.resourcesBlockTitle"
        :intro="pageStore.homePage.resourcesBlockTitle"
      >
        <div class="columns is-4 mb-2">
          <div
            v-for="(resource, index) of pageStore.homePage.resources"
            :key="resource.id"
            class="column is-one-third"
          >
            <HomepageArticleCard
              v-if="index < 3"
              :article="resource"
              background-color="white"
              :image-height="300"
            />
          </div>
        </div>
      </HomepageSection>
    </div>
    <HomepageSection
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
            :src="BASE_URL + partner.logoImageUrl"
            alt=""
            style="max-height: 40px"
          />
        </figure>
      </div>
    </HomepageSection>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { BASE_URL } from "~/composables/api"

definePageMeta({
  title: "Accueil",
  breadcrumb: "Accueil",
})

const pageStore = usePageStore()

if (!pageStore.homePage.title) {
  pageStore.loadHomePage()
}
</script>
