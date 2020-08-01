import CPF from "cpf";
import { CheckingAccount } from "./checking_account";

test("Name must have at least 3 chars", () => {
  let a1 = new CheckingAccount("xxx", "")
  let a2 = new CheckingAccount("", "")
  expect(() => { a1.mustHaveValidName() }).not.toThrow()
  expect(() => { a2.mustHaveValidName() }).toThrow()
})

test("Fiscal number must be valid", () => {
  let a1 = new CheckingAccount("", CPF.generate())
  let a2 = new CheckingAccount("", CPF.generate(true, true))
  let a3 = new CheckingAccount("", "")
  expect(() => { a1.mustHaveValidFiscalNumber() }).not.toThrow()
  expect(() => { a2.mustHaveValidFiscalNumber() }).toThrow()
})