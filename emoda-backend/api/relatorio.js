module.exports = (app) => {
  const { existsOrError } = app.api.validation;

  const getTotalVendas = async (req, res) => {
    try {
      existsOrError(req.params.dataInicial, "Data Inicial não informada");
      existsOrError(req.params.dataFinal, "Data Final não informada");

      const v1 = await app
        .db("consignado")
        .sum("con_total as aVista")
        .where({ emp_id: req.params.emp_id, con_status: 1 })
        .andWhere({ con_pagamento: 1 })
        .andWhere(function () {
          this.where("con_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("con_data", "<=", req.params.dataFinal);
        });

      const v2 = await app
        .db("consignado")
        .sum("con_total as aPrazo")
        .where({ emp_id: req.params.emp_id, con_status: 1 })
        .andWhere({ con_pagamento: 2 })
        .andWhere(function () {
          this.where("con_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("con_data", "<=", req.params.dataFinal);
        });

      res.json({ v1, v2 });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getTotalRecebimentos = async (req, res) => {
    try {
      existsOrError(req.params.dataInicial, "Data Inicial não informada");
      existsOrError(req.params.dataFinal, "Data Final não informada");

      const totalRecebimentos = await app
        .db("pagamento")
        .sum("pag_valor as total")
        .where({ emp_id: req.params.emp_id })
        .andWhere(function () {
          this.where("pag_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("pag_data", "<=", req.params.dataFinal);
        });
      res.json({ totalRecebimentos });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const limit = 100;
  const getClientesAVista = async (req, res) => {
    try {
      const page = req.query.page || 1;

      //const result = await app.db('cliente').count('cli_id as id').where({ emp_id: req.params.emp_id }).first()
      const result = await app
        .db("cliente")
        .count("cliente.cli_id as id")
        .leftJoin("consignado", "cliente.cli_id", "consignado.cli_id")
        .where({
          "consignado.emp_id": req.params.emp_id,
        })
        .andWhere("cliente.cli_id", "NOT IN", function () {
          this.select("consignado.cli_id")
            .from("consignado")
            .whereNotNull("con_pagamento")
            .andWhereNot("con_pagamento", 1);
        })
        .andWhere("cliente.cli_id", "IN", function () {
          this.select("consignado.cli_id")
            .from("consignado")
            .whereNotNull("con_pagamento")
            .andWhere("con_pagamento", 1)
            .groupBy("cli_id")
            .havingRaw("COUNT(*) = 1");
        })
        .first();
      const count = parseInt(result.id);

      const clientes = await app
        .db("cliente")
        .leftJoin("consignado", "cliente.cli_id", "consignado.cli_id")
        .where({
          "consignado.emp_id": req.params.emp_id,
        })
        .andWhere("cliente.cli_id", "NOT IN", function () {
          this.select("consignado.cli_id")
            .from("consignado")
            .whereNotNull("con_pagamento")
            .andWhereNot("con_pagamento", 1);
        })
        .andWhere("cliente.cli_id", "IN", function () {
          this.select("consignado.cli_id")
            .from("consignado")
            .whereNotNull("con_pagamento")
            .andWhere("con_pagamento", 1)
            .groupBy("cli_id")
            .havingRaw("COUNT(*) = 1");
        })
        .limit(limit)
        .offset(page * limit - limit)
        .orderBy("cli_nome");

      res.json({ clientes: clientes, count, limit });
    } catch (msg) {
      console.log(msg);
      res.status(400).send(msg);
    }
  };

  const getTotalPorVendedor = async (req, res) => {
    try {
      existsOrError(req.params.dataInicial, "Data Inicial não informada!");
      existsOrError(req.params.dataFinal, "Data Final não informada!");
      existsOrError(req.params.id, "Vendedor não informado!");

      const totalPorVendedor = await app
        .db("consignado")
        .select("usu_nome as nome")
        .sum("con_total as total")
        .leftJoin("usuario", "consignado.con_vendedor", "usuario.usu_id")
        .where({
          con_vendedor: req.params.id,
          "consignado.emp_id": req.params.emp_id,
        })
        .andWhere({ con_status: 1 })
        .andWhere(function () {
          this.where("con_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("con_data", "<=", req.params.dataFinal);
        });

      const clientes = await app
        .db("consignado")
        .leftJoin("cliente", "consignado.cli_id", "cliente.cli_id")
        .where({
          "consignado.emp_id": req.params.emp_id,
        });

      existsOrError(
        totalPorVendedor[0].nome,
        "O vendedor não possui vendas nesse período!"
      );
      existsOrError(
        totalPorVendedor[0].total,
        "O vendedor não possui vendas nesse período!"
      );

      res.json({ totalPorVendedor });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getTotalDespesas = async (req, res) => {
    try {
      var totalCaixa = await app
        .db("caixa")
        .sum("cai_valor as total")
        .where({ emp_id: req.params.emp_id })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .andWhere(function () {
          this.orWhere({ cai_codigo: "2.2" })
            .orWhere({ cai_codigo: "2.6" })
            .orWhere({ cai_codigo: "2.7" });
        });

      var totalCompras = await app
        .db("compra")
        .sum("com_total as total")
        .where({ emp_id: req.params.emp_id })
        .andWhere(function () {
          this.where("com_entrada", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("com_entrada", "<=", req.params.dataFinal);
        });

      totalCaixa[0].total =
        totalCaixa[0].total === null ? 0.0 : totalCaixa[0].total.toFixed(2);
      totalCompras[0].total =
        totalCompras[0].total === null ? 0.0 : totalCompras[0].total.toFixed(2);

      var totalDespesas =
        parseInt(totalCaixa[0].total) + parseInt(totalCompras[0].total);
      totalDespesas = totalDespesas.toFixed(2);

      res.json({ totalCaixa, totalCompras, totalDespesas });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getLucro = async (req, res) => {
    try {
      var totalAlimentacao = await app
        .db("caixa")
        .sum("cai_valor as alimentacao")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "D",
          cancelado: 0,
          cai_codigo: "2.7",
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .first();

      var totalPagamentos = await app
        .db("caixa")
        .sum("cai_valor as pagamentos")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "D",
          cancelado: 0,
          cai_codigo: "2.2",
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .first();

      var totalDebito = await app
        .db("caixa")
        .sum("cai_valor as total")
        .where({ emp_id: req.params.emp_id, cai_cred_deb: "D", cancelado: 0 })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .first();

      var totalDinheiro = await app
        .db("caixa")
        .sum("cai_dinheiro as dinheiro")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "C",
          cancelado: 0,
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .andWhere(function () {
          this.where({ cai_codigo: "1.0" });
          this.orWhere({ cai_codigo: "1.2" });
        })
        .first();

      var totalCartao = await app
        .db("caixa")
        .sum("cai_cartao as cartao")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "C",
          cancelado: 0,
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .andWhere(function () {
          this.where({ cai_codigo: "1.0" });
          this.orWhere({ cai_codigo: "1.2" });
        })
        .first();

      var totalCheque = await app
        .db("caixa")
        .sum("cai_cheque as cheque")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "C",
          cancelado: 0,
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .andWhere(function () {
          this.where({ cai_codigo: "1.0" });
          this.orWhere({ cai_codigo: "1.2" });
        })
        .first();

      var totalPix = await app
        .db("caixa")
        .sum("cai_pix as pix")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "C",
          cancelado: 0,
        })
        .andWhere(function () {
          this.where({ cai_codigo: "1.0" });
          this.orWhere({ cai_codigo: "1.2" });
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .first();

      var totalAberturaCaixa = await app
        .db("caixa")
        .sum("cai_valor as inicio")
        .where({
          emp_id: req.params.emp_id,
          cai_cred_deb: "C",
          cancelado: 0,
        })
        .andWhere(function () {
          this.where({ cai_codigo: "1.3" });
        })
        .andWhere(function () {
          this.where("cai_data", ">=", req.params.dataInicial);
        })
        .andWhere(function () {
          this.where("cai_data", "<=", req.params.dataFinal);
        })
        .first();

      res.json({
        Abertura:
          totalAberturaCaixa.inicio === null ? 0.0 : totalAberturaCaixa.inicio,
        Dinheiro:
          totalDinheiro.dinheiro === null ? 0.0 : totalDinheiro.dinheiro,
        Cartao: totalCartao.cartao === null ? 0.0 : totalCartao.cartao,
        Cheque: totalCheque.cheque === null ? 0.0 : totalCheque.cheque,
        Pix: totalPix.pix === null ? 0.0 : totalPix.pix,

        Credito:
          totalDinheiro.dinheiro +
          totalCartao.cartao +
          totalCheque.cheque +
          totalPix.pix,

        Debito: totalDebito.total === null ? 0.0 : totalDebito.total,
        Alimentacao:
          totalAlimentacao.alimentacao === null
            ? 0.0
            : totalAlimentacao.alimentacao,
        Pagamentos:
          totalPagamentos.pagamentos === null
            ? 0.0
            : totalPagamentos.pagamentos,
        Lucro: parseFloat(
          totalDinheiro.dinheiro +
            totalCartao.cartao +
            totalCheque.cheque +
            totalPix.pix -
            totalDebito.total
        ),
      });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  return {
    getTotalVendas,
    getTotalRecebimentos,
    getTotalPorVendedor,
    getTotalDespesas,
    getLucro,
    getClientesAVista,
  };
};
