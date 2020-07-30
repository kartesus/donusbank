import { BonusCalculator } from "../traits/bonus_calculator";
import { AccountLedger } from "./account_ledger";
import { FeeCalculator } from "../traits/fee_calculator";

export class TreasuryAccount extends AccountLedger implements BonusCalculator, FeeCalculator {
  calculateBonusFor(amount: number): number {
    let bonus = amount / 200
    return Math.floor(bonus)
  }

  calculateFeeFor(amount: number): number {
    let fee = amount / 100
    return Math.floor(fee)
  }
}