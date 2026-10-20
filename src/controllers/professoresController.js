const professores = require('../data/professores');

function localizar(idRecebido) {
  const id = Number(idRecebido);
  if (!Number.isSafeInteger(id) || id <= 0) return undefined;
  return professores.find(professor => professor.id === id);
}

function naoEncontrado(res) {
  return res.status(404).json({ mensagem: 'Id não existente' });
}

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function turmaValida(turma) {
  return turma && typeof turma === 'object' && !Array.isArray(turma)
    && textoValido(turma.codigo) && textoValido(turma.disciplina)
    && Array.isArray(turma.alunos) && turma.alunos.every(textoValido);
}

function normalizarTurma(turma) {
  return {
    codigo: turma.codigo.trim(),
    disciplina: turma.disciplina.trim(),
    alunos: turma.alunos.map(aluno => aluno.trim())
  };
}

exports.listar = (req, res) => res.json(professores);

exports.buscarPorId = (req, res) => {
  const professor = localizar(req.params.id);
  return professor ? res.json(professor) : naoEncontrado(res);
};

exports.listarTurmas = (req, res) => {
  const professor = localizar(req.params.id);
  return professor ? res.json(professor.turmas) : naoEncontrado(res);
};

exports.listarPorDepartamento = (req, res) => {
  const departamento = req.params.departamento.trim().toLowerCase();
  return res.json(professores.filter(professor => professor.departamento.toLowerCase() === departamento));
};

exports.atualizar = (req, res) => {
  const professor = localizar(req.params.id);
  if (!professor) return naoEncontrado(res);
  const corpo = req.body;
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) {
    return res.status(400).json({ mensagem: 'Envie um objeto JSON.' });
  }
  const { nome, idade, departamento, turmas } = corpo;
  const permitidos = ['nome', 'idade', 'departamento', 'turmas'];
  if (Object.keys(corpo).some(campo => !permitidos.includes(campo))) {
    return res.status(400).json({ mensagem: 'Campos permitidos: nome, idade, departamento e turmas. O id não pode ser alterado.' });
  }
  if (!textoValido(nome) || !Number.isInteger(idade) || idade < 18 || idade > 120 || !textoValido(departamento)
      || (turmas !== undefined && (!Array.isArray(turmas) || !turmas.every(turmaValida)))) {
    return res.status(400).json({ mensagem: 'Informe nome, idade inteira entre 18 e 120 e departamento. Turmas devem conter codigo, disciplina e alunos como lista de nomes.' });
  }
  if (turmas !== undefined) {
    const codigos = turmas.map(turma => turma.codigo.trim().toLowerCase());
    if (new Set(codigos).size !== codigos.length) {
      return res.status(400).json({ mensagem: 'Os códigos das turmas devem ser únicos para o professor.' });
    }
  }
  // Todos os dados são validados antes de alterar o registro.
  professor.nome = nome.trim();
  professor.idade = idade;
  professor.departamento = departamento.trim();
  if (turmas !== undefined) professor.turmas = turmas.map(normalizarTurma);
  return res.json(professor);
};

exports.adicionarTurma = (req, res) => {
  const professor = localizar(req.params.id);
  if (!professor) return naoEncontrado(res);
  if (!turmaValida(req.body)) {
    return res.status(400).json({ mensagem: 'Informe codigo, disciplina e alunos como lista de nomes.' });
  }
  const turma = normalizarTurma(req.body);
  if (professor.turmas.some(item => item.codigo.toLowerCase() === turma.codigo.toLowerCase())) {
    return res.status(409).json({ mensagem: 'Código de turma já cadastrado para este professor.' });
  }
  professor.turmas.push(turma);
  return res.status(201).json(turma);
};

exports.remover = (req, res) => {
  const professor = localizar(req.params.id);
  if (!professor) return naoEncontrado(res);
  const indice = professores.findIndex(item => item.id === professor.id);
  professores.splice(indice, 1);
  return res.json({ mensagem: 'Professor removido com sucesso', professor });
};
