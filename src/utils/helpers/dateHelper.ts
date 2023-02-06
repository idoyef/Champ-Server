export function addDays(date: Date, daysToAdd: number) {
  return new Date(date.setDate(date.getDate() + daysToAdd));
}
