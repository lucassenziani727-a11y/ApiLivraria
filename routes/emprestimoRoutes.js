import express from 'express';
import EmprestimoController from '../controllers/emprestimoController.js'
import authMiddleWare from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/emprestimos', authMiddleWare, EmprestimoController.criarEmprestimo);
router.get('/emprestimos', authMiddleWare, EmprestimoController.listarEmprestimo);
router.get('/emprestimos/:id', authMiddleWare, EmprestimoController.listaEmprestimoPorId);
router.put('/emprestimos/:id', authMiddleWare, EmprestimoController.atualizaEmprestimo);
router.delete('/emprestimos/:id', authMiddleWare, EmprestimoController.deletaEmprestimo);

export default router