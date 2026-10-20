const router = require('express').Router();
const controller = require('../controllers/professoresController');

router.get('/', controller.listar);
router.get('/departamento/:departamento', controller.listarPorDepartamento);
router.get('/:id/turmas', controller.listarTurmas);
router.post('/:id/turmas', controller.adicionarTurma);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
