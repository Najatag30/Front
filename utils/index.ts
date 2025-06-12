// Utilitaire pour convertir date+heure locale en ISO UTC (pour le backend)
export function toLocalIso(date: string, time: string): string {
  const dt = new Date(`${date}T${time.length === 5 ? time + ":00" : time}`)
  const offset = dt.getTimezoneOffset()
  dt.setMinutes(dt.getMinutes() - offset)
  return dt.toISOString()
}

export function parseJsonErrors(errors: string): any[] {
  if (!errors) return []
  try {
    if (Array.isArray(errors)) return errors
    return JSON.parse(errors)
  } catch {
    return [{ message: errors }]
  }
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089/api/payments"
