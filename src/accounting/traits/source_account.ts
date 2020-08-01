export interface SourceAccount {
  ID: string
  withdraw(amount: number): void
}