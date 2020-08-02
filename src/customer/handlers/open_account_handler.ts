import { CheckingAccount } from "../entities/checking_account";
import { AccountCreator } from "../traits/account_creator";
import { BusinessError } from "../../lib/errors";

interface CreatableCheckingAccount extends CheckingAccount, AccountCreator { }

export abstract class OpenAccountHandler {
  abstract creatableAccount(name: string, fiscalNumber: string): CreatableCheckingAccount

  async handle(name: string, fiscalNumber: string): Promise<CreatableCheckingAccount> {
    let account = this.creatableAccount(name, fiscalNumber)
    try {
      account.mustHaveValidName()
      account.mustHaveValidFiscalNumber()
      await account.createAccount()
      return account
    } catch (err) {
      throw new BusinessError(err.message)
    }
  }
}