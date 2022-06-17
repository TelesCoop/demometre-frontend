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
          @click.prevent=""
        >
          <span>Pourquoi</span>
          <span class="icon">
            <icon name="arrow-right-line" size="16" class="icon" />
          </span>
        </button>
        <button
          class="button is-rounded is-outlined is-shade-600 is-responsive"
          @click.prevent=""
        >
          <span>Avec qui</span>
          <span class="icon">
            <icon name="arrow-right-line" size="16" class="icon" />
          </span>
        </button>
        <button
          class="button is-rounded is-outlined is-shade-600 is-responsive"
          @click.prevent=""
        >
          <span>Méthode</span>
          <span class="icon">
            <icon name="arrow-right-line" size="16" class="icon" />
          </span>
        </button>
      </div>
    </PageIntro>

    <!-- Why block -->
    <PageBigSection :title="pageStore.projectPage.whyBlockTitle">
      <div class="container">
        <div class="column-2">
          <PageFreeBody :free-body="pageStore.projectPage.whyBlockData" />
        </div>
      </div>
    </PageBigSection>

    <!-- Who block -->
    <PageBigSection :title="pageStore.projectPage.whoBlockTitle">
    </PageBigSection>

    <!-- How block -->
    <PageBigSection :title="pageStore.projectPage.howBlockTitle">
    </PageBigSection>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Le projet",
  breadcrumb: "Le projet",
})

const pageStore = usePageStore()

if (!pageStore.projectPage.title) {
  pageStore.getProjectPage()
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
