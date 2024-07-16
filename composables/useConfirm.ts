import { useMainStore } from "~/stores/mainStore"
import { useGettext } from "vue3-gettext"

const { $gettext } = useGettext()

export const useConfirm = () => {
  const mainStore = useMainStore()
  return (
    text: string,
    title = $gettext("Confirmation"),
    confirmationLabel = $gettext("Confirmer"),
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
