import db from '../models/index.cjs'

class EmprestimoController{
    static async criarEmprestimo(req,res){ 
        try{ 
        const novoEmprestimo = await db.Emprestimo.create(req.body) 
        res.status(201).json({message: 'Emprestimo criado', Emprestimo: novoEmprestimo})
       }catch(erro){
        if(erro.name === 'SequelizeValidationError'){
            res.status(400).json({message: 'nao foi possivel fazer o cadastro'})
        }else{
            res.status(500).json({message: 'erro interno do servidor'})
        }
    }
  }
  static async listarEmprestimo(req,res){
    try{
        const listaEmprestimo = await db.Emprestimo.findAll({})
        res.status(200).json({message:'Emprestimo listado com sucesso', Emprestimo: listaEmprestimo})
    }catch(erro){
        res.status(500).json({message: 'erro interno do servidor'})
    }
  }
  static async listaEmprestimoPorId(req,res){
    try{
    const id = req.params.id
    const emprestimoEncontrado = await db.Emprestimo.findByPk(id)
    if(emprestimoEncontrado === null){
        res.status(404).json({message: 'Emprestimo nao encontrado'})
    }else{
        res.status(200).json({message: 'Emprestimo encontrado com sucesso', Emprestimo: emprestimoEncontrado})}
    }catch(erro){
        res.status(500).json({message:'erro interno do servidor'})
    }
  }
  static async atualizaEmprestimo(req,res){
    try{
        const id = req.params.id
        const emprestimoAtualizado = await db.Emprestimo.update(req.body, { where: { id: id } });
        if(emprestimoAtualizado[0] === 0){
            res.status(404).json({message: 'Emprestimo nao encontrado'})
        }else{
            res.status(200).json({message:'Emprestimo atualizado com sucesso'})}
        }catch(erro){
            if(erro.name === 'SequelizeValidationError'){
                res.status(400).json({message: 'nao foi possivel atualizar o id'})
            }else{
                res.status(500).json({message: 'erro interno do servidor'})
            }

        }
    }
    static async deletaEmprestimo(req,res){
        try{const id = req.params.id
        const deletandoEmprestimo = await db.Emprestimo.destroy({ where: { id: id}});
        if(deletandoEmprestimo === 0){
            res.status(404).json({message: 'Emprestimo nao encontrado'})
        }else{
            res.status(200).json({message:'Emprestimo deletado com sucesso'})}
        }catch(erro){
            res.status(500).json({message: 'erro interno no servidor'})
        }

    }
}

export default EmprestimoController