export const wordTitleCase = (input: string): string => {
  if (!input.length) {
    return input
  }
  return input[0].toUpperCase() + input.slice(1)
}

export function round(value: number, digits: number): number {
  const x = Math.pow(10, digits)
  return Math.round(value * x) / x
}

export const generateRandomId = () => Math.random().toString(36).slice(2, 10)

export function doNothing(): void {
  // do nothing
}

export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
