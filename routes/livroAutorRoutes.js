import express from 'express';
import LivroAutorController from '../controllers/livroAutorController.js';
import authMiddleWare from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/livros/:id/autores', authMiddleWare, LivroAutorController.criandoAssociacaoLivroAutor);

export default router;