export interface PersistentTransaction {
  commit(): Promise<void>
  rollback(): Promise<void>
}