import CPF from "cpf";
import { PersonalAccount } from "./personal_account";

test("Name must have at least 3 chars", () => {
  let a1 = new PersonalAccount("xxx", "")
  let a2 = new PersonalAccount("", "")
  expect(() => { a1.mustHaveValidName() }).not.toThrow()
  expect(() => { a2.mustHaveValidName() }).toThrow()
})

test("Fiscal number must be valid", () => {
  let a1 = new PersonalAccount("", CPF.generate())
  let a2 = new PersonalAccount("", CPF.generate(true, true))
  let a3 = new PersonalAccount("", "")
  expect(() => { a1.mustHaveValidFiscalNumber() }).not.toThrow()
  expect(() => { a2.mustHaveValidFiscalNumber() }).toThrow()
})