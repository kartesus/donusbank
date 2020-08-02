import CPF from "cpf";

import { OpenAccountHandler } from "./open_account_handler";
import { CheckingAccount } from "../entities/checking_account"
import { AccountCreator } from "../traits/account_creator";
import { BusinessError } from "../../lib/errors";

class TestCommitablePersonalAccount extends CheckingAccount implements AccountCreator {
  async createAccount() { }
}

class TestOpenAccountHandler extends OpenAccountHandler {
  creatableAccount(name: string, fiscalNumber: string) {
    let acc = new TestCommitablePersonalAccount(name, fiscalNumber)
    jest.spyOn(acc, "createAccount")
    return acc
  }
}

test("Must validate name", async () => {
  let handler = new TestOpenAccountHandler()
  expect(handler.handle("", CPF.generate())).rejects.toBeInstanceOf(BusinessError)
})

test("Must validate fiscal number", async () => {
  let handler = new TestOpenAccountHandler()
  expect(handler.handle("Joe", "")).rejects.toBeInstanceOf(BusinessError)
})

test("Must commit valid accounts", async () => {
  let handler = new TestOpenAccountHandler()
  let result = await handler.handle("Joe", CPF.generate())
  expect(result.createAccount).toHaveBeenCalled()
})