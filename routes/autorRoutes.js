import express from 'express';
import AutorController from '../controllers/autorController.js'
import authMiddleWare from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/autores', authMiddleWare, AutorController.criarAutor);
router.get('/autores', AutorController.listarAutor);
router.get('/autores/:id', AutorController.listaAutorPorId);
router.put('/autores/:id', authMiddleWare, AutorController.atualizaAutor);
router.delete('/autores/:id', authMiddleWare, AutorController.deletaAutor);

export default router