import { defineStore } from "pinia"
import {
  Article,
  EvaluationInitPage,
  EvaluationIntroPage,
  EvaluationQuestionnairePage,
  HomePage,
  ProjectPage,
  ReferentialPage,
  UsagePage,
} from "~/composables/types"
import { useApiGet } from "~~/composables/api"
import {
  getStreamFieldListStructMediaWithUrl,
  getStreamFieldMediaWithUrl,
  getStreamFieldStructMediaWithUrl,
  getStreamFieldStructWithLinkedObject,
  getStreamFieldStructWithListLinkedObjects,
} from "~/utils/streamFields"
import { useToastStore } from "./toastStore"

export const usePageStore = defineStore("page", {
  state: () => ({
    homePage: <HomePage>{},
    blogPosts: <Article[]>[],
    resources: <Article[]>[],
    blogLoaded: <boolean>false,
    resourcesLoaded: <boolean>false,
    referentialPage: <ReferentialPage>{},
    usagePage: <UsagePage>{},
    projectPage: <ProjectPage>{},
    evaluationIntroPage: <EvaluationIntroPage>{},
    evaluationInitPage: <EvaluationInitPage>{},
    evaluationQuestionnairePage: <EvaluationQuestionnairePage>{},
  }),
  actions: {
    async getHomePage() {
      const { data, error } = await useApiGet<HomePage[]>("home-pages/")
      if (!error.value) {
        if (data.value.length) {
          const homePageData = data.value[0]
          this.blogPosts = homePageData.blogPosts
          this.resources = homePageData.resources
          this.homePage = homePageData
        } else {
          console.error("Impossible to retrieve home page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getBlogPosts() {
      const { data, error } = await useApiGet<Article[]>("blog-posts/")
      if (!error.value) {
        this.blogPosts = data.value
        this.blogLoaded = true
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getResources() {
      const { data, error } = await useApiGet<Article[]>("resources/")
      if (!error.value) {
        this.resources = data.value
        this.resourcesLoaded = true
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getReferentialPage() {
      const { data, error } = await useApiGet<ReferentialPage[]>(
        "referential-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.referentialPage = data.value[0]
        } else {
          console.error("Impossible to retrieve referential page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getUsagePage() {
      const { data, error } = await useApiGet<UsagePage[]>("usage-pages/")
      if (!error.value) {
        if (data.value.length) {
          this.usagePage = data.value[0]
          // Treat json data sent in string
          this.usagePage.stepsOfUse = getStreamFieldStructMediaWithUrl(
            this.usagePage.stepsOfUse,
            "image",
            this.usagePage.stepsImagesUrl
          )
          this.usagePage.startAssessmentBlockData =
            getStreamFieldStructWithLinkedObject(
              this.usagePage.startAssessmentBlockData,
              "type",
              this.usagePage.assessmentTypesDetails,
              "assessmentType"
            )
          // NB : to improve (fine enough for now) : eval function do not transform to camelCase, so we have pdf_button instead of pdfButton
        } else {
          console.error("Impossible to retrieve usage page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getProjectPage() {
      const { data, error } = await useApiGet<ProjectPage[]>("project-pages/")
      if (!error.value) {
        if (data.value.length) {
          this.projectPage = data.value[0]
          this.projectPage.whyBlockData = getStreamFieldMediaWithUrl(
            this.projectPage.whyBlockData,
            "image",
            this.projectPage.imagesUrl
          )
          this.projectPage.objectiveBlockData =
            getStreamFieldStructMediaWithUrl(
              this.projectPage.objectiveBlockData,
              "svg",
              this.projectPage.svgsUrl
            )
          this.projectPage.impactBlockData = getStreamFieldStructMediaWithUrl(
            this.projectPage.impactBlockData,
            "image",
            this.projectPage.imagesUrl
          )
          this.projectPage.whoPartnerSubBlockData =
            getStreamFieldStructWithListLinkedObjects(
              this.projectPage.whoPartnerSubBlockData,
              "partners",
              this.projectPage.partners,
              "id"
            )
          this.projectPage.howBlockData = getStreamFieldListStructMediaWithUrl(
            this.projectPage.howBlockData,
            "cards",
            "svg",
            this.projectPage.svgsUrl
          )
        } else {
          console.error("Impossible to retrieve usage page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getEvaluationIntroPage() {
      const { data, error } = await useApiGet<EvaluationIntroPage[]>(
        "evaluation-intro-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.evaluationIntroPage = data.value[0]
        } else {
          console.error("Impossible to retrieve evaluation intro page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getEvaluationInitPage() {
      const { data, error } = await useApiGet<EvaluationInitPage[]>(
        "evaluation-init-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.evaluationInitPage = data.value[0]
        } else {
          console.error("Impossible to retrieve evaluation init page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getEvaluationQuestionnairePage() {
      const { data, error } = await useApiGet<EvaluationQuestionnairePage[]>(
        "evaluation-questionnaire-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.evaluationQuestionnairePage = data.value[0]
        } else {
          console.error("Impossible to retrieve evaluation questionnaire page")
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
  },
})
