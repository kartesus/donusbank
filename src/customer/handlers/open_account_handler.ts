import { Result, wrapped } from "../../lib/result";
import { PersonalAccount } from "../entities/personal_account";
import { AccountCreator } from "../traits/account_creator";

interface CreatableCheckingAccount extends PersonalAccount, AccountCreator { }

export abstract class OpenAccountHandler {
  abstract creatableAccount(name: string, fiscalNumber: string): CreatableCheckingAccount

  async handle(name: string, fiscalNumber: string): Promise<Result<CreatableCheckingAccount>> {
    let account = this.creatableAccount(name, fiscalNumber)
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