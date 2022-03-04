export const wordTitleCase = (input: string): string => {
    if (!input.length) {
        return input
    }
    return input[0].toUpperCase() + input.slice(1)
}
