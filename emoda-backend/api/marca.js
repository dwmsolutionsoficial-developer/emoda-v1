module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const marca = {
            mar_id: req.body.mar_id,
            mar_nome: req.body.nome,
            emp_id: req.body.empresa
        }

        if (req.params.id) marca.mar_id = req.params.id
        if (req.params.emp_id) marca.emp_id = req.params.emp_id

        try {
            existsOrError(marca.mar_nome, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (marca.mar_id) {
            app.db('marca')
                .update(marca)
                .where({ mar_id: marca.mar_id, emp_id: marca.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('marca')
                .insert(marca)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const produtos = await app.db('produto')
                .where({ mar_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(produtos, 'O marca possui produtos vinculados.')

            const rowsDeleted = await app.db('marca')
                .where({ mar_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'O marca não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('marca')
            .where({ emp_id: req.params.emp_id })
            .orderBy('mar_nome')
            .then(marcas => res.json(marcas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('marca')
            .where({ mar_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(marca => res.json(marca))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}