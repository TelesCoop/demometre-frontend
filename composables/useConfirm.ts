import { useMainStore } from "~/stores/mainStore"

export const useConfirm = () => {
  const mainStore = useMainStore()
  return (
    text: string,
    title = "Confirmation",
    confirmationLabel = "Confirmer",
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
