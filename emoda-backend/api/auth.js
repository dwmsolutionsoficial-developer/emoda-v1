const { authSecret } = require('../config/env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.senha) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const usuario = await app.db('usuario')
            .leftJoin('empresa', 'usuario.emp_id', 'empresa.emp_id')
            .leftJoin('configuracao', 'usuario.emp_id', 'configuracao.emp_id')
            .where({ usu_email: req.body.email })
            .first()

        if (!usuario) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.senha, usuario.usu_senha)

        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: usuario.usu_id,
            nome: usuario.usu_nome,
            email: usuario.usu_email,
            admin: usuario.usu_admin,
            empresa: usuario.emp_id,
            nome_empresa: usuario.emp_nome,
            bloqueado: usuario.usu_bloqueado,
            oculta_pco_custo: usuario.usu_oculta_pco_custo,
            conf_SenhaEditar: usuario.conf_senha_para_editar,
            conf_SenhaExcluir: usuario.conf_senha_para_excluir,
            conf_senhaGeral: usuario.conf_senha_geral,
            exibeBanco: usuario.usu_exibe_banco,
            exibeGrupo: usuario.usu_exibe_grupo,
            exibeMarca: usuario.usu_exibe_marca,
            exibeCor: usuario.usu_exibe_cor,
            exibeTamanho: usuario.usu_exibe_tamanho,
            exibeUnidade: usuario.usu_exibe_unidade,
            exibeCliente: usuario.usu_exibe_cliente,
            exibeFornecedor: usuario.usu_exibe_fornecedor,
            exibeProduto: usuario.usu_exibe_produto,
            exibeCaixa: usuario.usu_exibe_caixa,
            exibeConsignado: usuario.usu_exibe_consignado,
            exibeReceber: usuario.usu_exibe_receber,
            exibeClientesVencer: usuario.usu_exibe_clientes_vencer,
            exibeVendas: usuario.usu_exibe_vendas,
            exibeRelatorios: usuario.usu_exibe_relatorios,
            exibeDevolucoes: usuario.usu_exibe_devolucoes,
            exibeDocumentos: usuario.usu_exibe_documento,
            exibePagamento: usuario.usu_exibe_pagamento,
            exibeRecebimentos: usuario.usu_exibe_recebimento,
            iat: now,
            exp: now + (60 * 60 * 24)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            // problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }
}