import express from 'express';
import LivroController from '../controllers/livroController.js'
import authMiddleWare from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/livros', authMiddleWare, LivroController.criarLivro);
router.get('/livros', LivroController.listarLivro);
router.get('/livros/:id', LivroController.listaLivroPorId);
router.put('/livros/:id', authMiddleWare, LivroController.atualizaLivro);
router.delete('/livros/:id', authMiddleWare, LivroController.deletaLivro);

export default router