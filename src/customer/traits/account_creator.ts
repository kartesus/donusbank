export abstract class AccountCreator {
  abstract async createAccount(): Promise<void>
}