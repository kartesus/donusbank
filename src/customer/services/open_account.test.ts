import { OpenAccount } from "./open_account";
import { CheckingAccount } from "../entities/checking_account";
import { Commitable } from "../traits/commitable";

class TestCommitableCheckingAccount extends CheckingAccount implements Commitable {
  async commit() { }
}

class TestOpenAccount extends OpenAccount {
  commitableAccount(name: string, fiscalNumber: string) {
    let acc = new TestCommitableCheckingAccount(null, name, fiscalNumber)
    jest.spyOn(acc, "commit")
    return acc
  }
}

test("Must validate name", async () => {
  let service = new TestOpenAccount()
  let result = await service.openAccount("", "111.111.111-11")
  expect(result.ok).toBeFalsy()
})

test("Must validate fiscal number", async () => {
  let service = new TestOpenAccount()
  let result = await service.openAccount("Joe", "")
  expect(result.ok).toBeFalsy()
})

test("Must commit valid accounts", async () => {
  let service = new TestOpenAccount()
  let result = await service.openAccount("Joe", "111.111.111.-11")
  if (result.ok === false) throw new Error()
  expect(result.ok).toBeTruthy()
  expect(result.data.commit).toHaveBeenCalled()
})