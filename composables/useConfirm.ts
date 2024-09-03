import { useMainStore } from "~/stores/mainStore"
import { useGettext } from "vue3-gettext"


export const useConfirm = () => {
  const mainStore = useMainStore()
  const { $gettext } = useGettext()

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
