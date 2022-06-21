<template>
  <div>
    <PageIntro
      :title="pageStore.projectPage.title"
      :subtitle="pageStore.projectPage.tagLine"
      class="pt-2"
    >
      <div class="is-flex buttons is-outlined is-shade-600">
        <button
          class="button is-rounded is-outlined is-shade-600 is-responsive"
          @click.prevent="scrollIntoWhyBlock"
        >
          <span>Pourquoi</span>
          <span class="icon">
            <icon name="arrow-right-line" size="16" class="icon" />
          </span>
        </button>
        <button
          class="button is-rounded is-outlined is-shade-600 is-responsive"
          @click.prevent="scrollIntoWhoBlock"
        >
          <span>Avec qui</span>
          <span class="icon">
            <icon name="arrow-right-line" size="16" class="icon" />
          </span>
        </button>
        <button
          class="button is-rounded is-outlined is-shade-600 is-responsive"
          @click.prevent="scrollIntoHowBlock"
        >
          <span>Méthode</span>
          <span class="icon">
            <icon name="arrow-right-line" size="16" class="icon" />
          </span>
        </button>
      </div>
    </PageIntro>

    <!-- Why block -->
    <div ref="whyBlockRef" class="scroll-margin-top_5">
      <PageBigSection :title="pageStore.projectPage.whyBlockTitle">
        <div class="container">
          <div class="column-2">
            <PageFreeBody
              :free-body="pageStore.projectPage.whyBlockData"
              :inside-2-columns="true"
            />
          </div>
        </div>
      </PageBigSection>
    </div>

    <!-- Who block -->
    <div ref="whoBlockRef" class="scroll-margin-top_5">
      <PageBigSection :title="pageStore.projectPage.whoBlockTitle">
      </PageBigSection>
    </div>

    <!-- How block -->
    <div ref="howBlockRef" class="scroll-margin-top_5">
      <PageBigSection :title="pageStore.projectPage.howBlockTitle">
        <div class="container">
          <PageFreeBody
            :free-body="pageStore.projectPage.howBlockData"
            :inside-2-columns="false"
            h-title="h3"
          />
        </div>
      </PageBigSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Le projet",
  breadcrumb: "Le projet",
})

const pageStore = usePageStore()
const route = useRoute()

if (!pageStore.projectPage.title) {
  pageStore.getProjectPage()
}

const howBlockRef = ref(null)
const whoBlockRef = ref(null)
const whyBlockRef = ref(null)
onMounted(() => {
  console.log("onMounted")
  howBlockRef.value.focus()
  whoBlockRef.value.focus()
  whyBlockRef.value.focus()
  if (route.query.hash === "howBlockRef") {
    scrollIntoHowBlock()
  }
})

const scrollIntoHowBlock = () => {
  console.log("COUCOU")
  howBlockRef.value.scrollIntoView({ behavior: "smooth" })
}
const scrollIntoWhoBlock = () => {
  whoBlockRef.value.scrollIntoView({ behavior: "smooth" })
}
const scrollIntoWhyBlock = () => {
  whyBlockRef.value.scrollIntoView({ behavior: "smooth" })
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
