import express from 'express';
import AutorController from '../controllers/autorController.js'

const router = express.Router()

router.post('/autores', AutorController.criarAutor);
router.get('/autores', AutorController.listarAutor);
router.get('/autores/:id', AutorController.listaAutorPorId);
router.put('/autores/:id', AutorController.atualizaAutor);
router.delete('/autores/:id', AutorController.deletaAutor);

export default router