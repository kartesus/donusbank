import CPF from "cpf";

import { OpenAccountHandler } from "./open_account_handler";
import { CheckingAccount } from "../customer/entities/checking_account"
import { AccountCreator } from "../customer/traits/account_creator";

class TestCommitableCheckingAccount extends CheckingAccount implements AccountCreator {
  async createAccount() { }
}

class TestOpenAccountHandler extends OpenAccountHandler {
  commitableAccount(name: string, fiscalNumber: string) {
    let acc = new TestCommitableCheckingAccount(null, name, fiscalNumber)
    jest.spyOn(acc, "createAccount")
    return acc
  }
}

test("Must validate name", async () => {
  let handler = new TestOpenAccountHandler()
  let result = await handler.handle("", CPF.generate())
  expect(result.ok).toBeFalsy()
})

test("Must validate fiscal number", async () => {
  let handler = new TestOpenAccountHandler()
  let result = await handler.handle("Joe", "")
  expect(result.ok).toBeFalsy()
})

test("Must commit valid accounts", async () => {
  let handler = new TestOpenAccountHandler()
  let result = await handler.handle("Joe", CPF.generate())
  expect(result.ok).toBeTruthy()
  if (result.ok === false) throw new Error() // satisfy the typechecker
  expect(result.data.createAccount).toHaveBeenCalled()
})