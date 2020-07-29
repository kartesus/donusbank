export type Result<T> = { ok: true, data: T } | { ok: false, data: Error }
export function wrapped<T>(data: T): Result<T> {
  if (data instanceof Error) return { ok: false, data }
  return { ok: true, data }
}