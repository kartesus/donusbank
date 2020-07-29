import { Result, wrapped } from "../../lib/result";
import { CheckingAccount } from "../entities/checking_account";
import { Commitable } from "../traits/commitable";

interface CommitableCheckingAccount extends CheckingAccount, Commitable { }

export abstract class OpenAccount {
  abstract commitableAccount(name: string, fiscalNumber: string): CommitableCheckingAccount

  async openAccount(name: string, fiscalNumber: string): Promise<Result<CommitableCheckingAccount>> {
    let account = this.commitableAccount(name, fiscalNumber)
    try {
      account.mustHaveValidName()
      account.mustHaveValidFiscalNumber()
      await account.commit()
      return wrapped(account)
    } catch (err) {
      return wrapped(err)
    }
  }
}