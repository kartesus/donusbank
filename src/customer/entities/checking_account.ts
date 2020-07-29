import { v4 as uuid } from "uuid";

export class CheckingAccount {
  public ID = ""
  public name = ""
  public fiscalNumber = ""

  constructor(id: string | null, name: string, fiscalNumber: string) {
    this.ID = id === null ? uuid() : id
    this.name = name
    this.fiscalNumber = fiscalNumber
  }

  mustHaveValidName() {
    if (this.name.length < 3) throw new Error("Name must have at least 3 letters")
  }

  mustHaveValidFiscalNumber() {
    this.fiscalNumber = this.fiscalNumber.replace(/[^\d]+/g, '')
    if (this.fiscalNumber === '') throw new Error("Invalid this.fiscal number")
    if (this.fiscalNumber.length !== 11) throw new Error("Invalid this.fiscal number")
    let v1 = 0
    for (let i = 0; i < 9; i++) v1 += parseInt(this.fiscalNumber.charAt(i)) * (10 - i)
    v1 = 11 - (v1 % 11)
    if (v1 == 10 || v1 == 11) v1 = 0
    if (v1 != parseInt(this.fiscalNumber.charAt(9))) throw new Error("Invalid this.fiscal number")
    let v2 = 0
    for (let i = 0; i < 10; i++) v2 += parseInt(this.fiscalNumber.charAt(i)) * (11 - i)
    v2 = 11 - (v2 % 11)
    if (v2 == 10 || v2 == 11) v2 = 0
    if (v2 != parseInt(this.fiscalNumber.charAt(10))) throw new Error("Invalid this.fiscal number")
  }
}