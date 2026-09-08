const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = senha => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(senha, salt)
    }

    const save = async (req, res) => {
        const usuario = {
            usu_id: req.body.id,
            usu_nome: req.body.nome,
            usu_email: req.body.email,
            usu_bloqueado: req.body.bloqueado ? 1 : 0,
            emp_id: req.body.empresa,
            usu_admin: req.body.admin ? 1 : 0,
            usu_senha: req.body.senha,
            usu_confirma_senha: req.body.confirmPassword,
            usu_oculta_pco_custo: req.body.oculta_pco_custo ? 1 : 0,
            usu_exibe_banco: req.body.exibeBanco ? 1 : 0,
            usu_exibe_grupo: req.body.exibeGrupo ? 1 : 0,
            usu_exibe_marca: req.body.exibeMarca ? 1 : 0,
            usu_exibe_cor: req.body.exibeCor ? 1 : 0,
            usu_exibe_tamanho: req.body.exibeTamanho ? 1 : 0,
            usu_exibe_unidade: req.body.exibeUnidade ? 1 : 0,
            usu_exibe_cliente: req.body.exibeCliente ? 1 : 0,
            usu_exibe_fornecedor: req.body.exibeFornecedor ? 1 : 0,
            usu_exibe_produto: req.body.exibeProduto ? 1 : 0,
            usu_exibe_caixa: req.body.exibeCaixa ? 1 : 0,
            usu_exibe_consignado: req.body.exibeConsignado ? 1 : 0,
            usu_exibe_receber: req.body.exibeReceber ? 1 : 0,
            usu_exibe_clientes_vencer: req.body.exibeClientesVencer ? 1 : 0,
            usu_exibe_vendas: req.body.exibeVendas ? 1 : 0,
            usu_exibe_relatorios: req.body.exibeRelatorios ? 1 : 0,
            usu_exibe_devolucoes: req.body.exibeDevolucoes ? 1 : 0,
            usu_exibe_documento: req.body.exibeDocumentos ? 1 : 0,
            usu_exibe_pagamento: req.body.exibePagamento ? 1 : 0,
            usu_exibe_recebimento: req.body.exibeRecebimentos ? 1 : 0
        }

        if (req.params.id) usuario.usu_id = req.params.id
        if (req.params.emp_id) usuario.emp_id = req.params.emp_id

        const url = req.originalUrl.substring(0, 9)

        if (!url.startsWith('/usuarios')) usuario.usu_admin = 0
        //if (!req.usuario || !req.usuario.usu_admin) usuario.usu_admin = false

        try {
            existsOrError(usuario.usu_nome, 'Nome não informado')
            existsOrError(usuario.usu_email, 'E-mail não informado')
            existsOrError(usuario.usu_senha, 'Senha não informada')
            existsOrError(usuario.usu_confirma_senha, 'Confirmação de Senha inválida')
            equalsOrError(usuario.usu_senha, usuario.usu_confirma_senha,
                'Senhas não conferem')

            const usuarioFromDB = await app.db('usuario')
                .where({ usu_email: usuario.usu_email, emp_id: usuario.emp_id }).first()
            if (!usuario.usu_id) {
                notExistsOrError(usuarioFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        usuario.usu_senha = encryptPassword(usuario.usu_senha)
        delete usuario.usu_confirma_senha

        if (usuario.usu_id) {
            app.db('usuario')
                .update(usuario)
                .where({ usu_id: usuario.usu_id, emp_id: usuario.emp_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('usuario')
                .insert(usuario)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('usuario')
            .where({ emp_id: req.params.emp_id })
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('usuario')
            .where({ usu_id: req.params.id, emp_id: req.params.emp_id })
            .first()
            .then(usuario => res.json(usuario))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const consignados = await app.db('consignado')
                .where({ usu_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(consignados, 'Usuário possui consignados vinculados.')

            const contasPagar = await app.db('contas_pagar')
                .where({ usu_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(contasPagar, 'Usuário possui contas à pagar vinculadas.')

            const contasReceber = await app.db('contas_receber')
                .where({ usu_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(contasReceber, 'Usuário possui contas à receber vinculadas.')

            const recebimento = await app.db('recebimento')
                .where({ usu_id: req.params.id, emp_id: req.params.emp_id })
            notExistsOrError(recebimento, 'Usuário possui recebimentos vinculados.')

            const rowsDeleted = await app.db('usuario')
                .where({ usu_id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const todosUsuarios = async (req, res) => {
        try {
            const usuarios = await app.db('usuario')
                .where({ emp_id: req.params.emp_id })
                .orderBy('usu_nome')

            res.json({ data: usuarios })
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove, todosUsuarios }
}