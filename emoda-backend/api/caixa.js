module.exports = (app) => {
  const { existsOrError } = app.api.validation;
  const dateFormat = require("dateformat");

  const save = (req, res) => {
    const caixa = {
      cai_id: req.body.cai_id,
      cai_data: req.body.data,
      cai_hora: req.body.hora,
      cai_cred_deb: req.body.credito_debito,
      cai_codigo: req.body.tipo,
      cai_tipo_pagamento: req.body.tipoPagamento,
      cai_descricao: req.body.descricao,
      cai_valor: req.body.valor,
      cai_status: req.body.status,
      emp_id: req.body.empresa,
    };

    if (req.params.id) caixa.cai_id = req.params.id;
    if (req.params.emp_id) caixa.emp_id = req.params.emp_id;

    try {
      existsOrError(caixa.cai_cred_deb, "Crédito/Débito não informado");
      existsOrError(caixa.cai_codigo, "Tipo não informado");
      existsOrError(
        caixa.cai_tipo_pagamento,
        "Tipo de Pagamento não informado"
      );
      existsOrError(caixa.cai_data, "Data não informada");
      existsOrError(caixa.cai_descricao, "Descrição não informada");
      existsOrError(caixa.cai_valor, "Valor não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (caixa.cai_id) {
      app
        .db("caixa")
        .update(caixa)
        .where({ cai_id: caixa.cai_id, emp_id: caixa.emp_id })
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("caixa")
        .insert(caixa)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("caixa")
        .where({ cai_id: req.params.id, emp_id: req.params.emp_id })
        .del();
      existsOrError(rowsDeleted, "A caixa não foi encontrada.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const limit = 100;
  const getAbertos = async (req, res) => {
    const page = req.query.page || 1;

    const result = await app
      .db("caixa")
      .count("cai_id as id")
      .where({ emp_id: req.params.emp_id, cai_status: 0 })
      .first();
    const count = parseInt(result.id);

    const cx = await app
      .db("caixa")
      .where({ emp_id: req.params.emp_id, cai_status: 0 })
      .limit(limit)
      .offset(page * limit - limit)
      .orderBy("cai_data");

    cx.forEach((element) => {
      var data = dateFormat(element.cai_data, "isoDateTime");
      element.cai_data = dateToString(data);
      element.cai_valor =
        element.cai_valor === null ? 0.0 : element.cai_valor.toFixed(2);

      if (element.cai_tipo_pagamento === 1) {
        element.tipo_pagamento = "Dinheiro";
      } else if (element.cai_tipo_pagamento === 2) {
        element.tipo_pagamento = "Cartão";
      } else if (element.cai_tipo_pagamento === 3) {
        element.tipo_pagamento = "Cheque";
      } else if (element.cai_tipo_pagamento === 4) {
        element.tipo_pagamento = "Boleto";
      } else if (element.cai_tipo_pagamento === 5) {
        element.tipo_pagamento = "Pix";
      } else if (element.cai_tipo_pagamento === 9) {
        element.tipo_pagamento = "Outro";
      }
    });
    res.json({ data: cx, count, limit });
  };

  const limit2 = 10;
  const getFechados = async (req, res) => {
    const page = req.query.page || 1;

    const result = await app
      .db("caixa")
      .count("cai_id as id")
      .where({ emp_id: req.params.emp_id, cai_status: 1 })
      .first();
    const count = parseInt(result.id);

    const cx = await app
      .db("caixa")
      .where({ emp_id: req.params.emp_id, cai_status: 1 })
      .limit(limit2)
      .offset(page * limit2 - limit2)
      .orderBy("cai_data");

    cx.forEach((element) => {
      var data = dateFormat(element.cai_data, "isoDateTime");
      element.cai_data = dateToString(data);
      element.cai_valor = element.cai_valor.toFixed(2);
    });
    res.json({ data: cx, count, limit });
  };

  const getById = (req, res) => {
    app
      .db("caixa")
      .where({
        cai_id: req.params.id,
        emp_id: req.params.emp_id,
        cai_status: 0,
      })
      .first()
      .then((caixa) => res.json(caixa))
      .catch((err) => res.status(500).send(err));
  };

  const getTotalizacao = async (req, res) => {
    const defaultTotalizacao = {
      credito: 0,
      debito: 0,
      total: 0,
    };

    const creditoSoma = await app
      .db("caixa")
      .where({ emp_id: req.params.emp_id, cai_status: 0, cai_cred_deb: "C" })
      .sum("cai_valor as credito")
      .first();
    const debitoSoma = await app
      .db("caixa")
      .where({ emp_id: req.params.emp_id, cai_status: 0, cai_cred_deb: "D" })
      .sum("cai_valor as debito")
      .first();

    defaultTotalizacao.credito =
      creditoSoma.credito === null ? 0.0 : creditoSoma.credito;
    defaultTotalizacao.debito =
      debitoSoma.debito === null ? 0.0 : debitoSoma.debito;
    defaultTotalizacao.total =
      creditoSoma.credito - debitoSoma.debito === null
        ? 0.0
        : creditoSoma.credito - debitoSoma.debito;

    res.json(defaultTotalizacao);
  };

  const getPreencheValoresFechamento = async (req, res) => {
    const defaultTotalizacao = {
      inicio: 0,
      credito: 0,
      debito: 0,
      dinheiro: 0,
      cartao: 0,
      cheque: 0,
      pix: 0,
      total: 0,
    };

    try {
      existsOrError(req.params.data, "Data não informada");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    const inicioCaixa = await app
      .db("caixa")
      .where({
        emp_id: req.params.emp_id,
        cai_status: 0,
        cai_codigo: "1.3",
        cai_data: req.params.data,
        cancelado: 0,
      })
      .sum("cai_valor as inicio")
      .first();

    // const creditoSoma = await app
    //   .db("caixa")
    //   .where({
    //     emp_id: req.params.emp_id,
    //     cai_status: 0,
    //     cai_cred_deb: "C",
    //     cai_data: req.params.data,
    //     cancelado: 0,
    //   })
    //   .sum("cai_valor as credito")
    //   .first();

    const debitoSoma = await app
      .db("caixa")
      .where({
        emp_id: req.params.emp_id,
        cai_status: 0,
        cai_cred_deb: "D",
        cai_data: req.params.data,
        cancelado: 0,
      })
      .sum("cai_valor as debito")
      .first();

    const dinheiroSoma = await app
      .db("caixa")
      .where({
        emp_id: req.params.emp_id,
        cai_status: 0,
        cai_data: req.params.data,
        cancelado: 0,
      })
      .sum("cai_dinheiro as dinheiro")
      .first();
    const cartaoSoma = await app
      .db("caixa")
      .where({
        emp_id: req.params.emp_id,
        cai_status: 0,
        cai_data: req.params.data,
        cancelado: 0,
      })
      .sum("cai_cartao as cartao")
      .first();
    const chequeSoma = await app
      .db("caixa")
      .where({
        emp_id: req.params.emp_id,
        cai_status: 0,
        cai_data: req.params.data,
        cancelado: 0,
      })
      .sum("cai_cheque as cheque")
      .first();
    const pixSoma = await app
      .db("caixa")
      .where({
        emp_id: req.params.emp_id,
        cai_status: 0,
        cai_data: req.params.data,
        cancelado: 0,
      })
      .sum("cai_pix as pix")
      .first();

    defaultTotalizacao.inicio =
      inicioCaixa.inicio === null ? 0.0 : inicioCaixa.inicio;

    defaultTotalizacao.dinheiro =
      dinheiroSoma.dinheiro === null ? 0.0 : dinheiroSoma.dinheiro;

    defaultTotalizacao.cartao =
      cartaoSoma.cartao === null ? 0.0 : cartaoSoma.cartao;

    defaultTotalizacao.cheque =
      chequeSoma.cheque === null ? 0.0 : chequeSoma.cheque;

    defaultTotalizacao.pix = pixSoma.pix === null ? 0.0 : pixSoma.pix;

    defaultTotalizacao.credito =
      dinheiroSoma.dinheiro +
      cartaoSoma.cartao +
      chequeSoma.cheque +
      defaultTotalizacao.pix;
    defaultTotalizacao.debito =
      debitoSoma.debito === null ? 0.0 : debitoSoma.debito;

    defaultTotalizacao.total =
      defaultTotalizacao.credito - debitoSoma.debito === null
        ? 0.0
        : defaultTotalizacao.credito - debitoSoma.debito;

    res.json(defaultTotalizacao);
  };

  const fechaCaixa = (req, res) => {
    const fechaCaixa = {
      cai_data: req.body.data,
      ban_id: req.body.contaFechamento,
      cai_data_fechamento: req.body.dataFechamento,
      cai_hora_fechamento: req.body.horaFechamento,
      cai_status: 1,
      emp_id: req.body.empresa,
    };

    const totalFechamento = req.body.total;

    const banco = {
      ban_id: req.body.contaFechamento,
      ban_saldo: req.body.total,
      emp_id: req.body.empresa,
    };

    if (req.params.emp_id) {
      fechaCaixa.emp_id = req.params.emp_id;
      banco.emp_id = req.params.emp_id;
    }

    try {
      existsOrError(fechaCaixa.cai_data, "Data não informada");
      existsOrError(fechaCaixa.ban_id, "Conta Bancária não informada");
      existsOrError(totalFechamento, "Não há valores para fechamento!");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    app
      .db("caixa")
      .update(fechaCaixa)
      .where({ cai_data: fechaCaixa.cai_data, emp_id: fechaCaixa.emp_id })
      .then(() => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  };

  const buscaCaixaPorData = async (req, res) => {
    const page = req.query.page || 1;

    const result = await app
      .db("caixa")
      .count("cai_id as id")
      .where({ emp_id: req.params.emp_id, cai_status: 0 })
      .andWhere({ cai_data: req.params.data })
      .first();
    const count = parseInt(result.id);

    const cx = await app
      .db("caixa")
      .where({ emp_id: req.params.emp_id, cai_status: 0 })
      .andWhere({ cai_data: req.params.data })
      .limit(limit)
      .offset(page * limit - limit)
      .orderBy("cai_data");

    cx.forEach((element) => {
      var data = dateFormat(element.cai_data, "isoDateTime");
      element.cai_data = dateToString(data);
      element.cai_valor = element.cai_valor.toFixed(2);

      if (element.cai_tipo_pagamento === 1) {
        element.tipo_pagamento = "Dinheiro";
      } else if (element.cai_tipo_pagamento === 2) {
        element.tipo_pagamento = "Cartão";
      } else if (element.cai_tipo_pagamento === 3) {
        element.tipo_pagamento = "Cheque";
      } else if (element.cai_tipo_pagamento === 4) {
        element.tipo_pagamento = "Boleto";
      } else if (element.cai_tipo_pagamento === 5) {
        element.tipo_pagamento = "Pix";
      } else if (element.cai_tipo_pagamento === 9) {
        element.tipo_pagamento = "Outro";
      }
    });
    res.json({ data: cx, count, limit });
  };

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
    getAbertos,
    getById,
    getFechados,
    getTotalizacao,
    getPreencheValoresFechamento,
    fechaCaixa,
    buscaCaixaPorData,
  };
};
