module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = (req, res) => {
    const produto = {
      pro_id: req.body.pro_id,
      pro_nome: req.body.nome,
      pro_cod_barra: req.body.codigoBarras,
      uni_id: req.body.unidade,
      mar_id: req.body.marca,
      gru_id: req.body.grupo,
      cor_id: req.body.cor,
      tam_id: req.body.tamanho,
      pro_custo: req.body.precoCusto,
      pro_lucro: req.body.margemLucro,
      pro_venda: req.body.precoVenda,
      pro_estoque: req.body.estoque,
      pro_estoque_minimo: req.body.estoqueMinimo,
      pro_referencia: req.body.referencia,
      pro_bloqueado: !req.body.bloqueado ? 0 : req.body.bloqueado,
      pro_cadastro: req.body.cadastro,
      emp_id: req.body.empresa,
    };

    if (req.params.id) produto.pro_id = req.params.id;
    if (req.params.emp_id) produto.emp_id = req.params.emp_id;

    try {
      existsOrError(produto.pro_nome, "Nome não informado");
      existsOrError(produto.pro_custo, "Preço de Custo não informado");
      existsOrError(produto.pro_venda, "Preço de Venda não informado");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (produto.pro_id) {
      app
        .db("produto")
        .update(produto)
        .where({ pro_id: produto.pro_id, emp_id: produto.emp_id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("produto")
        .insert(produto)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const remove = async (req, res) => {
    try {
      const compras = await app
        .db("compra_item")
        .where({ pro_id: req.params.id });
      notExistsOrError(compras, "O produto possui Compras vinculadas.");

      const consignados = await app
        .db("consignado_item")
        .where({ pro_id: req.params.id });
      notExistsOrError(consignados, "O produto possui Consignados vinculados.");

      const rowsDeleted = await app
        .db("produto")
        .where({ pro_id: req.params.id, emp_id: req.params.emp_id })
        .del();
      existsOrError(rowsDeleted, "O produto não foi encontrado.");

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
        .db("produto")
        .count("pro_id as id")
        .where({ emp_id: req.params.emp_id, pro_bloqueado: 0 })
        .first();
      const count = parseInt(result.id);

      const produtos = await app
        .db("produto")
        .where({ emp_id: req.params.emp_id, pro_bloqueado: 0 })
        .limit(limit)
        .offset(page * limit - limit)
        .orderBy("pro_nome");

      res.json({ data: produtos, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const todosProdutos = async (req, res) => {
    try {
      const produtos = await app
        .db("produto")
        .where({ emp_id: req.params.emp_id, pro_bloqueado: 0 })
        .orderBy("pro_nome");

      res.json({ data: produtos });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const getById = (req, res) => {
    app
      .db("produto")
      .where({ pro_id: req.params.id, emp_id: req.params.emp_id })
      .first()
      .then((produto) => res.json(produto))
      .catch((err) => res.status(500).send(err));
  };

  const getByNome = async (req, res) => {
    try {
      const page = req.query.page || 1;

      const result = await app
        .db("produto")
        .count("pro_id as id")
        .where({ emp_id: req.params.emp_id, pro_bloqueado: 0 })
        .andWhere("pro_nome", "like", "%" + req.params.nome + "%");
      const count = parseInt(result.id);

      const produtos = await app
        .db("produto")
        .where({ emp_id: req.params.emp_id, pro_bloqueado: 0 })
        .andWhere("pro_nome", "like", "%" + req.params.nome + "%")
        .limit(limit)
        .offset(page * limit - limit);

      res.json({ data: produtos, count, limit });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  const addEstoque = async (req, res) => {
    app
      .db("produto")
      .update({ pro_estoque: req.body.estoque })
      .where({ pro_id: req.params.id, emp_id: req.params.emp_id })
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  };

  const getCustoLoja = async (req, res) => {
    try {
      const result = await app
        .db("produto")
        .where({ emp_id: req.params.emp_id })
        .select(
          app.db.raw("SUM(pro_estoque) as total_estoque"), // Calcula o total em estoque
          app.db.raw("SUM(pro_custo * pro_estoque) as valor_total_estoque") // Calcula o valor total do estoque
        );

      const totalEstoque = parseInt(result[0].total_estoque) || 0; // Total em estoque
      const valorTotalEstoque = result[0].valor_total_estoque || 0; // Valor total do estoque

      res.json({ totalEstoque, valorTotalEstoque });
    } catch (msg) {
      res.status(400).send(msg);
    }
  };

  return {
    save,
    remove,
    get,
    getById,
    todosProdutos,
    getByNome,
    addEstoque,
    getCustoLoja,
  };
};
