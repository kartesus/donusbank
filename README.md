# Donus Challenge
> Seu objetivo é criar uma API com algumas funções essenciais relacionadas ao gerenciamento de contas bancárias. 
> Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa.
>
>    - Com essa conta é possível realizar transferências para outras contas, depositar e retirar o dinheiro;
>    - Ao depositar dinheiro na conta, o cliente recebe da Donus mais meio por cento do valor depositado como bônus;
>    - Ao retirar o dinheiro é cobrado o valor de um por cento sobre o valor retirado, e não aceitamos valores negativos nas contas;
>    - As transferências entre contas são gratuitas e ilimitadas;
>    - É importante ter o histórico de todas as movimentações dos clientes.

# Tests
```
$ npm run test
```

or 
```
$ npm run converage
```

# Folder structure

Each folder represents a module and in theory could be deployed independently.

```
.
├── src
│   ├── accounting
│   ├── bank
│   ├── customer
│   ├── lib
│   └── platform
```

## Accounting
Implements a simple double-entry accounting system. Every transaction has two entries and for 
use cases like deposit and withdraw we introduced a special account representing the bank treasury
to be either source or destination of the money.

## Bank
Implements the 4 challenge use cases: open account, deposit, withdraw and transfer.

## Customer
Implements the customer centric aspects of banking like the concept of a checking account

## Lib
Helper code that can be useful system wide

## Platform
Implements the connection of the architecture with the real world of databases, networking, etc.