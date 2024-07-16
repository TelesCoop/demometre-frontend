<template>
  <div class="container">
    <div class="section">
      <div class="is-flex is-justify-content-space-between">
        <h1 class="title is-size-1-desktop is-2 has-text-black">
          {{ $gettext("Mon compte") }}
        </h1>
        <div>
          <button
            class="button is-rounded"
            @click.prevent="logout"
          >
            {{ $gettext("Se déconnecter") }}
          </button>
        </div>
      </div>
      <div v-if="userStore.isAdminOrExpertUser">
        <router-link to="/export/questionnaire">
          <button class="button is-rounded">
            {{ $gettext("Générer un questionnaire papier en fonction d'un profil") }}
          </button>
        </router-link>
      </div>
    </div>
    <div
      v-if="userStore.isUnknownUser"
      class="section"
      style="margin-top: -64px"
    >
      <div class="message">
        <div class="message-body">
          {{ $gettext("Votre participation ne sera pas comptabilisée tant que vous n'êtes pas enregistré. Elle sera supprimée au bout d'un mois.")
          }}
        </div>
      </div>
      <div class="buttons is-flex-direction-column is-align-items-flex-start">
        <router-link
          class="button is-rounded is-primary mr-1 mb-1"
          to="/signup"
        >
          {{ $gettext("S'enregistrer pour conserver vos résultats") }}
        </router-link>
      </div>
    </div>
    <div>
      <hr>
      <PageSection
        :title="$gettext('Mes informations')"
        :buttons="[
          { text: $gettext('Modifier les informations'), icon: 'list-settings-line' },
        ]"
        @button-click="showEditUserInfoModal = true"
      >
        <div
          class="is-flex is-flex-wrap-wrap"
          style="row-gap: 1.5rem; column-gap: 3rem"
        >
          <InformationDetail
            title="Nom"
            :value="userStore.user.username"
          />
          <InformationDetail
            title="mail"
            :value="userStore.user.email"
          />
        </div>
      </PageSection>
      <hr>
      <PageSection
        title="Mes évaluations"
        intro="Toutes mes évaluations en cours et terminées"
        :buttons="[{ text: 'Lancer une évaluation', icon: 'arrow-right-line' }]"
        @button-click="newAssessment"
      >
        <div class="tabs is-fullwidth">
          <ul>
            <li
              :class="isCurrentAssessmentsTab ? 'is-active' : null"
              @click="isCurrentAssessmentsTab = true"
            >
              <a>{{ $gettext("Évaluations en cours") }} ({{ currentAssessments.length }})</a>
            </li>
            <li
              :class="isCurrentAssessmentsTab ? null : 'is-active'"
              @click="isCurrentAssessmentsTab = false"
            >
              <a>{{ $gettext("Évaluations terminées") }} ({{ finishedAssessments.length }})</a>
            </li>
          </ul>
        </div>
        <div>
          <article
            v-if="!selectedAssessments.length"
            class="message"
          >
            <div class="message-body">
              <p class="title is-5">
                {{ $gettext("Aucune évaluation") }}
                {{ isCurrentAssessmentsTab ? $gettext("en cours") : $gettext("terminée") }}
              </p>
              <p>
                <template v-if="isCurrentAssessmentsTab">
                  {{ $gettext("Vous n’avez aucune évaluation en cours avec le DémoMètre.") }}
                </template>
                <template v-else>
                  {{ $gettext("Vous n’avez aucune évaluation terminée avec le DémoMètre.") }}
                </template>
              </p>
              <p>
                {{ $gettext("Pour démarrer une évaluation, cliquer sur le bouton « Lancer une évaluation ».") }}
              </p>
            </div>
          </article>
          <table
            v-else
            class="table is-striped is-fullwidth"
          >
            <thead>
              <tr>
                <th>{{ $pgettext("relatif à une évaluation", "Nom") }}</th>
                <th>{{ $gettext("Questionnaire") }}</th>
                <th>{{ $gettext("Date de création") }}</th>
                <th>{{ $pgettext("rôle de l'utilisateur dans l'évaluation", "Rôle") }}</th>
                <th>{{ $gettext("Échelon") }}</th>
                <th>{{ $gettext("Localité") }}</th>
                <th>{{ $gettext("Pays") }}</th>
                <th>{{ $gettext("Actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assessment of selectedAssessments"
                :key="assessment.id"
                style="cursor: pointer"
                tabindex="0"
                title="Cliquer pour accéder aux détails"
                @click="selectAssessment(assessment.id)"
              >
                <td>{{ assessment.name }}</td>
                <td>{{ assessment.surveyName }}</td>
                <td>{{ new Date(assessment.created).toLocaleDateString() }}</td>
                <td>
                  {{
                    PARTICIPANT_TYPE[assessment.details.role] ||
                      $pgettext("l'utilisateur est participant au questionnaire, mais n'a pas commencé à le remplir", "participant - non encore rempli")
                  }}
                  <template v-if="assessment.details.hasDetailAccess">
                    <span
                      v-if="assessment.details.paymentAmount"
                      class="tag"
                    >{{ $gettext("Redevance payée") }}</span>
                    <span
                      v-else
                      class="tag is-danger"
                    >{{ $gettext("Redevance impayée") }}</span>
                  </template>
                </td>
                <td>{{ LOCALITY_TYPE_NAME[assessment.localityType] }}</td>
                <td>{{ assessment.collectivityName }}</td>
                <td>France</td>
                <td>
                  <button class="button is-small is-rounded">
                    {{ $gettext("Détails") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PageSection>
    </div>
    <AccountEditUserInfoModal
      v-if="showEditUserInfoModal"
      @close="showEditUserInfoModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"
import { LOCALITY_TYPE_NAME, PARTICIPANT_TYPE } from "~/utils/constants"
import { useParticipationStore } from "~/stores/participationStore"
import { Assessment } from "~/composables/types"

definePageMeta({
  title: "Mon compte",
  breadcrumb: "Mon compte",
})

const assessmentStore = useAssessmentStore()
const participationStore = useParticipationStore()
const userStore = useUserStore()
const router = useRouter()

const isCurrentAssessmentsTab = ref(true)
const showEditUserInfoModal = ref(false)

const currentAssessments = computed(() =>
  assessmentStore.assessments.filter((ass) => ass.isCurrent),
)
const finishedAssessments = computed(() =>
  assessmentStore.assessments.filter((ass) => !ass.isCurrent),
)
const selectedAssessments = computed<Assessment[]>(() =>
  isCurrentAssessmentsTab.value
    ? currentAssessments.value
    : finishedAssessments.value,
)

const selectAssessment = (assessmentId: number) => {
  router.push(`/compte/evaluation/${assessmentId}`)
}

const newAssessment = () => {
  assessmentStore.createNewAssessment()
  participationStore.newAssessment()
  router.push("/evaluation/localisation")
}

const logout = () => {
  userStore.logout()
}
</script>

<style scoped lang="sass"></style>
