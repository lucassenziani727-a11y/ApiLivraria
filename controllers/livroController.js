import db from '../models/index.cjs'

class LivroController{
    static async criarLivro(req,res){ 
        try{ 
        const novoLivro = await db.Livro.create(req.body) 
        res.status(201).json({message: 'livro criado', Livro: novoLivro})
       }catch(erro){
        if(erro.name === 'SequelizeValidationError'){
            res.status(400).json({message: 'nao foi possivel fazer o cadastro'})
        }else{
            res.status(500).json({message: 'erro interno do servidor'})
        }
    }
  }
  static async listarLivro(req,res){
    try{
        const listaLivro = await db.Livro.findAll({})
        res.status(200).json({message:'Livro listado com sucesso', Livro: listaLivro})
    }catch(erro){
        res.status(500).json({message: 'erro interno do servidor'})
    }
  }
  static async listaLivroPorId(req,res){
    try{
    const id = req.params.id
    const livroEncontrado = await db.Livro.findByPk(id, {include: [{model: db.Autor, as: 'autores'}]})
    if(livroEncontrado === null){
        res.status(404).json({message: 'livro nao encontrado'})
    }else{
        res.status(200).json({message: 'livro encontrado com sucesso', Livro:livroEncontrado})}
    }catch(erro){
        res.status(500).json({message:'erro interno do servidor'})
    }
  }
  static async atualizaLivro(req,res){
    try{
        const id = req.params.id
        const livroAtualizado = await db.Livro.update(req.body, { where: { id: id } });
        if(livroAtualizado[0] === 0){
            res.status(404).json({message: 'livro nao encontrado'})
        }else{
            res.status(200).json({message:'livro atualizado com sucesso'})}
        }catch(erro){
            if(erro.name === 'SequelizeValidationError'){
                res.status(400).json({message: 'nao foi possivel atualizar o id'})
            }else{
                res.status(500).json({message: 'erro interno do servidor'})
            }

        }
    }
    static async deletaLivro(req,res){
        try{const id = req.params.id
        const deletandoLivro = await db.Livro.destroy({ where: { id: id}});
        if(deletandoLivro === 0){
            res.status(404).json({message: 'livro nao encontrado'})
        }else{
            res.status(200).json({message:'livro deletado com sucesso'})}
        }catch(erro){
            res.status(500).json({message: 'erro interno no servidor'})
        }

    }
}

export default LivroController