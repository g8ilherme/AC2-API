# Roteiro de apresentação

Autor: Guilherme Renaldino Pichini

## Demonstração

1. Execute npm start e mostre a mensagem com o endereço da API.
2. No Postman, abra a coleção e liste os professores; destaque seu nome completo.
3. Busque o professor 1 e liste suas turmas.
4. Adicione a turma ADS2 com POST e confirme com GET.
5. Atualize a idade de 30 para 31 usando PUT e confirme com GET.
6. Liste professores do departamento Tecnologia.
7. Atualize o ID 999 e mostre status 404 com "Id não existente".
8. Exclua o professor 1 e consulte a lista para confirmar sua ausência.
9. Tente excluí-lo novamente e mostre a mensagem de ID inexistente.

As requisições estão numeradas na coleção. Reinicie a API antes de repetir a demonstração.

## Perguntas para estudar

**Qual a diferença entre rota e controller?**
A rota relaciona um método HTTP e uma URL a uma função. O controller contém a lógica que lê os dados, valida, consulta ou modifica o array e responde.

**Como o ID chega ao controller?**
A rota usa :id, por exemplo /professores/:id. Em /professores/1, req.params.id contém a string "1". Number converte para comparar com o ID numérico do array.

**O que são req.body e res.json?**
req.body contém o corpo JSON convertido em objeto pelo middleware express.json(). res.json envia uma resposta no formato JSON.

**Como o professor é localizado?**
find percorre o array e retorna o primeiro objeto cujo ID corresponde ao informado. Se não houver resultado, retorna undefined e o controller responde 404.

**Como funciona a atualização?**
O controller localiza o objeto, valida todos os campos e atribui os novos valores. Como é o mesmo objeto guardado no array, o próximo GET vê os novos dados. O ID permanece igual.

**Como funciona a exclusão?**
findIndex encontra a posição do professor no array. splice(indice, 1) remove um elemento nessa posição. Verificar a existência antes impede remover o último elemento por engano com índice -1.

**Como uma turma é adicionada?**
O controller valida codigo, disciplina e alunos, verifica se o código já existe e usa push no array professor.turmas.

**Qual a diferença entre find e filter?**
find retorna um objeto ou undefined. filter retorna um novo array com todas as correspondências; sem resultados, retorna [].

**Qual o papel dos métodos HTTP?**
GET consulta; POST adiciona uma turma; PUT atualiza os dados do professor; DELETE remove o professor.

**Por que as alterações desaparecem ao reiniciar?**
Elas existem na memória do processo. Ao reiniciar, o módulo de dados é carregado novamente com os registros iniciais; não existe banco nem escrita em arquivo.

**Por que separar app.js de server.js?**
app.js monta a aplicação. server.js abre a porta. O teste consegue importar a aplicação e abrir uma porta temporária própria.
