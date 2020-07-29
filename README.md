# Donus Challenge

> Seu objetivo é criar uma API com algumas funções essenciais relacionadas ao gerenciamento de contas bancárias. 
> Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa.
>
>    - Com essa conta é possível realizar transferências para outras contas, depositar e retirar o dinheiro;
>    - Ao depositar dinheiro na conta, o cliente recebe da Donus mais meio por cento do valor depositado como bônus;
>    - Ao retirar o dinheiro é cobrado o valor de um por cento sobre o valor retirado, e não aceitamos valores negativos nas contas;
>    - As transferências entre contas são gratuitas e ilimitadas;
>    - É importante ter o histórico de todas as movimentações dos clientes.

# Testes

Para rodar testes
```
$ npm run test
```

Para ver cobertura
```
$ npm run converage
```

Cobertura de teste no validador de CPF é baixa porque eu não implementei o algoritmo e estou
só cobrindo o caso básico garantindo que CPFs sabidamente válidos vão passar e sabidamente inválidos
vão dar erro.