const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

test('Fluxo HTTP completo e validações sem corromper os dados', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function requisicao(metodo, rota, corpo) {
    const resposta = await fetch(base + rota, {
      method: metodo,
      headers: corpo === undefined ? {} : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo)
    });
    return { status: resposta.status, dados: await resposta.json() };
  }
  try {
    let resposta = await requisicao('GET', '/professores');
    assert.equal(resposta.status, 200);
    assert.equal(resposta.dados.length, 2);
    assert.equal(resposta.dados[0].nome, 'Guilherme Renaldino Pichini');
    resposta = await requisicao('GET', '/professores/1');
    const original = resposta.dados;
    assert.equal(resposta.status, 200);
    assert.equal(original.id, 1);
    resposta = await requisicao('GET', '/professores/1/turmas');
    assert.equal(resposta.dados.length, 1);
    resposta = await requisicao('GET', '/professores/departamento/tecnologia');
    assert.equal(resposta.dados.length, 1);
    resposta = await requisicao('GET', '/professores/departamento/Inexistente');
    assert.deepEqual(resposta.dados, []);
    const turma = { codigo: 'ADS2', disciplina: 'Programação Web', alunos: ['Carlos Lima'] };
    resposta = await requisicao('POST', '/professores/1/turmas', turma);
    assert.equal(resposta.status, 201);
    assert.deepEqual(resposta.dados, turma);
    resposta = await requisicao('GET', '/professores/1/turmas');
    assert.equal(resposta.dados.length, 2);
    resposta = await requisicao('POST', '/professores/1/turmas', turma);
    assert.equal(resposta.status, 409);
    resposta = await requisicao('POST', '/professores/1/turmas', { ...turma, alunos: 'inválido' });
    assert.equal(resposta.status, 400);
    const atualizado = { nome: original.nome, idade: 31, departamento: 'Ciências' };
    resposta = await requisicao('PUT', '/professores/1', atualizado);
    assert.equal(resposta.status, 200);
    assert.equal(resposta.dados.id, 1);
    assert.equal(resposta.dados.turmas.length, 2);
    resposta = await requisicao('GET', '/professores/1');
    assert.equal(resposta.dados.idade, 31);
    assert.equal(resposta.dados.departamento, 'Ciências');
    resposta = await requisicao('GET', '/professores/departamento/Ci%C3%AAncias');
    assert.equal(resposta.dados.length, 1);
    for (const corpo of [ { ...atualizado, idade: -1 }, { ...atualizado, id: 99 },
      { ...atualizado, turmas: [turma, turma] }, { ...atualizado, turmas: [null] } ]) {
      resposta = await requisicao('PUT', '/professores/1', corpo);
      assert.equal(resposta.status, 400);
    }
    resposta = await requisicao('GET', '/professores/1');
    assert.equal(resposta.dados.idade, 31);
    assert.equal(resposta.dados.turmas.length, 2);
    resposta = await requisicao('PUT', '/professores/1', { ...atualizado, turmas: [] });
    assert.deepEqual(resposta.dados.turmas, []);
    for (const metodo of ['GET', 'PUT', 'DELETE']) {
      resposta = await requisicao(metodo, '/professores/999', metodo === 'PUT' ? atualizado : undefined);
      assert.equal(resposta.status, 404);
      assert.deepEqual(resposta.dados, { mensagem: 'Id não existente' });
    }
    for (const metodo of ['GET', 'POST']) {
      resposta = await requisicao(metodo, '/professores/999/turmas', metodo === 'POST' ? turma : undefined);
      assert.equal(resposta.status, 404);
    }
    resposta = await requisicao('GET', '/professores/abc');
    assert.equal(resposta.status, 404);
    const malformado = await fetch(base + '/professores/1', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{'
    });
    assert.equal(malformado.status, 400);
    assert.deepEqual(await malformado.json(), { mensagem: 'JSON inválido' });
    resposta = await requisicao('DELETE', '/professores/1');
    assert.equal(resposta.status, 200);
    assert.equal(resposta.dados.professor.nome, original.nome);
    resposta = await requisicao('GET', '/professores');
    assert.equal(resposta.dados.length, 1);
    resposta = await requisicao('DELETE', '/professores/1');
    assert.equal(resposta.status, 404);
    resposta = await requisicao('GET', '/rota-inexistente');
    assert.equal(resposta.status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
