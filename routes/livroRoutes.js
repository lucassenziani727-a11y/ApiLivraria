import express from 'express';
import LivroController from '../controllers/livroController.js'

const router = express.Router()

router.post('/livros', LivroController.criarLivro);
router.get('/livros', LivroController.listarLivro);
router.get('/livros/:id', LivroController.listaLivroPorId);
router.put('/livros/:id', LivroController.atualizaLivro);
router.delete('/livros/:id', LivroController.deletaLivro);

export default router