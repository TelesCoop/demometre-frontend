<template>
  <div class="homepage">
    <HomepageHomeIntro />
    <div class="has-background-shade-250">
      <HomepageSection
        :title="pageStore.homePage.feedbackBlockTitle"
        :intro="pageStore.homePage.feedbackBlockIntro"
      >
        <div id="carousel" class="carousel columns is-4 mb-2">
          <HomepageFeedbackCard
            v-for="feedback of pageStore.homePage.feedbacks"
            :key="feedback.id"
            :feedback="feedback"
            background-color="white"
            class="column is-one-third"
          />
        </div>
      </HomepageSection>
    </div>

    <HomepageSection
      :title="pageStore.homePage.blogBlockTitle"
      :intro="pageStore.homePage.blogBlockIntro"
    >
      <div id="carousel" class="carousel columns is-4 mb-2">
        <HomepageArticleCard
          v-for="blogPost of pageStore.homePage.blogPosts"
          :key="blogPost.id"
          :article="blogPost"
          background-color="shade-100"
          image-height="260"
          class="column is-half"
        />
      </div>
    </HomepageSection>
    <div class="has-background-shade-250">
      <HomepageSection
        :title="pageStore.homePage.resourcesBlockTitle"
        :intro="pageStore.homePage.resourcesBlockTitle"
        ><HomepageArticleCard
          v-for="resource of pageStore.homePage.resources"
          :key="resource.id"
          :article="resource"
          background-color="white"
          image-height="300"
          class="column is-one-third"
        />
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

<script src="https://cdn.jsdelivr.net/npm/bulma-carousel@4.0.3/dist/js/bulma-carousel.min.js"></script>
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

// Initialize all elements with carousel class.
// const carousels = bulmaCarousel.attach(".carousel", {
//   slidesToScroll: 1,
//   slidesToShow: 4,
// })

// // To access to bulmaCarousel instance of an element
// const element = document.querySelector('#my-element');
// if (element && element.bulmaCarousel) {
//     // bulmaCarousel instance is available as element.bulmaCarousel
// }
</script>
