export interface VerifiableAccount {
  verify(): Promise<void>
}