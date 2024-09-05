import { useMainStore } from "~/stores/mainStore"
import { useI18n } from "vue-i18n"


export const useConfirm = () => {
  const mainStore = useMainStore()
  const i18n = useI18n()
  const $t = i18n.t

  return (
    text: string,
    title = $t("Confirmation"),
    confirmationLabel = $t("Confirmer"),
    onConfirm: () => void,
    onCancel: () => void = () => {
    },
  ) => {
    const newOnCancel = () => {
      onCancel()
      mainStore.resetConfirm()
    }
    const newOnConfirm = () => {
      onConfirm()
      mainStore.resetConfirm()
    }
    mainStore.confirmation = {
      text,
      title,
      onConfirm: newOnConfirm,
      onCancel: newOnCancel,
      confirmationLabel,
    }
  }
}
