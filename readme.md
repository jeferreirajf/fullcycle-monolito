# Desafio Sistemas Monolíticos Full Cycle

Neste repositório encontram-se os códigos relativos ao desafio do módulo de **Sistemas Monolíticos** do curso **Full Cycle**.

O desafio foi dividido em dois subdesafios: 
- No primeiro subdesafio, foi necessário criar o módulo de **Invoice** completo da aplicação.
- No segundo subdesafio, uma **API Rest** utilizando **express** e **NodeJS** foi criado.

## Subdesafio 1

Neste subdesafio, o módulo de **Invoice** do sistema foi completamente criado. Isso significa que toda a parte de **domain**, **use cases**, **gateway**, **repository**, **facade** e **facade factory** foram codificadas.

Além disso, todos os testes de unidade também foram desenvolvidos para comprovar o funcionamento do módulo.

## Subdesafio 2

Neste subdesafio, uma **API Rest** foi desenvolvida utilizando **express** e **NodeJS**. Nela, forma criadas os seguintes **endpoints**:

- POST /products
- POST /clients
- POST /checkout/
- GET /invoice/<id>

## Como rodar

Após clonar este repositório, digite o seguinte comando para instalar as dependências:
```npm install```
Depois, para rodar todos os testes, basta digitar:
```npm test```

<sup>OBS: Para rodar o programa é necessário a instalação do Node e do NPM.</sup>