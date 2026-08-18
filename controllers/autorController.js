import db from '../models/index.cjs'

class AutorController{
    static async criarAutor(req,res){ 
        try{ 
        const novoAutor = await db.Autor.create(req.body) 
        res.status(201).json({message: 'autor criado', Autor: novoAutor})
       }catch(erro){
        if(erro.name === 'SequelizeValidationError'){
            res.status(400).json({message: 'nao foi possivel fazer o cadastro'})
        }else{
            res.status(500).json({message: 'erro interno do servidor'})
        }
    }
  }
  static async listarAutor(req,res){
    try{
        const listaAutor = await db.Autor.findAll({})
        res.status(200).json({message:'Autor listado com sucesso', Autor: listaAutor})
    }catch(erro){
        res.status(500).json({message: 'erro interno do servidor'})
    }
  }
  static async listaAutorPorId(req,res){
    try{
    const id = req.params.id
    const autorEncontrado = await db.Autor.findByPk(id, {include: [{model: db.Livro, as:'livros'}]})
    if(autorEncontrado === null){
        res.status(404).json({message: 'autor nao encontrado'})
    }else{
        res.status(200).json({message: 'autor encontrado com sucesso', Autor:autorEncontrado})}
    }catch(erro){
        res.status(500).json({message:'erro interno do servidor'})
    }
  }
  static async atualizaAutor(req,res){
    try{
        const id = req.params.id
        const autorAtualizado = await db.Autor.update(req.body, { where: { id: id } });
        if(autorAtualizado[0] === 0){
            res.status(404).json({message: 'autor nao encontrado'})
        }else{
            res.status(200).json({message:'autor atualizado com sucesso'})}
        }catch(erro){
            if(erro.name === 'SequelizeValidationError'){
                res.status(400).json({message: 'nao foi possivel atualizar o id'})
            }else{
                res.status(500).json({message: 'erro interno do servidor'})
            }

        }
    }
    static async deletaAutor(req,res){
        try{const id = req.params.id
        const deletandoAutor = await db.Autor.destroy({ where: { id: id}});
        if(deletandoAutor === 0){
            res.status(404).json({message: 'autor nao encontrado'})
        }else{
            res.status(200).json({message:'autor deletado com sucesso'})}
        }catch(erro){
            res.status(500).json({message: 'erro interno no servidor'})
        }

    }
}

export default AutorController