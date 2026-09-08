module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = async (req, res) => {
    const cliente = {
      cli_id: req.body.cli_id,
      cli_nome: req.body.nome,
      cli_fisica_juridica: req.body.tipoPessoa,
      cli_cpf: req.body.cpf,
      cli_rg: req.body.rg,
      cli_cnpj: req.body.cnpj,
      cli_ie: req.body.ie,
      cli_endereco: req.body.endereco,
      cli_numero: req.body.numero,
      cli_bairro: req.body.bairro,
      cli_complemento: req.body.complemento,
      cli_cep: req.body.cep,
      cli_cidade: req.body.cidade,
      cli_uf: req.body.uf,
      cli_telefone: req.body.telefone,
      cli_celular: req.body.celular,
      cli_whatsapp: req.body.whatsapp,
      cli_email: req.body.email,
      cli_limite_minimo: req.body.limiteMinimo,
      cli_limite: req.body.limite,
      cli_bloqueado: req.body.bloqueado,
      cli_exibe_limite: req.body.exibeLimite,
      cli_cadastro: req.body.cadastro,
      cli_nascimento: req.body.nascimento,
      cli_referencia: req.body.referencia,
      cli_dia_pagamento: req.body.diaPagamento,
      cli_inativo: req.body.inativo,
      emp_id: req.body.empresa,
    };

    if (req.params.id) cliente.cli_id = req.params.id;
    if (req.params.emp_id) cliente.emp_id = req.params.emp_id;

    try {
      existsOrError(cliente.cli_nome, "Nome não informado");
      if (cliente.cli_dia_pagamento <= 0 || cliente.cli_dia_pagamento > 31)
        throw "Dia Preferencial inválido. Escolha entre 1 à 31";
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (cliente.cli_id) {
      await app
        .db("cliente")
        .update(cliente)
        .where({ cli_id: cliente.cli_id, emp_id: cliente.emp_id });

      if (cliente.cli_dia_pagamento > 0 && cliente.cli_dia_pagamento <= 31) {
        await app
          .db("contas_receber")
          .update({ cr_dia_preferencial: cliente.cli_dia_pagamento })
          .where({ cli_id: cliente.cli_id, emp_id: cliente.emp_id });
      }
      res.status(204).send();
    } else {
      app
        .db("cliente")
        .insert(cliente)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      const consignados = await app
        .db("consignado")
        .where({ cli_id: req.params.id });
      notExistsOrError(consignados, "O Cliente possui Consignados vinculados.");

      const pagamentos = await app
        .db("pagamento")
        .where({ cli_id: req.params.id });
      notExistsOrError(pagamentos, "O Cliente possui Pagamentos vinculadas.");

      const rowsDeleted = await app
        .db("cliente")
        .where({ cli_id: req.params.id, emp_id: req.params.emp_id })
        .del();
      existsOrError(rowsDeleted, "O Cliente não foi encontrado.");

      res.status(204).send();
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const limit = 100;
  const get = async (req, res) => {
    try {
      const page = req.query.page || 1;

      const result = await app
        .db("cliente")
        .count("cli_id as id")
        .where({ emp_id: req.params.emp_id })
        .first();
      const count = parseInt(result.id);

      const clientes = await app
        .db("cliente")
        .where({ emp_id: req.params.emp_id })
        .limit(limit)
        .offset(page * limit - limit)
        .orderBy("cli_nome");

      res.json({ data: clientes, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const todosClientes = async (req, res) => {
    try {
      const clientes = await app
        .db("cliente")
        .where({ emp_id: req.params.emp_id, cli_inativo: 0 })
        .orderBy("cli_nome");

      res.json({ data: clientes });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getById = (req, res) => {
    app
      .db("cliente")
      .where({ cli_id: req.params.id, emp_id: req.params.emp_id })
      .first()
      .then((cliente) => res.json(cliente))
      .catch((err) => res.status(500).send(err));
  };

  const getByNome = async (req, res) => {
    try {
      const page = req.query.page || 1;

      const result = await app
        .db("cliente")
        .count("cli_id as id")
        .where({ emp_id: req.params.emp_id })
        .andWhere("cli_nome", "like", "%" + req.params.nome + "%");
      const count = parseInt(result.id);

      const clientes = await app
        .db("cliente")
        .where({ emp_id: req.params.emp_id })
        .andWhere("cli_nome", "like", "%" + req.params.nome + "%")
        .limit(limit)
        .offset(page * limit - limit);

      res.json({ data: clientes, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getDiaPagamento = async (req, res) => {
    try {
      const cliente = await app
        .db("cliente")
        .select("cli_dia_pagamento")
        .where({ cli_id: req.params.id, emp_id: req.params.emp_id });

      res.json({ data: cliente });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getHistoricoCliente = async (req, res) => {
    try {
      const pagamento = await app
        .db("pagamento")
        .select("cli_id")
        .max("pag_data as ultimaDataPagamento")
        .sum("pag_valor as totalPago")
        .where({
          "pagamento.emp_id": req.params.emp_id,
        })
        .groupBy("cli_id");

      const receber = await app
        .db("contas_receber")
        .select("cli_id")
        .sum("cr_valor as totalDevedor")
        .where({
          "contas_receber.emp_id": req.params.emp_id,
        })
        .groupBy("cli_id");

      const consignado = await app
        .db("consignado")
        .select("cli_id")
        .max("con_data as ultimaDataCompra")
        .where({
          "consignado.emp_id": req.params.emp_id,
        })
        .groupBy("cli_id");

      const clientes = await app
        .db("cliente")
        .select("cli_id", "cli_nome")
        .where({
          "cliente.emp_id": req.params.emp_id,
        })
        .orderBy("cliente.cli_nome");

      const listaClientes = clientes.map((cliente) => {
        const infoPagamento = pagamento.find(
          (p) => p.cli_id === cliente.cli_id
        );
        const infoReceber = receber.find((r) => r.cli_id === cliente.cli_id);
        const infoConsignado = consignado.find(
          (c) => c.cli_id === cliente.cli_id
        );

        return {
          id_cliente: cliente.cli_id,
          nome_cliente: cliente.cli_nome,
          ultimaDataCompra: infoConsignado
            ? infoConsignado.ultimaDataCompra
            : null,
          ultimaDataPagamento: infoPagamento
            ? infoPagamento.ultimaDataPagamento
            : null,
          totalPago: infoPagamento ? infoPagamento.totalPago : 0,
          totalDevedor: infoReceber ? infoReceber.totalDevedor : 0,
          totalSaldo:
            (infoPagamento ? infoPagamento.totalPago : 0) -
            (infoReceber ? infoReceber.totalDevedor : 0),
        };
      });

      res.json({ listaClientes });
    } catch (msg) {
      console.log(msg);
      res.status(400).send(msg);
    }
  };

  return {
    save,
    remove,
    get,
    getById,
    getByNome,
    todosClientes,
    getDiaPagamento,
    getHistoricoCliente,
  };
};
