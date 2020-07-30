import { v4 as uuid } from "uuid";
import CPF from "cpf";

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
    if (!CPF.isValid(this.fiscalNumber)) throw new Error("Invalid fiscal number")
  }
}