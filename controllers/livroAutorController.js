import db from '../models/index.cjs';

class LivroAutorController{
    static async criandoAssociacaoLivroAutor(req, res){
        try{
            const id = req.params.id;
            const idAutor = req.body.autorId
            const listaLivroPorId = await db.Livro.findByPk(id);
            const listaAutorPorId = await db.Autor.findByPk(idAutor);
            if(listaAutorPorId === null || listaLivroPorId === null){
                res.status(404).json({message: 'esse livro ou autor nao existem'});
            }else{
                const novaAssociacao = await db.LivroAutor.create({
                     livroId: id,
                     autorId: idAutor
                });
                res.status(201).json({message: 'Associação criada com sucesso'})
            }
        }catch(erro){
         res.status(500).json({message:'erro interno no servidor'})
        }
    }
}

export default LivroAutorController