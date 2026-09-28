import express from 'express';
import PessoaController from '../controllers/pessoaController.js'
import authMiddleWare from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/pessoas', PessoaController.criarPessoa);
router.post('/login', PessoaController.login);
router.get('/pessoas', authMiddleWare, PessoaController.listarPessoa);
router.get('/pessoas/:id', authMiddleWare,  PessoaController.listaPessoaPorId);
router.put('/pessoas/:id', authMiddleWare, PessoaController.atualizaPessoa);
router.delete('/pessoas/:id', authMiddleWare,  PessoaController.deletaPessoa);

export default router