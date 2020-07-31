import CPF from "cpf";

export class PersonalAccount {
  public ID = ""
  public name = ""
  public fiscalNumber = ""

  constructor(name: string, fiscalNumber: string) {
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