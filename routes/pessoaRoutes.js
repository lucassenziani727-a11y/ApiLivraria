import express from 'express';
import PessoaController from '../controllers/pessoaController.js'

const router = express.Router()

router.post('/pessoas', PessoaController.criarPessoa);
router.get('/pessoas', PessoaController.listarPessoa);
router.get('/pessoas/:id', PessoaController.listaPessoaPorId);
router.put('/pessoas/:id', PessoaController.atualizaPessoa);
router.delete('/pessoas/:id', PessoaController.deletaPessoa);

export default router