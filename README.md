# Energy Report | Dashboard de Consumo de energia

Esta é uma aplicação Fastify e TypeScript; também utilizei Prisma, Amazon S3 e PostgresQL.

Acesse a aplicação online [clicando aqui](https://energy-report-front.vercel.app/).

#### Aqui está o [Front-end](https://github.com/filiperv7/energyReport_front) desta aplicação.


Energy Report é um gerenciador de faturas de energia. Nele você pode:
- fazer o upload de faturas em PDF;
- vizualizar dashboard de uma fatura com os dados extraído do PDF;
- fazer download da fatura;
- buscar faturas por Nº de Cliente.

## Algumas observações e decisões
Decidi usar o Tsyringe para a Injeção de Dependências, melhorar a qualidade e obedecer os principios SOLID.
Dividi o código entre Controller (rotas), Services (lógica do negócio) e Repositories (requisições ao banco) para melhor desacoplamento do código, tornando a aplicação independente do ORM e do próprio Fastify.
Também utilizei o Amazon S3 para salvar as faturas.

## Como rodar a aplicação (6 passos)
##### 1. Clone o projeto
```bash
git clone https://github.com/filiperv7/energyReport_back.git
```

##### 2. Acesse a pasta do projeto
```bash
cd energyReport_back/
```

##### 3. Faça a instalação dos pacotes
```bash
npm install
```

##### 4. Adicione as variáveis de ambiente usando o arquivo [.env.example](https://github.com/filiperv7/energyReport_back/blob/main/.env.example)
**OBS.**: Para que o arquivo seja salvo para fazer download porteriormente, é necessário criar um bucket no Console da AWS e adicionar as credenciais no .env

**IMPORTANTE**: Caso não faça a integração com o Amazon S3, certifique-se de que ENABLE_S3_UPLOAD esteja diferente de 'true' no .env

##### 5. Faça a migração do banco de dados
```bash
npx prisma generate dev
```

##### 6. Rode a aplicação
```bash
npm run dev
```

##### Obs.: para uma experiência completa, não deixe de rodar também o [Front-end](https://github.com/filiperv7/energyReport_front)
