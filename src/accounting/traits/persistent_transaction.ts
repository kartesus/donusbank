export interface PersistentTransaction {
  commit(): Promise<void>
}