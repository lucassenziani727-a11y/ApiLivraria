import express from 'express';
import LivroAutorController from '../controllers/livroAutorController.js';

const router = express.Router()

router.post('/livros/:id/autores', LivroAutorController.criandoAssociacaoLivroAutor);

export default router;