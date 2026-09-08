module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const grupo = {
            gru_id: req.body.gru_id,
            gru_nome: req.body.nome,
            emp_id: req.body.empresa
        }

        if (req.params.id) grupo.gru_id = req.params.id
        if (req.params.emp_id) grupo.emp_id = req.params.emp_id

        try {
            existsOrError(grupo.gru_nome, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (grupo.gru_id) {
            app.db('grupo')
                .update(grupo)
                .where({ gru_id: grupo.gru_id, emp_id: grupo.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('grupo')
                .insert(grupo)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const produtos = await app.db('produto')
                .where({ gru_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(produtos, 'O grupo possui produtos vinculados.')

            const rowsDeleted = await app.db('grupo')
                .where({ gru_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'O grupo não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('grupo')
            .where({ emp_id: req.params.emp_id })
            .orderBy('gru_nome')
            .then(grupos => res.json(grupos))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('grupo')
            .where({ gru_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(grupo => res.json(grupo))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}