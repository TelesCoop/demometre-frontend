import { Marker, Scores } from "~/composables/types"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

const STRENGHT_OR_IMPROVEMENT_FIELD = {
  1: "improvement1",
  2: "improvement2",
  3: "strength3",
  4: "strength4",
}

const IS_STRENGHT_OR_IMPROVEMENT = {
  1: "improvements",
  2: "improvements",
  3: "strengths",
  4: "strengths",
}

const getScoreToDisplay = (score) => {
  if (score < 0.25) {
    return 1
  }
  if (score < 0.5 && score >= 0.25) {
    return 2
  }
  if (score < 0.75 && score >= 0.5) {
    return 3
  }
  if (score >= 0.75) {
    return 4
  }
}

export const getMarkerStrenghtAndImprovement = (
  marker: Marker,
  assessmentScores: Scores
) => {
  const questionnaireStore = useQuestionnaireStore()
  const strenghtsAndImprovements = { strengths: [], improvements: [] }
  for (const criteriaId of marker.criteriaIds) {
    const scoreToDisplay = getScoreToDisplay(
      assessmentScores.byCriteriaId[criteriaId]
    )
    strenghtsAndImprovements[IS_STRENGHT_OR_IMPROVEMENT[scoreToDisplay]].push(
      questionnaireStore.criteriaById[criteriaId][
        STRENGHT_OR_IMPROVEMENT_FIELD[scoreToDisplay]
      ]
    )
  }
  return strenghtsAndImprovements
}
