module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const configuracao = {
            conf_id: req.body.conf_id,
            conf_numero_venda: req.body.numeroVenda,
            conf_senha_para_editar: req.body.senhaEditar === true ? 1 : 0,
            conf_senha_para_excluir: req.body.senhaExcluir === true ? 1 : 0,
            conf_senha_geral: req.body.senhaGeral,
            emp_id: req.body.empresa
        }

        if (req.params.id) configuracao.conf_id = req.params.id
        if (req.params.emp_id) configuracao.emp_id = req.params.emp_id

        try {
            existsOrError(configuracao.conf_numero_venda, 'Número de Venda não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (configuracao.conf_id) {
            app.db('configuracao')
                .update(configuracao)
                .where({ conf_id: configuracao.conf_id, emp_id: configuracao.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('configuracao')
                .insert(configuracao)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('configuracao')
            .where({ emp_id: req.params.emp_id })
            .then(configuracoes => res.json(configuracoes))
            .catch(err => res.status(500).send(err))
    }

    const verificaNumeroDocumento = async (req, res) => {

        try {
            const consignado = await app.db('consignado')
                .count('con_id as id')
                .where({ con_documento: req.params.documento, emp_id: req.params.emp_id })
                .first()
            const count = parseInt(consignado.id)

            res.json(count)
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    return { save, get, verificaNumeroDocumento }
}