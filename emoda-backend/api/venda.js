module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;
  const dateFormat = require("dateformat");
  const moment = require("moment");

  const save = async (req, res) => {
    const consignado = {
      con_documento: req.body.numero,
      con_data: stringToDate(req.body.data),
      cli_id: req.body.cliente,
      con_desconto: req.body.descontoReal,
      con_percentual_desconto: req.body.descontoPorcentagem,
      con_acrescimo: req.body.acrescimoReal,
      con_percentual_acrescimo: req.body.acrescimoPorcentagem,
      con_total: req.body.valorTotal === null ? 0 : req.body.valorTotal,
      con_total_desconto: 0,
      con_status: req.body.status,
      usu_id: req.body.usuario,
      con_vendedor: req.body.vendedor,
      emp_id: req.body.empresa,
      con_pagamento: req.body.pagamento,
      con_tipo_pagamento: req.body.tipoPagamento,
    };

    var consignado_produtos = Object.keys(req.body.itens).map(function (key) {
      return req.body.itens[key];
    });

    if (req.params.emp_id) consignado.emp_id = req.params.emp_id;

    try {
      existsOrError(consignado.cli_id, "Cliente não informado");
      existsOrError(consignado.con_pagamento, "Pagamento não informado");
      existsOrError(
        consignado.con_tipo_pagamento,
        "Tipo de Pagamento não informado"
      );
      existsOrError(consignado.con_total, "Valor Total está zerado!");
      if (consignado_produtos.length <= 0) {
        existsOrError("", "Não há produtos nesta venda");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    const id = await app
      .db("consignado")
      .returning("con_id")
      .insert(consignado);

    for (let j = 0; j < consignado_produtos.length; j++) {
      consignado_produtos[j].con_id = parseInt(id);
    }

    await app.db("consignado_item").insert(consignado_produtos);

    if (consignado_produtos.length > 0) {
      for (let i = 0; i < consignado_produtos.length; i++) {
        await app
          .db("produto")
          .where({
            pro_id: consignado_produtos[i].pro_id,
            emp_id: consignado_produtos[i].emp_id,
          })
          .decrement("pro_estoque", consignado_produtos[i].conit_quantidade);
      }
    }

    const numero = req.body.numero;
    const configuracao = {
      conf_numero_venda: numero + 1,
      emp_id: req.body.empresa,
    };

    await app
      .db("configuracao")
      .update(configuracao)
      .where({ emp_id: configuracao.emp_id });

    const caixa = {
      cai_data: stringToDate(req.body.data),
      cai_hora: req.body.hora,
      cai_cred_deb: "C",
      cai_descricao:
        consignado.con_pagamento === 1 ? "Venda a Vista" : "Venda a Prazo",
      cai_valor: consignado.con_total,
      cai_dinheiro:
        consignado.con_tipo_pagamento === 1 ? consignado.con_total : 0.0,
      cai_cartao:
        consignado.con_tipo_pagamento === 2 ? consignado.con_total : 0.0,
      cai_cheque:
        consignado.con_tipo_pagamento === 3 ? consignado.con_total : 0.0,
      cai_pix: consignado.con_tipo_pagamento === 5 ? consignado.con_total : 0.0,
      cai_aprazo: consignado.con_pagamento === 2 ? consignado.con_total : 0.0,
      cai_status: 0,
      cai_codigo: consignado.con_pagamento === 1 ? "1.0" : "1.1",
      cai_tipo_pagamento: consignado.con_tipo_pagamento,
      consignado_id: id,
      emp_id: consignado.emp_id,
    };

    await app.db("caixa").insert(caixa);

    if (consignado.con_pagamento === 2) {
      const receber = {
        cr_documento: consignado.con_documento,
        cli_id: consignado.cli_id,
        cr_emissao: consignado.con_data,
        cr_vencimento: moment(req.body.dataVencimento).format("YYYY-MM-DD"),
        cr_valor: consignado.con_total,
        cr_parcela: 1,
        usu_id: consignado.usu_id,
        con_id: id,
        cr_dia_preferencial: req.body.diaPagamentoCliente,
        emp_id: consignado.emp_id,
      };

      await app.db("contas_receber").insert(receber);
    }

    res.status(204).send();
  };
  const limit = 100;
  const getVendas = async (req, res) => {
    try {
      if (
        req.params.dataInicial === "undefined" ||
        req.params.dataFinal === "undefined"
      ) {
        const page = req.query.page || 1;

        const result = await app
          .db("consignado")
          .count("con_id as id")
          .where({ "consignado.emp_id": req.params.emp_id, con_status: 1 })
          .first();
        const count = parseInt(result.id);

        const vendas = await app
          .db("consignado")
          .select(
            "con_documento",
            "con_data",
            "cli_nome",
            "con_total",
            "con_pagamento",
            "con_tipo_pagamento",
            "usu_nome"
          )
          .leftJoin("usuario", "consignado.con_vendedor", "usuario.usu_id")
          .leftJoin("cliente", "consignado.cli_id", "cliente.cli_id")
          .where({ "consignado.emp_id": req.params.emp_id, con_status: 1 })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("con_data", "desc");

        await vendas.forEach((element) => {
          var data = dateFormat(element.con_data, "isoDateTime");

          element.con_data = dateToString(data);
          element.con_total = element.con_total.toFixed(2);

          if (element.con_pagamento === 1) {
            element.pagamento = "A Vista";
          } else if (element.con_pagamento === 2) {
            element.pagamento = "A Prazo";
          }

          if (element.usu_nome === null) {
            element.usu_nome = "Sem Vendedor";
          }

          if (element.con_tipo_pagamento === 1) {
            element.tipo_pagamento = "Dinheiro"
          } else if (element.con_tipo_pagamento === 2){
            element.tipo_pagamento = "Cartão"
          }else if (element.con_tipo_pagamento === 3){
            element.tipo_pagamento = "Cheque"
          }else if (element.con_tipo_pagamento === 4){
            element.tipo_pagamento = "Boleto"
          }else if (element.con_tipo_pagamento === 5){
            element.tipo_pagamento = "Pix"
          }else if (element.con_tipo_pagamento === 9){
            element.tipo_pagamento = "Outro"
          }
        });
        res.json({ vendas: vendas, count, limit });
      } else {
        const page = req.query.page || 1;

        const result = await app
          .db("consignado")
          .count("con_id as id")
          .where({ "consignado.emp_id": req.params.emp_id, con_status: 1 })
          .andWhere(function () {
            this.where("consignado.con_data", ">=", req.params.dataInicial);
          })
          .andWhere(function () {
            this.where("consignado.con_data", "<=", req.params.dataFinal);
          })
          .first();
        const count = parseInt(result.id);

        const vendas = await app
          .db("consignado")
          .select(
            "con_documento",
            "con_data",
            "cli_nome",
            "con_total",
            "con_pagamento",
            "con_tipo_pagamento",
            "usu_nome"
          )
          .leftJoin("usuario", "consignado.con_vendedor", "usuario.usu_id")
          .leftJoin("cliente", "consignado.cli_id", "cliente.cli_id")
          .where({ "consignado.emp_id": req.params.emp_id, con_status: 1 })
          .andWhere(function () {
            this.where("consignado.con_data", ">=", req.params.dataInicial);
          })
          .andWhere(function () {
            this.where("consignado.con_data", "<=", req.params.dataFinal);
          })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("con_data", "desc");

        await vendas.forEach((element) => {
          var data = dateFormat(element.con_data, "isoDateTime");

          element.con_data = dateToString(data);
          element.con_total = element.con_total.toFixed(2);

          if (element.con_pagamento === 1) {
            element.pagamento = "A Vista";
          } else if (element.con_pagamento === 2) {
            element.pagamento = "A Prazo";
          }

          if (element.usu_nome === null) {
            element.usu_nome = "Sem Vendedor";
          }

          if (element.con_tipo_pagamento === 1) {
            element.tipo_pagamento = "Dinheiro"
          } else if (element.con_tipo_pagamento === 2){
            element.tipo_pagamento = "Cartão"
          }else if (element.con_tipo_pagamento === 3){
            element.tipo_pagamento = "Cheque"
          }else if (element.con_tipo_pagamento === 4){
            element.tipo_pagamento = "Boleto"
          }else if (element.con_tipo_pagamento === 5){
            element.tipo_pagamento = "Pix"
          }else if (element.con_tipo_pagamento === 9){
            element.tipo_pagamento = "Outro"
          }
        });
        res.json({ vendas: vendas, count, limit });
      }
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getVendaCancelamento = async (req, res) => {
    try {
      existsOrError(req.params.numero, "Número de venda não informado");
      existsOrError(req.params.cliente, "Cliente não informado");

      const venda = await app
        .db("consignado")
        .select(
          "con_id",
          "con_documento",
          "con_data",
          "cli_nome",
          "con_total",
          "con_pagamento"
        )
        .leftJoin("cliente", "consignado.cli_id", "cliente.cli_id")
        .where({
          con_documento: req.params.numero,
          "consignado.cli_id": req.params.cliente,
        })
        .andWhere({ "consignado.emp_id": req.params.emp_id, con_status: 1 });

      await venda.forEach((element) => {
        var data = dateFormat(element.con_data, "isoDateTime");

        element.con_data = dateToString(data);
        element.con_total = element.con_total.toFixed(2);

        if (element.con_pagamento === 1) {
          element.pagamento = "A Vista";
        } else if (element.con_pagamento === 2) {
          element.pagamento = "A Prazo";
        }
      });

      if (venda.length === 0) {
        res.status(400).send("Venda não encontrada!");
      } else {
        const page = req.query.page || 1;
        const result = await app
          .db("consignado_item")
          .count("conit_id as id")
          .where({
            con_documento: req.params.numero,
            emp_id: req.params.emp_id,
          })
          .first();
        const count = parseInt(result.id);

        const venda_itens = await app
          .db("consignado_item")
          .select(
            "consignado_item.pro_id",
            "pro_nome",
            "conit_quantidade",
            "conit_total",
            "pro_estoque"
          )
          .leftJoin("produto", "consignado_item.pro_id", "produto.pro_id")
          .where({
            con_documento: req.params.numero,
            "consignado_item.emp_id": req.params.emp_id,
          })
          .andWhere(function () {
            this.where("consignado_item.conit_quantidade", ">", 0);
          })
          .andWhere({ con_id: venda[0].con_id })
          .limit(limit)
          .offset(page * limit - limit);

        const produtos = await app
          .db("consignado_item")
          .select(
            "consignado_item.pro_id",
            "pro_nome",
            "conit_quantidade",
            "conit_total",
            "pro_estoque"
          )
          .leftJoin("produto", "consignado_item.pro_id", "produto.pro_id")
          .where({
            con_documento: req.params.numero,
            "consignado_item.emp_id": req.params.emp_id,
          })
          .andWhere(function () {
            this.where("consignado_item.conit_quantidade", ">", 0);
          })
          .andWhere({ con_id: venda[0].con_id });

        await venda_itens.forEach((element) => {
          element.conit_quantidade = element.conit_quantidade.toFixed(2);
          element.conit_total = element.conit_total.toFixed(2);
        });

        await app.db("caixa").update({ cancelado: 1 }).where({
          consignado_id: req.params.numero,
          emp_id: req.params.emp_id,
        });

        res.json({
          venda: venda,
          venda_itens: venda_itens,
          produtos: produtos,
          count,
          limit,
        });
      }
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const devolucaoVenda = async (req, res) => {
    const itens = req.body.produtos;

    try {
      existsOrError(req.params.numero, "Número de venda não informado");
      existsOrError(req.params.cliente, "Cliente não informado");
      const venda = await app
        .db("consignado")
        .where({ cli_id: req.params.cliente, con_documento: req.params.numero })
        .andWhere({ emp_id: req.params.emp_id });
      await app
        .db("consignado")
        .update({ con_status: 2, con_total: 0, con_total_desconto: 0 })
        .where({ cli_id: req.params.cliente, con_documento: req.params.numero })
        .andWhere({ emp_id: req.params.emp_id });

      await app
        .db("consignado_item")
        .update({ conit_quantidade: 0, conit_desconto: 0, conit_total: 0 })
        .where({ con_documento: req.params.numero, emp_id: req.params.emp_id });

      for (let i = 0; i < itens.length; i++) {
        const element = await itens[i];

        await app
          .db("produto")
          .increment("pro_estoque", element.conit_quantidade)
          .where({ pro_id: element.pro_id, emp_id: req.params.emp_id });
      }

      if (req.body.venda.con_pagamento === 1) {
        const caixa = {
          cai_data: req.body.venda.dataDevolucao,
          cai_hora: req.body.venda.horaDevolucao,
          cai_cred_deb: "D",
          cai_descricao: "Devolução de Venda à Vista",
          cai_valor: req.body.venda.con_total,
          cai_dinheiro: 0.0,
          cai_cartao: 0.0,
          cai_cheque: 0.0,
          cai_pix: 0.0,
          cai_status: 0,
          cai_codigo: "2.0",
          cai_tipo_pagamento: venda[0].con_tipo_pagamento,
          consignado_id: venda[0].con_id,
          cancelado: 1,
          emp_id: req.params.emp_id,
        };
        await app
          .db("caixa")
          .update({ cancelado: 1 })
          .where({ consignado_id: venda[0].con_id, emp_id: req.params.emp_id });
        await app.db("caixa").insert(caixa);
      } else {
        const caixa = {
          cai_data: req.body.venda.dataDevolucao,
          cai_hora: req.body.venda.horaDevolucao,
          cai_cred_deb: "D",
          cai_descricao: "Devolução de Venda à Prazo",
          cai_valor: req.body.venda.con_total,
          cai_dinheiro: 0.0,
          cai_cartao: 0.0,
          cai_cheque: 0.0,
          cai_pix: 0.0,
          cai_status: 0,
          cai_codigo: "2.1",
          cai_tipo_pagamento: venda[0].con_tipo_pagamento,
          consignado_id: venda[0].con_id,
          cancelado: 1,
          emp_id: req.params.emp_id,
        };
        await app
          .db("caixa")
          .update({ cancelado: 1 })
          .where({ consignado_id: venda[0].con_id, emp_id: req.params.emp_id });
        await app.db("caixa").insert(caixa);
        await app
          .db("contas_receber")
          .where({
            cr_documento: req.params.numero,
            cli_id: req.params.cliente,
            emp_id: req.params.emp_id,
          })
          .del();
      }

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
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
    getVendas,
    getVendaCancelamento,
    devolucaoVenda,
  };
};
