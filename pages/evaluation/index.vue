<template>
  <div class="container is-fluid">
    <form
      class="column is-one-third is-offset-one-third"
      action="/evaluation/localisation"
      @submit.prevent="onSubmit"
    >
      <h1 class="title is-3 has-text-black-ter">
        {{ pageStore.evaluationIntroPage.title }}
      </h1>
      <div v-if="!userStore.isLoggedIn" class="account-incentive">
        <p class="title is-4 has-text-black-ter mb-1">
          {{ pageStore.evaluationIntroPage.accountIncentiveTitle }}
        </p>

        <p class="is-family-secondary is-size-5 mb-1">
          {{ pageStore.evaluationIntroPage.accountIncentive }}
        </p>
        <div class="buttons mb-0_5">
          <NuxtLink class="button is-normal" to="/signup"
            >Oui, faire un compte</NuxtLink
          >
          <input
            id="withoutAccount"
            v-model="withoutAccount"
            type="checkbox"
            class="custom-hidden white-on-black-input-checked"
          />
          <label class="button is-normal" for="withoutAccount"
            >Non, faire sans</label
          >
        </div>
      </div>
      <p class="is-family-secondary mt-0_5 mb-2">
        {{ pageStore.evaluationIntroPage.introduction }}
      </p>
      <div class="consent-container">
        <label class="checkbox">
          <input v-model="consent" type="checkbox" required />
          <RichText
            :rich-text="pageStore.evaluationIntroPage.dataConsent"
            class="is-size-7"
          />
        </label>
      </div>
      <div class="buttons mt-4">
        <button class="button is-normal is-rounded" :disabled="disabled">
          <span>Commencer</span>
        </button>
        <span class="is-size-7">
          appuyez sur
          <span class="has-text-weight-bold">Entrer ⏎</span></span
        >

        <!-- Permet d'appuyer sur entrer -->
        <input type="submit" hidden />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useParticipationStore } from "~/stores/participationStore"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Évaluation",
  breadcrumb: "Évaluation",
  step: "localisation",
  middleware: ["user-step"],
})

const pageStore = usePageStore()
const participationStore = useParticipationStore()
const userStore = useUserStore()
const consent = ref<boolean>(false)
const withoutAccount = ref<boolean>(false)

if (!pageStore.evaluationIntroPage.title) {
  pageStore.getEvaluationIntroPage()
}
const disabled = computed(() =>
  consent.value && (userStore.isLoggedIn || withoutAccount.value) ? false : true
)

function onSubmit() {
  participationStore.setConsent()
  useRouter().push("/evaluation/localisation")
}
</script>

<style scoped lang="sass">
.consent-container
  position: relative
  input[type=checkbox]
    filter: grayscale(100%)
    width: 20px
    height: 20px
    margin-left: -40px
    margin-bottom: -40px
    position: absolute
</style>
