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
npm install
```

## Tests
```bash
docker exec postgresql createdb -U postgres donusbank_test
POSTGRES_URL='postgres://postgres@localhost/donusbank_test' npm run migration
npm run test
npm run converage
```

## Server
```bash
docker exec postgresql createdb -U postgres donusbank
POSTGRES_URL='postgres://postgres@localhost/donusbank' npm run migration
POSTGRES_URL='postgres://postgres@localhost/donusbank' PORT=3000 npm run server:dev

http POST :3000/accounts name="Alice" fiscalNumber="93273450029" 
http POST :3000/accounts name="Bob" fiscalNumber="25286926096" 
http POST :3000/accounts/93273450029/deposits amount=500 
http POST :3000/accounts/93273450029/withdraws amount=100 
http POST :3000/transfers sourceFiscalNumber=93273450029 destinationFiscalNumber=25286926096 amount=100 
```

Requests na CLI usam [HTTPie](https://httpie.org/).

## Arquitetura
 - Cada pasta em  `src/` é considerada um módulo.
 - `accounting/` e `customer/` são módulos que encapsulam domínios do banco e por isso são módulos mais conceituais, focados nas regras de negócio e fornecendo interfaces, classes abstratas e estruturas de dados.
 - `platform/` implementa classes concretas quem conectam os conceitos do domínio com a infraestrutura tecnológica como bancos de dados, servidores HTTP, filas, etc.
 - `lib/` oferece tipos simples e funções auxiliares que podem ser compartilhados por todos os módulos e não possuem regras de negócio ou conexão com uma técnologia específica.
 - A dependência entre módulos é unidirecional `server.ts -> platform -> accounting/customer -> lib`. Logo cada módulo pode ser publicado como um pacote npm ou micro serviço.
 - `plataform/` isola responsabilidades relacionadas a segurança, performance, etc.
 - `entities/` capturam, em estruturas de dados, alguns dos substantivos mais importantes do domínio e transformações que eles sofrem.
 - `handlers/` define os objetos que participam dos casos de uso do domínio, assim como a maneira como eles interagem. Estes objetos são definidos em termos do papel que cumprem no caso de uso (_traits_) ao invés de classes concretas.
 - `traits/` define as interfaces que devem ser implementadas por objetos que sejam usados na execução dos casos de uso do domínio. Em `platform/` um mesmo objeto pode implementar multiplas interfaces.