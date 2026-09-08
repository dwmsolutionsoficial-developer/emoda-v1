module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const tamanho = {
            tam_id: req.body.tam_id,
            tam_sigla: req.body.sigla,
            tam_descricao: req.body.descricao,
            emp_id: req.body.empresa
        }

        if (req.params.id) tamanho.tam_id = req.params.id
        if (req.params.emp_id) tamanho.emp_id = req.params.emp_id

        try {
            existsOrError(tamanho.tam_sigla, 'Sigla não informada')
            existsOrError(tamanho.tam_descricao, 'Descrição não informada')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (tamanho.tam_id) {
            app.db('tamanho')
                .update(tamanho)
                .where({ tam_id: tamanho.tam_id, emp_id: tamanho.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('tamanho')
                .insert(tamanho)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const produtos = await app.db('produto')
                .where({ tam_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(produtos, 'O Tamanho possui produtos vinculados.')

            const rowsDeleted = await app.db('tamanho')
                .where({ tam_id: req.params.id, emp_id: req.params.emp_id }).del()
            existsOrError(rowsDeleted, 'O Tamanho não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('tamanho')
            .where({ emp_id: req.params.emp_id })
            .orderBy('tam_descricao')
            .then(tamanhos => res.json(tamanhos))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('tamanho')
            .where({ tam_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(tamanho => res.json(tamanho))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}