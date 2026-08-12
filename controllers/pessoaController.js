import db from '../models/index.js'

class PessoaController{
    static async criarPessoa(req,res){ 
        try{ 
        const novaPessoa = await db.Pessoa.create(req.body) 
        res.status(201).json({message: 'pessoa criada', Pessoa: novaPessoa})
       }catch(erro){
        if(erro.name === 'SequelizeValidationError'){
            res.status(400).json({message: 'nao foi possivel fazer o cadastro'})
        }else{
            res.status(500).json({message: 'erro interno do servidor'})
        }
    }
  }
  static async listarPessoa(req,res){
    try{
        const listaPessoa = await db.Pessoa.findAll({})
        res.status(200).json({message:'pessoa listada com sucesso', Pessoa: listaPessoa})
    }catch(erro){
        res.status(500).json({message: 'erro interno do servidor'})
    }
  }
  static async listaPessoaPorId(req,res){
    try{
    const id = req.params.id
    const pessoaEncontrada = await db.Pessoa.findByPk(id)
    if(pessoaEncontrada === null){
        res.status(404).json({message: 'pessoa nao encontrada'})
    }else{
        res.status(200).json({message: 'pessoa encontrada com sucesso', Pessoa:pessoaEncontrada})}
    }catch(erro){
        res.status(500).json({message:'erro interno do servidor'})
    }
  }
  static async atualizaPessoa(req,res){
    try{
        const id = req.params.id
        const pessoaAtualizada = await db.Pessoa.update(req.body, { where: { id: id } });
        if(pessoaAtualizada[0] === 0){
            res.status(404).json({message: 'pessoa nao encontrada'})
        }else{
            res.status(200).json({message:'pessoa atualizada com sucesso'})}
        }catch(erro){
            if(erro.name === 'SequelizeValidationError'){
                res.status(400).json({message: 'nao foi possivel atualizar o id'})
            }else{
                res.status(500).json({message: 'erro interno do servidor'})
            }

        }
    }
    static async deletaPessoa(req,res){
        try{const id = req.params.id
        const deletandoPessoa = await db.Pessoa.destroy({ where: { id: id}});
        if(deletandoPessoa === 0){
            res.status(404).json({message: 'pessoa nao encontrada'})
        }else{
            res.status(200).json({message:'pessoa deletada com sucesso'})}
        }catch(erro){
            res.status(500).json({message: 'erro interno no servidor'})
        }

    }
}

export default PessoaController