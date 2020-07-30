import { TreasuryAccount } from "./tresury_account";

test("Bonus is 0 for amounts less then 200", () => {
  let account = new TreasuryAccount("42")
  expect(account.calculateBonusFor(150)).toBe(0)
})

test("Bonus is half percent for amounts bigger than 200", () => {
  let account = new TreasuryAccount("42")
  expect(account.calculateBonusFor(400)).toBe(2)
})

test("There is no fractional cents for bonus", () => {
  let account = new TreasuryAccount("42")
  expect(account.calculateBonusFor(538)).toBe(2)
})

test("Fee is 0 for amounts less than 100", () => {
  let account = new TreasuryAccount("42")
  expect(account.calculateFeeFor(50)).toBe(0)
})

test("Fee is one percent for amounts bigger than 100", () => {
  let account = new TreasuryAccount("42")
  expect(account.calculateFeeFor(200)).toBe(2)
})

test("There is no fractional cents for cents", () => {
  let account = new TreasuryAccount("42")
  expect(account.calculateFeeFor(250)).toBe(2)
})