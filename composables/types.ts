export type User = { id: number, email: string, username: string }
export type Question = { id: number, code: string, name: string, statement: string }
export type Answer = { title: string, description: string, answerIndex?: number, id?: number }
export type Assessment = { id: number, zipCode: string[], type: string }
