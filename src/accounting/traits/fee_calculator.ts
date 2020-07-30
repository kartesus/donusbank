export interface FeeCalculator {
  calculateFeeFor(amount: number): number
}