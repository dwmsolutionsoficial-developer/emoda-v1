module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const unidade = {
            uni_id: req.body.uni_id,
            uni_sigla: req.body.sigla,
            uni_descricao: req.body.descricao,
            emp_id: req.body.empresa
        }

        if (req.params.id) unidade.uni_id = req.params.id
        if (req.params.emp_id) unidade.emp_id = req.params.emp_id

        try {
            existsOrError(unidade.uni_sigla, 'Sigla não informada')
            existsOrError(unidade.uni_descricao, 'Descrição não informada')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (unidade.uni_id) {
            app.db('unidade')
                .update(unidade)
                .where({ uni_id: unidade.uni_id, emp_id: unidade.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('unidade')
                .insert(unidade)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const produtos = await app.db('produto')
                .where({ uni_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(produtos, 'A Unidade possui produtos vinculados.')

            const rowsDeleted = await app.db('unidade')
                .where({ uni_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'A Unidade não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('unidade')
            .where({ emp_id: req.params.emp_id })
            .orderBy('uni_descricao')
            .then(unidades => res.json(unidades))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('unidade')
            .where({ uni_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(unidade => res.json(unidade))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}