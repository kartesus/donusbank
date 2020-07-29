import { Result, wrapped } from "../lib/result";
import { CheckingAccount } from "../customer/entities/checking_account";
import { AccountCreator } from "../customer/traits/account_creator";

interface CommitableCheckingAccount extends CheckingAccount, AccountCreator { }

export abstract class OpenAccountHandler {
  abstract commitableAccount(name: string, fiscalNumber: string): CommitableCheckingAccount

  async handle(name: string, fiscalNumber: string): Promise<Result<CommitableCheckingAccount>> {
    let account = this.commitableAccount(name, fiscalNumber)
    try {
      account.mustHaveValidName()
      account.mustHaveValidFiscalNumber()
      await account.createAccount()
      return wrapped(account)
    } catch (err) {
      return wrapped(err)
    }
  }
}