module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const cor = {
            cor_id: req.body.cor_id,
            cor_descricao: req.body.descricao,
            emp_id: req.body.empresa
        }

        if (req.params.id) cor.cor_id = req.params.id
        if (req.params.emp_id) cor.emp_id = req.params.emp_id

        try {
            existsOrError(cor.cor_descricao, 'Descrição não informada')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (cor.cor_id) {
            app.db('cor')
                .update(cor)
                .where({ cor_id: cor.cor_id, emp_id: cor.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('cor')
                .insert(cor)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const produtos = await app.db('produto')
                .where({ cor_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(produtos, 'A Cor possui produtos vinculados.')

            const rowsDeleted = await app.db('cor')
                .where({ cor_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'A Cor não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('cor')
            .where({ emp_id: req.params.emp_id })
            .orderBy('cor_descricao')
            .then(cores => res.json(cores))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('cor')
            .where({ cor_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(cor => res.json(cor))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}