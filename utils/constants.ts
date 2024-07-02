import { useGettext } from "vue3-gettext"

const { $gettext } = useGettext()

export const PARTICIPANT_TYPE = {
  initiator: "initiateur",
  expert: "expert",
  participant: "participant",
}
export type ASSESSMENT_CONTEXT_FIELD_TYPE =
  "context" | "objectives" | "stakeholders" | "calendar"
export type WORKSHOP_CONTEXT_FIELD_TYPE =
  "context" | "objectives" | "course" | "comments"
export const ASSESSMENT_CONTEXT_FIELDS = {
  context: $gettext("contexte"),
  objectives: $gettext("objectifs"),
  stakeholders: $gettext("parties prenantes"),
  calendar: $gettext("calendrier"),
}
export const WORKSHOP_CONTEXT_FIELDS = {
  context: $gettext("contexte"),
  objectives: $gettext("objectifs"),
  course: $gettext("déroulé"),
  comments: $gettext("commentaires"),
  demometreSuggestions: $gettext("sur le démomètre"),
  platformSuggestions: $gettext("sur la plateforme"),
  resultObservations: $gettext("sur les résultats"),
  improvementObservations: $gettext("sur les mesures d'améliorations"),
}
export const ASSESSMENT_DOCUMENT_CATEGORIES = [
  { label: $gettext("Rapports d'évaluation"), value: "assessment_reports" },
  { label: $gettext("Autres documents"), value: "other" },
  { label: $gettext("Factures"), value: "invoices" },
]
export const WORKSHOP_TYPES = {
  assessment: {
    label: $gettext("Évaluation"),
    bottomFields: ["demometreSuggestions", "platformSuggestions"],
    bottomFieldsLabel: $gettext("Suggestions"),
    bottomFieldsButtonLabel: $gettext("Modifier les suggestions"),
  },
  results: {
    label: $gettext("Résultats"),
    bottomFields: ["resultObservations", "improvementObservations"],
    bottomFieldsLabel: $gettext("Remarques"),
    bottomFieldsButtonLabel: $gettext("Modifier les remarques"),
  },
}
export const WORKSHOP_MEDIUM = {
  online: $gettext("En ligne"),
  paper: $gettext("Sur papier"),
}
export const LOCALITY_TYPE_NAME = {
  municipality: $gettext("Commune"),
  intercommunality: $gettext("Intercommunalité"),
  department: $gettext("Département"),
  region: $gettext("Région"),
}
