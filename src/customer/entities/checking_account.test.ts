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
  let a1 = new CheckingAccount(null, "", "111.111.111-11")
  let a2 = new CheckingAccount(null, "", "111.222.333-44")
  let a3 = new CheckingAccount(null, "", "")
  expect(() => { a1.mustHaveValidFiscalNumber() }).not.toThrow()
  expect(() => { a2.mustHaveValidFiscalNumber() }).toThrow()
})