import express from 'express';
import EmprestimoController from '../controllers/emprestimoController.js'

const router = express.Router()

router.post('/emprestimos', EmprestimoController.criarEmprestimo);
router.get('/emprestimos', EmprestimoController.listarEmprestimo);
router.get('/emprestimos/:id', EmprestimoController.listaEmprestimoPorId);
router.put('/emprestimos/:id', EmprestimoController.atualizaEmprestimo);
router.delete('/emprestimos/:id', EmprestimoController.deletaEmprestimo);

export default router