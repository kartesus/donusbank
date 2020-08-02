import CPF from "cpf";
import { BusinessError } from "../../lib/errors";

export class CheckingAccount {
  public ID = ""
  public name = ""
  public fiscalNumber = ""

  constructor(name: string, fiscalNumber: string) {
    this.name = name
    this.fiscalNumber = fiscalNumber
  }

  mustHaveValidName() {
    if (this.name.length < 3) throw new BusinessError("Name must have at least 3 letters")
  }

  mustHaveValidFiscalNumber() {
    if (!CPF.isValid(this.fiscalNumber)) throw new BusinessError("Invalid fiscal number")
  }
}