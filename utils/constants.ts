export const PARTICIPANT_TYPE = {
  "initiator": "initiateur",
  "expert": "expert",
  "participant": "participant"
}
export const ASSESSMENT_CONTEXT_FIELD_TYPE = "context" | "objectives" | "stakeholders" | "calendar"
export const WORKSHOP_CONTEXT_FIELD_TYPE = "context" | "objectives" | "course" | "comments"
export const ASSESSMENT_CONTEXT_FIELDS = {
  "context": "contexte",
  "objectives": "objectifs",
  "stakeholders": "parties prenantes",
  "calendar": "calendrier"
}
export const WORKSHOP_CONTEXT_FIELDS = {
  context: "contexte",
  objectives: "objectifs",
  course: "déroulé",
  comments: "commentaires",
  demometreSuggestions: "sur le démomètre",
  platformSuggestions: "sur la plateforme",
  resultObservations: "sur les résultats",
  improvementObservations: "sur les mesures d'améliorations"
}
export const ASSESSMENT_DOCUMENT_CATEGORIES = [
  { label: "Rapports d'évaluation", value: "assessment_reports" },
  { label: "Autres documents", value: "other" },
  { label: "Factures", value: "invoices" }
]
export const WORKSHOP_TYPES = {
  assessment: {
    label: "Évaluation",
    bottomFields: ["demometreSuggestions", "platformSuggestions"],
    bottomFieldsLabel: "Suggestions",
    bottomFieldsButtonLabel: "Modifier les suggestions"
  },
  results: {
    label: "Résultats",
    bottomFields: ["result_observations", "improvementObservations"],
    bottomFieldsLabel: "Remarques",
    bottomFieldsButtonLabel: "Modifier les remarques"
  }
}
export const WORKSHOP_MEDIUM = {
  "online": "En ligne",
  "paper": "Sur papier"
}
