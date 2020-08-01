export interface DestinationAccount {
  ID: string
  deposit(amount: number): void
}