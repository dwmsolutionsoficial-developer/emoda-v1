module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const fornecedor = {
            for_id: req.body.for_id,
            for_nome: req.body.nome,
            for_fisica_juridica: req.body.tipoPessoa,
            for_cpf: req.body.cpf,
            for_rg: req.body.rg,
            for_cnpj: req.body.cnpj,
            for_ie: req.body.ie,
            for_endereco: req.body.endereco,
            for_numero: req.body.numero,
            for_bairro: req.body.bairro,
            for_complemento: req.body.complemento,
            for_cep: req.body.cep,
            for_cidade: req.body.cidade,
            for_uf: req.body.uf,
            for_telefone: req.body.telefone,
            for_celular: req.body.celular,
            for_whatsapp: req.body.whatsapp,
            for_email: req.body.email,
            for_bloqueado: req.body.bloqueado,
            for_cadastro: req.body.cadastro,
            emp_id: req.body.empresa
        }


        if (req.params.id) fornecedor.for_id = req.params.id
        if (req.params.emp_id) fornecedor.emp_id = req.params.emp_id

        try {
            existsOrError(fornecedor.for_nome, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (fornecedor.for_id) {
            app.db('fornecedor')
                .update(fornecedor)
                .where({ for_id: fornecedor.for_id, emp_id: fornecedor.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('fornecedor')
                .insert(fornecedor)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const compras = await app.db('compra')
                .where({ for_id: req.params.id })
            notExistsOrError(compras, 'O Fornecedor possui Compras vinculadas.')

            const contas_pagar = await app.db('contas_pagar')
                .where({ for_id: req.params.id })
            notExistsOrError(contas_pagar, 'O Fornecedor possui Contas a Pagar vinculadas.')

            const rowsDeleted = await app.db('fornecedor')
                .where({ for_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'O Fornecedor não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const limit = 100
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('fornecedor').count('for_id').where({ emp_id: req.params.emp_id }).first()
        const count = parseInt(result.count)

        app.db('fornecedor')
            .where({ emp_id: req.params.emp_id })
            .limit(limit).offset(page * limit - limit)
            .orderBy('for_nome')
            .then(fornecedores => res.json(fornecedores, count, limit))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('fornecedor')
            .where({ for_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(fornecedor => res.json(fornecedor))
            .catch(err => res.status(500).send(err))
    }

    const todosFornecedores = async (req, res) => {
        try {
            const fornecedores = await app.db('fornecedor')
                .where({ emp_id: req.params.emp_id })
                .orderBy('for_nome')

            res.json({ data: fornecedores })
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, remove, get, getById, todosFornecedores }
}