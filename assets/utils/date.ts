import moment from "moment"

export function displayDate(date: string): string {
  return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY")
}
