<template>
  <Teleport to="body">
    <div
      class="modal is-active"
    >
      <div
        class="modal-background"
        @click="emit('close')"
      />
      <div class="modal-content">
        <div class="modal-card-head">
          <h2 class="title is-2">
            Ajouter un atelier
          </h2>
        </div>
        <div class="modal-card-body">
          <div class="field">
            <label class="label">Nom de l'atelier</label>
            <div class="control">
              <input
                v-model="name"
                class="input"
                type="text"
                placeholder="Présentation des résultats"
              >
            </div>
          </div>
          <div class="field">
            <label
              class="label"
              for="workshop_type"
            >Type d'atelier</label>
            <div class="select">
              <select
                id="workshop_type"
                v-model="workshopType"
                name="workshop_type"
              >
                <option value="assessment">
                  Atelier d'évaluation
                </option>
                <option value="results">
                  Atelier sur les résultats
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">Lieu</label>
            <div class="control">
              <input
                v-model="place"
                class="input"
                type="text"
                placeholder="Salle polyvalente de la ville de ..."
              >
            </div>
          </div>
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input
                v-model="date"
                class="input"
                type="date"
                lang="fr-FR"
              >
            </div>
          </div>
        </div>
        <div class="modal-card-foot">
          <button
            class="button is-rounded is-dark"
            :disabled="!isFormValid"
            @click="addWorkshop"
          >
            <span>Valider</span>
            <span class="icon">
              <icon
                size="16"
                name="check"
              />
            </span>
          </button>
          <button
            class="button is-rounded is-outlined is-dark"
            @click="$emit('close')"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useWorkshopStore } from "~/stores/workshopStore"

const props = defineProps({ assessmentId: { type: Number, required: true } })
const emit = defineEmits(["close"])

const workshopStore = useWorkshopStore()

const date = ref("")
const name = ref("")
const place = ref("")
const workshopType = ref<"assessment" | "results">("assessment")

const addWorkshop = async () => {
  const res = await workshopStore.createOrUpdateWorkshop({
    name: name.value,
    date: date.value,
    place: place.value,
    assessmentId: props.assessmentId,
    type: workshopType.value
  })
  if (res) {
    emit("close")
  }
}

const isFormValid = computed<boolean>(() => {
  return !!date.value && !!name.value && !!place.value
})

</script>
