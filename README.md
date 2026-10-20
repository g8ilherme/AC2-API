# API REST de Professores — AC2

**Autor: Guilherme Renaldino Pichini**

API em Node.js e Express para gerenciar professores e suas turmas. Rotas e controllers estão separados. Os dados são arrays e objetos JavaScript, sem banco de dados.

## Como executar

É necessário Node.js 18 ou superior com npm. Abra o terminal na pasta que contém package.json:

```bash
npm install
npm start
```

Acesse `http://localhost:3000/professores`. Para parar, pressione Ctrl+C. Opcionalmente, `npm run dev` reinicia o servidor ao editar arquivos.

## Endpoints

| Método | Endpoint | Função |
|---|---|---|
| GET | /professores | Listar todos |
| GET | /professores/:id | Buscar por ID |
| GET | /professores/:id/turmas | Listar turmas |
| PUT | /professores/:id | Atualizar dados |
| POST | /professores/:id/turmas | Adicionar turma |
| GET | /professores/departamento/:departamento | Filtrar por departamento |
| DELETE | /professores/:id | Remover professor |

As lacunas na tabela do enunciado foram interpretadas como parâmetros :id e :departamento. Não há endpoint para criar professores no enunciado: dois registros iniciais estão em src/data/professores.js. A idade inicial de 30 anos é fictícia para demonstração.

### Atualizar professor

PUT http://localhost:3000/professores/1

Body → raw → JSON (Content-Type: application/json):

```json
{
  "nome": "Guilherme Renaldino Pichini",
  "idade": 31,
  "departamento": "Tecnologia"
}
```

Nome, idade e departamento são obrigatórios. A idade deve ser inteira entre 18 e 120. O ID não pode ser alterado. O campo opcional turmas substitui a lista inteira; quando omitido, preserva as turmas existentes. Para esvaziar a lista, envie "turmas": [].

### Adicionar turma

POST http://localhost:3000/professores/1/turmas

```json
{
  "codigo": "ADS2",
  "disciplina": "Programação Web",
  "alunos": ["Carlos Lima", "Daniela Alves"]
}
```

Alunos são representados por nomes e podem formar uma lista vazia. Código e disciplina não podem estar em branco. Códigos repetidos para o mesmo professor são rejeitados.

## Respostas HTTP

- 200: consulta, atualização ou exclusão concluída.
- 201: turma adicionada.
- 400: dados ou JSON inválidos.
- 404: professor ou rota inexistente.
- 409: código de turma já utilizado para o professor.
- 413: corpo da requisição muito grande.

Professores não encontrados retornam status 404 e exatamente este JSON, inclusive em PUT e DELETE:

```json
{ "mensagem": "Id não existente" }
```

O filtro por departamento ignora maiúsculas/minúsculas e retorna [] se não houver correspondências. Acentos devem ser preservados (exemplo: Matemática).

## Persistência em memória

As alterações ficam disponíveis em requisições seguintes enquanto o processo está em execução. Reiniciar restaura os registros iniciais. Cada instância do servidor possui sua própria memória.

## Postman e prints

1. Execute npm start.
2. Importe postman/AC2-professores.postman_collection.json no Postman.
3. Execute as 12 requisições na ordem numérica. A variável baseUrl já aponta para localhost:3000.
4. Capture método, URL, status e resposta de cada requisição e salve em prints.
5. Antes de repetir a sequência, pare e inicie o servidor para restaurar os dados.

A coleção cobre GET, POST, PUT, DELETE, confirmação de inclusão/atualização/exclusão e IDs inexistentes. Seu nome completo aparece no cadastro e na resposta de exclusão. A coleção possui verificações de status e JSON no Postman.

As capturas reais devem ser feitas no Postman ou Thunder Client. A pasta prints contém orientações, não capturas simuladas.

## Testes automatizados

```bash
npm test
```

O teste sobe uma instância HTTP temporária em porta livre, percorre os endpoints e confere alterações em memória, erros, validação, JSON malformado e exclusão. Encerra essa instância ao terminar e não altera um servidor iniciado com npm start.

## Organização e apresentação

- src/server.js: inicia o servidor.
- src/app.js: configura Express, leitura JSON, rotas e erros.
- src/routes/professoresRoutes.js: liga método/endereço ao controller.
- src/controllers/professoresController.js: valida e manipula registros.
- src/data/professores.js: dados iniciais em memória.
- test/api.test.js: teste de integração HTTP.

Consulte APRESENTACAO.md para revisar conceitos e a sequência de demonstração.

## Publicação no GitHub

Crie um repositório público no GitHub e envie todo o conteúdo desta pasta, incluindo os prints reais, README, package.json e package-lock.json. Não envie node_modules: ela está no .gitignore. Envie o link do repositório na atividade. A publicação e os prints devem estar concluídos antes da apresentação.
