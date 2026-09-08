module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const empresa = {
            emp_id: req.body.id,
            emp_nome: req.body.nome,
            emp_razao_social: req.body.razao_social,
            emp_cpf_cnpj: req.body.cpf_cnpj,
            emp_rg_ie: req.body.rg_ie,
            emp_endereco: req.body.endereco,
            emp_numero: req.body.numero,
            emp_bairro: req.body.bairro,
            emp_complemento: req.body.complemento,
            emp_cep: req.body.cep,
            emp_cidade: req.body.cidade,
            emp_uf: req.body.uf,
            emp_telefone: req.body.telefone,
            emp_celular: req.body.celular,
            emp_whatsapp: req.body.whatsapp,
            emp_email: req.body.email,
            emp_cadastro: req.body.cadastro
        }

        if (req.params.id) empresa.emp_id = req.params.id

        try {
            existsOrError(empresa.emp_nome, 'Nome não informado')
            existsOrError(empresa.emp_razao_social, 'Razão Social não informado')
            existsOrError(empresa.emp_cpf_cnpj, 'CPF/CNPJ não informado')
            existsOrError(empresa.emp_endereco, 'Endereço não informado')
            existsOrError(empresa.emp_cidade, 'Cidade não informada')
            existsOrError(empresa.emp_celular, 'Celular não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (empresa.emp_id) {
            app.db('empresa')
                .update(empresa)
                .where({ emp_id: empresa.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('empresa')
                .insert(empresa)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {

            const caixas = await app.db('caixa')
                .where({ emp_id: req.params.id })
            notExistsOrError(caixas, 'A empresa possui caixas vinculados.')

            const rowsDeleted = await app.db('empresa')
                .where({ emp_id: req.params.id }).del()
            existsOrError(rowsDeleted, 'A empresa não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('empresa')
            .then(empresas => res.json(empresas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('empresa')
            .where({ emp_id: req.params.id })
            .first()
            .then(empresa => res.json(empresa))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}