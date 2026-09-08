module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const banco = {
            ban_id: req.body.ban_id,
            ban_nome: req.body.nome,
            ban_agencia: req.body.agencia,
            ban_operacao: req.body.operacao,
            ban_conta: req.body.conta,
            ban_saldo: req.body.ban_saldo,
            emp_id: req.body.empresa
        }

        if (req.params.id) banco.ban_id = req.params.id
        if (req.params.emp_id) banco.emp_id = req.params.emp_id
        if (banco.ban_saldo === undefined) banco.ban_saldo = 0.00

        try {
            existsOrError(banco.ban_nome, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (banco.ban_id) {
            app.db('banco')
                .update(banco)
                .where({ ban_id: banco.ban_id, emp_id: banco.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('banco')
                .insert(banco)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const caixas = await app.db('caixa')
                .where({ ban_id: req.params.id })
            notExistsOrError(caixas, 'O Banco possui caixas vinculados.')

            const rowsDeleted = await app.db('banco')
                .where({ ban_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'O Banco não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('banco')
            .where({ emp_id: req.params.emp_id })
            .then(bancos => res.json(bancos))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('banco')
            .where({ ban_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(banco => res.json(banco))
            .catch(err => res.status(500).send(err))
    }

    const atualizaSaldo = async (req, res) => {
        const banco = {
            ban_id: req.body.ban_id,
            ban_saldo: req.body.total,
            emp_id: req.body.empresa
        }

        if (req.params.id) banco.ban_id = req.params.id
        if (req.params.emp_id) banco.emp_id = req.params.emp_id
        if (banco.ban_saldo === undefined) banco.ban_saldo = 0.00

        const result = await app.db('banco')
            .where({ ban_id: banco.ban_id, emp_id: banco.emp_id })

        banco.ban_saldo = banco.ban_saldo + result[0].ban_saldo

        if (banco.ban_id) {
            app.db('banco')
                .update(banco)
                .where({ ban_id: banco.ban_id, emp_id: banco.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    return { save, remove, get, getById, atualizaSaldo }
}