module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const pagar = {
            cp_id: req.body.id,
            cp_documento: req.body.documento,
            com_id: req.body.com_id,
            for_id: req.body.for_id,
            cp_emissao: req.body.emissao,
            cp_vencimento: req.body.vencimento,
            cp_valor: req.body.valor,
            emp_id: req.body.empresa
        }

        if (req.params.id) pagar.cp_id = req.params.id
        if (req.params.emp_id) pagar.emp_id = req.params.emp_id

        try {
            existsOrError(pagar.cp_documento, 'Documento não informado')
            existsOrError(pagar.for_id, 'Fornecedor não informado')
            existsOrError(pagar.cp_emissao, 'Data de emissão não informada')
            existsOrError(pagar.cp_vencimento, 'Data de vencimento não informada')
            existsOrError(pagar.cp_valor, 'Valor não informado')

            const pagarFromDB = await app.db('contas_pagar')
                .where({ cp_documento: pagar.cp_documento, for_id: pagar.for_id, emp_id: pagar.emp_id }).first()
            if (!pagar.cp_id) {
                notExistsOrError(pagarFromDB, 'Documento já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (pagar.pagar_id) {
            app.db('contas_pagar')
                .update(pagar)
                .where({ cp_id: pagar.cp_id, emp_id: pagar.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('contas_pagar')
                .insert(pagar)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const compras = await app.db('compra')
                .where({ com_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(compras, 'Esse documento pertence a uma nota de compra.')

            const rowsDeleted = await app.db('contas_pagar')
                .where({ cp_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'O documento não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const limit = 100
    const get = async (req, res) => {
        app.db('contas_pagar')
            .where({ emp_id: req.params.emp_id })
            .orderBy('pagar_descricao')
            .then(contasPagar => res.json(contasPagar))
            .catch(err => res.status(500).send(err))

        try {
            const page = req.query.page || 1

            const result = await app.db('contas_pagar').count('cp_id as id').where({ emp_id: req.params.emp_id }).first()
            const count = parseInt(result.id)

            const contas_pagar = await app.db('contas_pagar')
                .where({ emp_id: req.params.emp_id })
                .limit(limit).offset(page * limit - limit)
                .orderBy('cr_emissao', 'desc')

            res.json({ data: contas_pagar, count, limit })
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const getById = (req, res) => {
        app.db('contas_pagar')
            .where({ cp_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(pagar => res.json(pagar))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}