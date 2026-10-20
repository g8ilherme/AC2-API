// Este array é compartilhado pelos controllers e reiniciado ao parar a API.
module.exports = [
  {
    id: 1,
    nome: 'Guilherme Renaldino Pichini',
    idade: 30,
    departamento: 'Tecnologia',
    turmas: [
      { codigo: 'ADS1', disciplina: 'Desenvolvimento de API REST', alunos: ['Ana Souza', 'Bruno Silva'] }
    ]
  },
  { id: 2, nome: 'Mariana Santos', idade: 35, departamento: 'Matemática', turmas: [] }
];
