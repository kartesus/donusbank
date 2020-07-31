# Donus Challenge
> Seu objetivo é criar uma API com algumas funções essenciais relacionadas ao gerenciamento de contas bancárias. 
> Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa.
>
>    - Com essa conta é possível realizar transferências para outras contas, depositar e retirar o dinheiro;
>    - Ao depositar dinheiro na conta, o cliente recebe da Donus mais meio por cento do valor depositado como bônus;
>    - Ao retirar o dinheiro é cobrado o valor de um por cento sobre o valor retirado, e não aceitamos valores negativos nas contas;
>    - As transferências entre contas são gratuitas e ilimitadas;
>    - É importante ter o histórico de todas as movimentações dos clientes.

## Setup
```bash
docker run -p "5432:5432" --name postgresql -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres
docker exec postgresql createdb -U postgres donusbank
docker exec postgresql createdb -U postgres donusbank_test

npm install
POSTGRES_URL='postgres://postgres@localhost/donusbank' npm run migration
POSTGRES_URL='postgres://postgres@localhost/donusbank_test' npm run migration
```

## Tests
```bash
npm run test
```

or 
```bash
npm run converage
```

## Server
```bash
POSTGRES_URL='postgres://postgres@localhost/donusbank' npm run server:dev
```
