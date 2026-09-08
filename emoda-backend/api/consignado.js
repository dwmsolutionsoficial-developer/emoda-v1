module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;
  const dateFormat = require("dateformat");
  const fs = require("fs");
  const config = require("../knexfile.js");
  const knex = require("knex")(config);

  const save = async (req, res) => {
    const consignado = {
      con_id: req.body.con_id,
      con_documento: req.body.documento,
      con_data: stringToDate(req.body.data),
      cli_id: req.body.cliente,
      con_total: req.body.total === null ? 0 : req.body.total,
      con_total_desconto: req.body.totalDesconto,
      con_status: req.body.status,
      usu_id: req.body.usuario,
      con_vendedor: req.body.vendedor,
      emp_id: req.body.empresa,
    };

    var consignado_produtos = Object.keys(req.body.itens).map(function (key) {
      return req.body.itens[key];
    });

    if (req.params.id) consignado.con_id = req.params.id;
    if (req.params.emp_id) consignado.emp_id = req.params.emp_id;

    try {
      existsOrError(consignado.cli_id, "Cliente não informado");
      existsOrError(consignado.con_total, "Valor Total está zerado!");
      existsOrError(consignado.con_documento, "Erro. Tente Novamente!");
      if (consignado_produtos.length <= 0) {
        existsOrError("", "Não há produtos neste documento");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (consignado.con_id) {
      var prod = [];

      for (let i = 0; i < consignado_produtos.length; i++) {
        var aux = {
          con_documento: consignado_produtos[i].con_documento,
          pro_id: consignado_produtos[i].pro_id,
          conit_produto: consignado_produtos[i].conit_produto,
          conit_quantidade: consignado_produtos[i].conit_quantidade,
          conit_preco_venda: consignado_produtos[i].conit_preco_venda,
          conit_desconto: consignado_produtos[i].conit_desconto,
          conit_total: consignado_produtos[i].conit_total,
          emp_id: consignado_produtos[i].emp_id,
        };
        prod.push(aux);
      }

      const rowsDeleted1 = await app
        .db("consignado_item")
        .where({
          con_documento: consignado.con_documento,
          emp_id: req.params.emp_id,
        })
        .del();

      const rowsDeleted2 = await app
        .db("consignado")
        .where({
          con_documento: consignado.con_documento,
          emp_id: req.params.emp_id,
        })
        .del();

      if (rowsDeleted1 > 0 && rowsDeleted2 > 0) {
        await app
          .db("consignado")
          .insert(consignado)
          .then(function (ret) {
            app
              .db("consignado_item")
              .insert(prod)
              .then((_) => res.status(204).send())
              .catch((err) => res.status(500).send(err));
          });
      }
    } else {
      const numeroVenda = await app
        .db("configuracao")
        .where({ emp_id: req.params.emp_id });
      consignado.con_documento = numeroVenda[0].conf_numero_venda;

      const id = await app
        .db("consignado")
        .returning("con_id")
        .insert(consignado);

      for (let j = 0; j < consignado_produtos.length; j++) {
        consignado_produtos[j].con_id = parseInt(id);
        consignado_produtos[j].con_documento = numeroVenda[0].conf_numero_venda;
      }

      await app
        .db("consignado_item")
        .insert(consignado_produtos)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));

      const numero = req.body.documento;
      const configuracao = {
        conf_numero_venda: numero + 1,
        emp_id: req.body.empresa,
      };

      await app
        .db("configuracao")
        .update(configuracao)
        .where({ emp_id: configuracao.emp_id });
    }
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("consignado_item")
        .where({ con_documento: req.params.id, emp_id: req.params.emp_id })
        .del();

      const rowsDeleted2 = await app
        .db("consignado")
        .where({ con_documento: req.params.id, emp_id: req.params.emp_id })
        .del();
      existsOrError(rowsDeleted2, "O consignado não foi encontrado.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };
  const limit = 20;
  const get = async (req, res) => {
    try {
      const page = req.query.page || 1;

      const result = await app
        .db("consignado")
        .count("con_id as id")
        .where({ emp_id: req.params.emp_id, con_status: 0 })
        .first();
      const count = parseInt(result.id);

      const con = await app
        .db("consignado")
        .leftJoin("cliente", "consignado.cli_id", "cliente.cli_id")
        .where({ "consignado.emp_id": req.params.emp_id, con_status: 0 })
        .limit(limit)
        .offset(page * limit - limit);

      con.forEach((element) => {
        var data = dateFormat(element.con_data, "isoDateTime");
        element.con_data = dateToString(data);
        element.con_total_desconto =
          element.con_total_desconto === null
            ? 0.0
            : element.con_total_desconto.toFixed(2);
        element.con_total =
          element.con_total === null ? 0.0 : element.con_total.toFixed(2);
      });

      res.json({ data: con, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getById = (req, res) => {
    app
      .db("consignado")
      .where({ con_id: req.params.id, emp_id: req.params.emp_id })
      .first()
      .then((consignado) => res.json(consignado))
      .catch((err) => res.status(500).send(err));
  };

  const getItens = async (req, res) => {
    try {
      const page = req.query.page || 1;

      const result = await app
        .db("consignado_item")
        .count("conit_id as id")
        .where({
          con_documento: req.params.documento,
          emp_id: req.params.emp_id,
        })
        .andWhere({ "consignado_item.con_id": req.params.id })
        .first();
      const count = parseInt(result.id);

      const con_item = await app
        .db("consignado_item")
        .where({
          con_documento: req.params.documento,
          "consignado_item.emp_id": req.params.emp_id,
        })
        .andWhere({ "consignado_item.con_id": req.params.id })
        .leftJoin("produto", "consignado_item.pro_id", "produto.pro_id")
        .limit(limit)
        .offset(page * limit - limit);

      con_item.forEach((element) => {
        element.conit_quantidade = element.conit_quantidade.toFixed(2);
        element.conit_preco_venda = element.conit_preco_venda.toFixed(2);
        element.conit_desconto = element.conit_desconto.toFixed(2);
        element.conit_total = element.conit_total.toFixed(2);
      });

      await res.json({ data: con_item, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const atualizaSaldo = async (req, res) => {
    const consignado = {
      con_id: req.body.con_id,
      con_saldo: req.body.total,
      emp_id: req.body.empresa,
    };

    if (req.params.id) consignado.con_id = req.params.id;
    if (req.params.emp_id) consignado.emp_id = req.params.emp_id;
    if (consignado.con_saldo === undefined) consignado.con_saldo = 0.0;

    const result = await app
      .db("consignado")
      .where({ con_id: consignado.con_id, emp_id: consignado.emp_id });

    consignado.con_saldo = consignado.con_saldo + result[0].con_saldo;

    if (consignado.con_id) {
      app
        .db("consignado")
        .update(consignado)
        .where({ con_id: consignado.con_id, emp_id: consignado.emp_id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const fechaConsignado = async (req, res) => {
    try {
      const consignado = {
        con_documento: req.params.id,
        con_pagamento: req.body.pagamento,
        con_tipo_pagamento: req.body.tipo_pagamento,
        con_status: 1,
        emp_id: req.params.emp_id,
      };

      const dados = await app.db("consignado").where({
        con_documento: consignado.con_documento,
        emp_id: consignado.emp_id,
      });

      const caixa = {
        cai_data: req.body.dataFechamento,
        cai_hora: req.body.horaFechamento,
        cai_cred_deb: "C",
        cai_descricao:
          consignado.con_pagamento === 1 ? "Venda a Vista" : "Venda a Prazo",
        cai_valor: dados[0].con_total,
        cai_dinheiro:
          consignado.con_tipo_pagamento === 1 ? dados[0].con_total : 0.0,
        cai_cartao:
          consignado.con_tipo_pagamento === 2 ? dados[0].con_total : 0.0,
        cai_cheque:
          consignado.con_tipo_pagamento === 3 ? dados[0].con_total : 0.0,
        cai_pix: consignado.con_tipo_pagamento === 5 ? dados[0].con_total : 0.0,
        cai_aprazo: consignado.con_pagamento === 2 ? dados[0].con_total : 0.0,
        cai_status: 0,
        cai_codigo: consignado.con_pagamento === 1 ? "1.0" : "1.1",
        cai_tipo_pagamento: consignado.con_tipo_pagamento,
        consignado_id: dados[0].con_id,
        emp_id: consignado.emp_id,
      };

      await app.db("caixa").insert(caixa);

      const receber = {
        cr_documento: consignado.con_documento,
        cli_id: dados[0].cli_id,
        cr_emissao: dados[0].con_data,
        cr_vencimento: req.body.dataVencimento,
        cr_valor: dados[0].con_total,
        cr_parcela: 1,
        usu_id: req.body.usuario,
        con_id: dados[0].con_id,
        cr_dia_preferencial: req.body.diaPagamentoCliente,
        emp_id: consignado.emp_id,
      };

      if (consignado.con_pagamento === 2) {
        await app.db("contas_receber").insert(receber);
      }

      await app
        .db("consignado")
        .update({
          con_status: consignado.con_status,
          con_pagamento: consignado.con_pagamento,
          con_tipo_pagamento: consignado.con_tipo_pagamento,
        })
        .where({
          con_documento: consignado.con_documento,
          emp_id: consignado.emp_id,
        });

      var itens = await app.db("consignado_item").where({
        con_documento: consignado.con_documento,
        emp_id: consignado.emp_id,
      });

      if (itens.length > 0) {
        for (let i = 0; i < itens.length; i++) {
          await app
            .db("produto")
            .where({ pro_id: itens[i].pro_id, emp_id: itens[i].emp_id })
            .decrement("pro_estoque", itens[i].conit_quantidade);
        }
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).send(error);
    }
  };

  const buscaProdutoCodigoBarras = async (req, res) => {
    await app
      .db("produto")
      .where({ pro_cod_barra: req.params.codigo, emp_id: req.params.emp_id })
      .first()
      .then((produto) => res.json(produto))
      .catch((err) => res.status(500).send(err));
  };

  const atualizaItem = async (req, res) => {
    const item = req.body;
    let quantidade = item.quantidade - item.quantidadeDevolvida;
    let total = quantidade * item.conit_preco_venda - item.conit_desconto;

    try {
      app
        .db("consignado_item")
        .update({ conit_quantidade: quantidade, conit_total: total })
        .where({
          conit_id: item.conit_id,
          emp_id: req.params.emp_id,
          pro_id: req.params.id,
        })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  const atualizaTotal = async (req, res) => {
    try {
      const result = await knex.raw(
        "SELECT SUM(conit_quantidade*conit_preco_venda) AS total FROM consignado_item WHERE con_documento=" +
          req.params.id +
          " AND emp_id=" +
          req.params.emp_id +
          " AND conit_quantidade > 0"
      );

      const total = JSON.parse(JSON.stringify(result[0]));

      app
        .db("consignado")
        .update({ con_total: total[0].total })
        .where({ con_documento: req.params.id, emp_id: req.params.emp_id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  function stringToDate(value) {
    if (value.length >= 9) {
      let parts = value.split("/");
      let date = parts[2] + "-" + parts[1] + "-" + parts[0];
      return date;
    } else {
      let parts = value.split("/");
      let date = parts[2] + "-" + parts[1] + "-" + parts[0];
      return date;
    }
  }

  function dateToString(value) {
    if (value) {
      let dia = value.substr(8, 2);
      let mes = value.substr(5, 2);
      let ano = value.substr(0, 4);
      return dia + "/" + mes + "/" + ano;
    }
  }

  return {
    save,
    remove,
    get,
    getById,
    atualizaSaldo,
    getItens,
    fechaConsignado,
    buscaProdutoCodigoBarras,
    atualizaItem,
    atualizaTotal,
  };
};
