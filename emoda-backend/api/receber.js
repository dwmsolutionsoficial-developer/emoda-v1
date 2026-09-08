module.exports = (app) => {
  const { existsOrError } = app.api.validation;
  const dateFormat = require("dateformat");
  const moment = require("moment");

  const save = (req, res) => {
    const receber = {
      cr_id: req.body.cr_id,
      cr_documento: req.body.documento,
      cli_id: req.body.cliente,
      cr_emissao: req.body.emissao,
      cr_vencimento: req.body.vencimento,
      cr_valor: req.body.valor,
      cr_parcela: 1,
      cr_dia_preferencial: req.body.diaPagamentoCliente,
      usu_id: req.body.usuario,
      emp_id: req.body.empresa,
    };

    receber.cr_vencimento = moment(
      moment(req.body.vencimento).add(30, "days")
    ).format("YYYY-MM-DD");

    if (req.params.id) receber.cr_id = req.params.id;
    if (req.params.emp_id) receber.emp_id = req.params.emp_id;

    try {
      existsOrError(receber.cli_id, "Cliente não informado");
      existsOrError(receber.cr_emissao, "Data de Emissão não informada");
      existsOrError(receber.cr_valor, "Valor não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (receber.cr_id) {
      app
        .db("contas_receber")
        .update(receber)
        .where({ cr_id: receber.cr_id, emp_id: receber.emp_id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("contas_receber")
        .insert(receber)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("contas_receber")
        .where({ cr_id: req.params.id, emp_id: req.params.emp_id })
        .del();
      existsOrError(rowsDeleted, "O Documento a Receber não foi encontrado.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const removePagamento = async (req, res) => {
    try {
      const date = new Date();
      let hora = date.getHours() + ":" + date.getMinutes();
      var dataFormatada =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      const pagamento = await app
        .db("pagamento")
        .where({ pag_id: req.params.id, emp_id: req.params.emp_id })
        .first();

      await app
        .db("caixa")
        .update({ cancelado: 1 })
        .where({ pagamento_id: req.params.id, emp_id: req.params.emp_id });

      const caixa = {
        cai_data: dataFormatada,
        cai_hora: hora,
        cai_cred_deb: "D",
        cai_descricao: "Estorno de Recebimento",
        cai_valor: pagamento.pag_valor,
        cai_dinheiro: 0.0,
        cai_cartao: 0.0,
        cai_cheque: 0.0,
        cai_pix: 0.0,
        cai_status: 0,
        cai_codigo: "2.3",
        cai_tipo_pagamento: pagamento.pag_tipo_pagamento,
        pagamento_id: pagamento.pag_id,
        cancelado: 1,
        emp_id: pagamento.emp_id,
      };

      await app.db("caixa").insert(caixa);

      const rowsDeleted = await app
        .db("pagamento")
        .where({ pag_id: req.params.id, emp_id: req.params.emp_id })
        .del();
      existsOrError(rowsDeleted, "O Documento não foi encontrado.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const limit = 100
  const get = async (req, res) => {
    try {
      const page = req.query.page || 1;
      var count = 0;
      var result = [];
      var rec = [];

      if (req.params.nome === "null" && req.params.data === "null") {
        result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .where({ emp_id: req.params.emp_id })
          .first();

        count = parseInt(result.id);

        rec = await app
          .db("contas_receber")
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cr_emissao", "desc");
      } else if (req.params.nome !== "null" && req.params.data === "null") {
        result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .first();

        count = parseInt(result.id);

        rec = await app
          .db("contas_receber")
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cr_emissao", "desc");
      } else if (req.params.nome === "null" && req.params.data !== "null") {
        result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .where({ emp_id: req.params.emp_id })
          .andWhere({ "contas_receber.cr_vencimento": req.params.data })
          .first();

        count = parseInt(result.id);

        rec = await app
          .db("contas_receber")
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere({ "contas_receber.cr_vencimento": req.params.data })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cr_emissao", "desc");
      } else if (req.params.nome !== "null" && req.params.data !== "null") {
        result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere({ "contas_receber.cr_vencimento": req.params.data })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .first();

        count = parseInt(result.id);

        rec = await app
          .db("contas_receber")
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere({ "contas_receber.cr_vencimento": req.params.data })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cr_emissao", "desc");
      }

      rec.forEach((element) => {
        var emissao = dateFormat(element.cr_emissao, "isoDateTime");
        var vencimento = dateFormat(element.cr_vencimento, "isoDateTime");
        element.cr_emissao = dateToString(emissao);
        element.cr_vencimento = dateToString(vencimento);
        element.cr_valor = element.cr_valor.toFixed(2);
      });

      res.json({ data: rec, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getById = (req, res) => {
    app
      .db("contas_receber")
      .where({ cr_id: req.params.id, emp_id: req.params.emp_id })
      .first()
      .then((receber) => res.json(receber))
      .catch((err) => res.status(500).send(err));
  };

  const getLimiteCredito = async (req, res) => {
    try {
      existsOrError(req.params.id, "Cliente não informado");

      const valores = {
        minimo: 0,
        maximo: 0,
        exibeLimite: 0,
        bloqueado: 0,
        saldo: 0,
      };

      const cliente = await app
        .db("cliente")
        .select(
          "cli_limite_minimo as minimo",
          "cli_limite as maximo",
          "cli_exibe_limite as exibeLimite",
          "cli_bloqueado as bloqueado"
        )
        .where({ cli_id: req.params.id, emp_id: req.params.emp_id });

      const devedor = await app
        .db("contas_receber")
        .sum("cr_valor as devedor")
        .where({ cli_id: req.params.id, emp_id: req.params.emp_id });

      const pagamento = await app
        .db("pagamento")
        .sum("pag_valor as pago")
        .where({ cli_id: req.params.id, emp_id: req.params.emp_id });

      valores.minimo =
        cliente[0].minimo === null ? 0.0 : cliente[0].minimo.toFixed(2);
      valores.maximo =
        cliente[0].maximo === null ? 0.0 : cliente[0].maximo.toFixed(2);
      valores.exibeLimite =
        cliente[0].exibeLimite === null ? 0 : cliente[0].exibeLimite;
      valores.bloqueado = cliente[0].bloqueado;
      valores.saldo = devedor[0].devedor - pagamento[0].pago;
      valores.saldo = valores.saldo.toFixed(2);

      res.json(valores);
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  const getValoresCliente = async (req, res) => {
    try {
      existsOrError(req.params.id, "Cliente não informado");

      const valores = {
        nome: "",
        referencia: "",
        limite: 0,
        exibeLimite: 0,
        pago: 0,
        desconto: 0,
        total: 0,
      };

      const result = await app
        .db("cliente")
        .select(
          "cli_limite as limite",
          "cli_nome as nome",
          "cli_referencia as referencia",
          "cli_exibe_limite as exibeLimite"
        )
        .leftJoin("contas_receber", "contas_receber.cli_id", "cliente.cli_id")
        .sum({ total: "cr_valor" })
        .where({
          "cliente.cli_id": req.params.id,
          "cliente.emp_id": req.params.emp_id,
        });

      const pagamento = await app
        .db("pagamento")
        .sum({ pago: "pag_valor" })
        .sum({ descontos: "pag_desconto" })
        .where({
          "pagamento.cli_id": req.params.id,
          "pagamento.emp_id": req.params.emp_id,
        });

      valores.limite =
        result[0].limite === null ? 0.0 : result[0].limite.toFixed(2);
      valores.pago =
        pagamento[0].pago === null ? 0.0 : pagamento[0].pago.toFixed(2);
      valores.total =
        result[0].total === null ? 0.0 : result[0].total.toFixed(2);
      valores.desconto =
        pagamento[0].descontos === null ? 0.0 : pagamento[0].descontos;
      valores.nome = result[0].nome;
      valores.referencia = result[0].referencia;
      valores.exibeLimite =
        result[0].exibeLimite === null ? 0 : result[0].exibeLimite;

      res.json({ data: valores });
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  const finalizarPagamento = async (req, res) => {
    const pagamento = {
      cli_id: req.body.cliente,
      pag_data: req.body.data,
      pag_valor: req.body.valor,
      pag_desconto: req.body.desconto,
      pag_tipo_pagamento: req.body.pagamento,
    };

    if (req.params.emp_id) pagamento.emp_id = req.params.emp_id;

    try {
      existsOrError(pagamento.cli_id, "Cliente não informado");
      existsOrError(pagamento.pag_data, "Data não informada");
      existsOrError(pagamento.pag_valor, "Valor não informado");
      existsOrError(
        pagamento.pag_tipo_pagamento,
        "Tipo de Pagamento não informado"
      );

      const pag_id = await app
        .db("pagamento")
        .returning("pag_id")
        .insert(pagamento);

      const caixa = {
        cai_data: req.body.data,
        cai_hora: req.body.hora,
        cai_cred_deb: "C",
        cai_descricao: "Recebimento",
        cai_valor: req.body.totalPago,
        cai_dinheiro: req.body.pagamento === 1 ? req.body.totalPago : 0.0,
        cai_cartao: req.body.pagamento === 2 ? req.body.totalPago : 0.0,
        cai_cheque: req.body.pagamento === 3 ? req.body.totalPago : 0.0,
        cai_pix: req.body.pagamento === 5 ? req.body.totalPago : 0.0,
        cai_status: 0,
        cai_codigo: "1.2",
        cai_tipo_pagamento: req.body.pagamento,
        pagamento_id: pag_id,
        emp_id: pagamento.emp_id,
      };

      await app
        .db("caixa")
        .insert(caixa)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  const getRecebimentos = async (req, res) => {
    try {
      const page = req.query.page || 1;
      var count = 0;
      var result = [];
      var recebimentos = [];

      if (req.params.nome === "null" && req.params.data === "null") {
        result = await app
          .db("pagamento")
          .count("pag_id as id")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .orderBy("pagamento.cli_id", "pag_data")
          .first();

        count = parseInt(result.id);

        recebimentos = await app
          .db("pagamento")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("pag_data", "desc");
      } else if (req.params.nome != "null" && req.params.data === "null") {
        result = await app
          .db("pagamento")
          .count("pag_id as id")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .orderBy("pagamento.cli_id", "pag_data")
          .first();

        count = parseInt(result.id);

        recebimentos = await app
          .db("pagamento")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("pag_data", "desc");
      } else if (req.params.nome === "null" && req.params.data != "null") {
        result = await app
          .db("pagamento")
          .count("pag_id as id")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .andWhere({ "pagamento.pag_data": req.params.data })
          .orderBy("pagamento.cli_id", "pag_data")
          .first();

        count = parseInt(result.id);

        recebimentos = await app
          .db("pagamento")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .andWhere({ "pagamento.pag_data": req.params.data })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("pag_data", "desc");
      } else if (req.params.nome != "null" && req.params.data != "null") {
        result = await app
          .db("pagamento")
          .count("pag_id as id")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .andWhere({ "pagamento.pag_data": req.params.data })
          .orderBy("pagamento.cli_id", "pag_data")
          .first();

        count = parseInt(result.id);

        recebimentos = await app
          .db("pagamento")
          .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
          .where({ "pagamento.emp_id": req.params.emp_id })
          .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
          .andWhere({ "pagamento.pag_data": req.params.data })
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("pag_data", "desc");
      }

      await recebimentos.forEach((element) => {
        var pagamento = dateFormat(element.pag_data, "isoDateTime");

        element.pag_data = dateToString(pagamento);
        element.pag_valor = element.pag_valor.toFixed(2);

        if (element.pag_tipo_pagamento === 1) {
          element.tipo = "Dinheiro";
        } else if (element.pag_tipo_pagamento === 2) {
          element.tipo = "Cartão";
        } else if (element.pag_tipo_pagamento === 3) {
          element.tipo = "Cheque";
        } else if (element.pag_tipo_pagamento === 4) {
          element.tipo = "Boleto";
        } else if (element.pag_tipo_pagamento === 9) {
          element.tipo = "Outro";
        } else if (element.pag_tipo_pagamento === 5) {
          element.tipo = "Pix";
        }
      });

      res.json({ data: recebimentos, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getByClienteRecebimentos = async (req, res) => {
    try {
      const page = req.query.page || 1;

      const result = await app
        .db("pagamento")
        .count("pag_id as id")
        .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
        .where({ "pagamento.emp_id": req.params.emp_id })
        .andWhere("cliente.cli_nome", "like", "%" + req.params.nome + "%")
        .first();

      const count = parseInt(result.id);

      const recebimentos = await app
        .db("pagamento")
        .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
        .where({ "pagamento.emp_id": req.params.emp_id })
        .andWhere("cli_nome", "like", "%" + req.params.nome + "%")
        .limit(limit)
        .offset(page * limit - limit)
        .orderBy("pagamento.cli_id", "pag_data");

      await recebimentos.forEach((element) => {
        var pagamento = dateFormat(element.pag_data, "isoDateTime");

        element.pag_data = dateToString(pagamento);
        element.pag_valor = element.pag_valor.toFixed(2);

        if (element.pag_tipo_pagamento === 1) {
          element.tipo = "Dinheiro";
        } else if (element.pag_tipo_pagamento === 2) {
          element.tipo = "Cartão";
        } else if (element.pag_tipo_pagamento === 3) {
          element.tipo = "Cheque";
        } else if (element.pag_tipo_pagamento === 4) {
          element.tipo = "Boleto";
        } else if (element.pag_tipo_pagamento === 9) {
          element.tipo = "Outro";
        }
      });

      res.json({ data: recebimentos, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getRecebimentosPorData = async (req, res) => {
    try {
      //   const page = req.query.page || 1;

      const result = await app
        .db("pagamento")
        .count("pag_id as id")
        .where({ "pagamento.emp_id": req.params.emp_id })
        .andWhere({ "pagamento.pag_data": req.params.data })
        .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
        .orderBy("pagamento.cli_id", "pag_data")
        .first();

      const count = parseInt(result.id);

      const recebimentos = await app
        .db("pagamento")
        .where({ "pagamento.emp_id": req.params.emp_id })
        .andWhere({ "pagamento.pag_data": req.params.data })
        .leftJoin("cliente", "pagamento.cli_id", "cliente.cli_id")
        .orderBy("pagamento.cli_id", "pag_data");

      await recebimentos.forEach((element) => {
        var pagamento = dateFormat(element.pag_data, "isoDateTime");

        element.pag_data = dateToString(pagamento);
        element.pag_valor = element.pag_valor.toFixed(2);

        if (element.pag_tipo_pagamento === 1) {
          element.tipo = "Dinheiro";
        } else if (element.pag_tipo_pagamento === 2) {
          element.tipo = "Cartão";
        } else if (element.pag_tipo_pagamento === 3) {
          element.tipo = "Cheque";
        } else if (element.pag_tipo_pagamento === 4) {
          element.tipo = "Boleto";
        } else if (element.pag_tipo_pagamento === 9) {
          element.tipo = "Outro";
        }
      });

      res.json({ data: recebimentos, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getDocumentosAVencer = async (req, res) => {
    try {
      const page = req.query.page || 1;

      if (
        req.params.dataInicial === "undefined" &&
        req.params.dataFinal === "undefined"
      ) {
        const result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .where({
            cr_dia_preferencial: parseInt(req.params.dia),
            "contas_receber.emp_id": req.params.emp_id,
          })
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .groupBy("contas_receber.cli_id")
          .orderBy("cliente.cli_nome");

        const count = parseInt(result.length);

        const rec = await app
          .db("contas_receber")
          .where({
            cr_dia_preferencial: parseInt(req.params.dia),
            "contas_receber.emp_id": req.params.emp_id,
          })
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .groupBy("contas_receber.cli_id")
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cliente.cli_nome");

        rec.forEach((element) => {
          var emissao = dateFormat(element.cr_emissao, "isoDateTime");
          var vencimento = dateFormat(element.cr_vencimento, "isoDateTime");
          element.cr_emissao = dateToString(emissao);
          element.cr_vencimento = dateToString(vencimento);
          element.cr_valor = element.cr_valor.toFixed(2);
        });

        res.json({ data: rec, count, limit });
      } else if (
        req.params.dataInicial != "undefined" &&
        req.params.dataFinal != "undefined" &&
        parseInt(req.params.dia) > 0
      ) {
        const result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              ">=",
              req.params.dataInicial
            );
          })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              "<=",
              req.params.dataFinal
            );
          })
          .andWhere({
            "contas_receber.cr_dia_preferencial": parseInt(req.params.dia),
          })
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .groupBy("contas_receber.cli_id")
          .orderBy("cliente.cli_nome");

        const count = parseInt(result.length);

        const rec = await app
          .db("contas_receber")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              ">=",
              req.params.dataInicial
            );
          })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              "<=",
              req.params.dataFinal
            );
          })
          .andWhere({
            "contas_receber.cr_dia_preferencial": parseInt(req.params.dia),
          })
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .groupBy("contas_receber.cli_id")
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cliente.cli_nome");

        rec.forEach((element) => {
          var emissao = dateFormat(element.cr_emissao, "isoDateTime");
          var vencimento = dateFormat(element.cr_vencimento, "isoDateTime");
          element.cr_emissao = dateToString(emissao);
          element.cr_vencimento = dateToString(vencimento);
          element.cr_valor = element.cr_valor.toFixed(2);
        });

        res.json({ data: rec, count, limit });
      } else {
        const result = await app
          .db("contas_receber")
          .count("cr_id as id")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              ">=",
              req.params.dataInicial
            );
          })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              "<=",
              req.params.dataFinal
            );
          })
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .groupBy("contas_receber.cli_id")
          .orderBy("cliente.cli_nome");

        const count = parseInt(result.length);

        const rec = await app
          .db("contas_receber")
          .where({ "contas_receber.emp_id": req.params.emp_id })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              ">=",
              req.params.dataInicial
            );
          })
          .andWhere(function () {
            this.where(
              "contas_receber.cr_vencimento",
              "<=",
              req.params.dataFinal
            );
          })
          .leftJoin("cliente", "contas_receber.cli_id", "cliente.cli_id")
          .groupBy("contas_receber.cli_id")
          .limit(limit)
          .offset(page * limit - limit)
          .orderBy("cliente.cli_nome");

        rec.forEach((element) => {
          var emissao = dateFormat(element.cr_emissao, "isoDateTime");
          var vencimento = dateFormat(element.cr_vencimento, "isoDateTime");
          element.cr_emissao = dateToString(emissao);
          element.cr_vencimento = dateToString(vencimento);
          element.cr_valor = element.cr_valor.toFixed(2);
        });

        res.json({ data: rec, count, limit });
      }
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getItensDocumento = async (req, res) => {
    try {
      var itens = await app
        .db("consignado")
        .select(
          "produto.pro_nome AS nome",
          "conit_quantidade as quantidade",
          "conit_total as total"
        )
        .leftJoin(
          "consignado_item",
          "consignado_item.con_documento",
          "consignado.con_documento"
        )
        .leftJoin("produto", "produto.pro_id", "consignado_item.pro_id")
        .where({
          "consignado.cli_id": req.params.cliente,
          "consignado.emp_id": req.params.emp_id,
        })
        .andWhere({
          "consignado.con_documento": req.params.documento,
          "consignado_item.emp_id": req.params.emp_id,
        })
        .andWhere({
          "consignado_item.con_id": req.params.idVenda,
          "consignado_item.con_documento": req.params.documento,
        })
        .andWhere(function () {
          this.where("consignado_item.conit_quantidade", ">", 0);
        });

      itens.forEach((element) => {
        element.total = element.total.toFixed(2);
      });

      var result = Object.keys(itens).map(function (key) {
        return itens[key];
      });

      res.json(result);
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  function dateToString(value) {
    if (value) {
      let dia = value.substr(8, 2);
      let mes = value.substr(5, 2);
      let ano = value.substr(0, 4);
      return dia + "/" + mes + "/" + ano;
    }
  }

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

  return {
    save,
    remove,
    get,
    getById,
    getValoresCliente,
    finalizarPagamento,
    getRecebimentos,
    getByClienteRecebimentos,
    getRecebimentosPorData,
    getDocumentosAVencer,
    getItensDocumento,
    removePagamento,
    getLimiteCredito,
  };
};
