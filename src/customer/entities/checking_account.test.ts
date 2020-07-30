import CPF from "cpf";
import { CheckingAccount } from "./checking_account";

test("Generates UUID when ID is null", () => {
  let a1 = new CheckingAccount(null, "", "")
  let a2 = new CheckingAccount("xxx", "", "")
  expect(a1.ID).not.toBeNull()
  expect(a2.ID).toEqual("xxx")
})

test("Name must have at least 3 chars", () => {
  let a1 = new CheckingAccount(null, "xxx", "")
  let a2 = new CheckingAccount(null, "", "")
  expect(() => { a1.mustHaveValidName() }).not.toThrow()
  expect(() => { a2.mustHaveValidName() }).toThrow()
})

test("Fiscal number must be valid", () => {
  let a1 = new CheckingAccount(null, "", CPF.generate())
  let a2 = new CheckingAccount(null, "", CPF.generate(true, true))
  let a3 = new CheckingAccount(null, "", "")
  expect(() => { a1.mustHaveValidFiscalNumber() }).not.toThrow()
  expect(() => { a2.mustHaveValidFiscalNumber() }).toThrow()
})