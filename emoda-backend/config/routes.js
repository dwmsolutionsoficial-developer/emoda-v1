const admin = require("./admin");

module.exports = async (app) => {
  // ROTAS DE AUTENTICAÇÃO
  await app.post("/signup", app.api.usuario.save);
  await app.post("/signin", app.api.auth.signin);
  await app.post("/validateToken", app.api.auth.validateToken);

  // ROTAS ADMINISTRATIVAS
  await app
    .route("/empresas")
    .post(app.api.empresa.save)
    .get(app.api.empresa.get);

  await app
    .route("/empresas/:id")
    .put(app.api.empresa.save)
    .get(app.api.empresa.getById)
    .delete(app.api.empresa.remove);

  await app
    .route("/usuariosAdmin/:emp_id")
    .post(app.api.usuario.save)
    .get(app.api.usuario.get);

  await app
    .route("/usuariosAdmin/:id/:emp_id")
    .put(app.api.usuario.save)
    .get(app.api.usuario.getById)
    .delete(app.api.usuario.remove);

  // ROTAS DO SISTEMA
  await app
    .route("/verificaNumero/:documento/:emp_id")
    .get(app.api.configuracao.verificaNumeroDocumento);

  await app
    .route("/configuracoes/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.configuracao.save))
    .get(admin(app.api.configuracao.get));

  await app
    .route("/configuracoes/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.configuracao.save));

  await app
    .route("/usuarios/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.usuario.save))
    .get(admin(app.api.usuario.get));

  await app
    .route("/usuarios/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.usuario.save))
    .get(admin(app.api.usuario.getById))
    .delete(admin(app.api.usuario.remove));

  await app
    .route("/bancos/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.banco.save))
    .get(admin(app.api.banco.get));

  await app
    .route("/bancos/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.banco.save))
    .get(admin(app.api.banco.getById))
    .delete(admin(app.api.banco.remove));

  await app
    .route("/atualizaSaldoBanco/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.banco.atualizaSaldo));

  await app
    .route("/grupos/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.grupo.save))
    .get(admin(app.api.grupo.get));

  await app
    .route("/grupos/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.grupo.save))
    .get(admin(app.api.grupo.getById))
    .delete(admin(app.api.grupo.remove));

  await app
    .route("/marcas/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.marca.save))
    .get(admin(app.api.marca.get));

  await app
    .route("/marcas/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.marca.save))
    .get(admin(app.api.marca.getById))
    .delete(admin(app.api.marca.remove));

  await app
    .route("/cores/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.cor.save))
    .get(admin(app.api.cor.get));

  await app
    .route("/cores/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.cor.save))
    .get(admin(app.api.cor.getById))
    .delete(admin(app.api.cor.remove));

  await app
    .route("/tamanhos/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.tamanho.save))
    .get(admin(app.api.tamanho.get));

  await app
    .route("/tamanhos/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.tamanho.save))
    .get(admin(app.api.tamanho.getById))
    .delete(admin(app.api.tamanho.remove));

  await app
    .route("/unidades/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.unidade.save))
    .get(admin(app.api.unidade.get));

  await app
    .route("/unidades/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.unidade.save))
    .get(admin(app.api.unidade.getById))
    .delete(admin(app.api.unidade.remove));

  await app
    .route("/clientes/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.cliente.save))
    .get(admin(app.api.cliente.get));

  await app
    .route("/todosClientes/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.cliente.todosClientes));

  await app
    .route("/clientes/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.cliente.save))
    .get(admin(app.api.cliente.getById))
    .delete(admin(app.api.cliente.remove));

  await app
    .route("/buscaClientes/:nome/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.cliente.getByNome));

  await app
    .route("/historicoClientes/:emp_id")
    // .all(app.config.passport.authenticate())
    .get(app.api.cliente.getHistoricoCliente);

  await app
    .route("/buscaDiaPagamentoCliente/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.cliente.getDiaPagamento));

  await app
    .route("/fornecedores/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.fornecedor.save))
    .get(admin(app.api.fornecedor.get));

  await app
    .route("/fornecedores/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.fornecedor.save))
    .get(admin(app.api.fornecedor.getById))
    .delete(admin(app.api.fornecedor.remove));

  await app
    .route("/todosFornecedores/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.fornecedor.todosFornecedores));

  await app
    .route("/produtos/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.produto.save))
    .get(admin(app.api.produto.get));

  await app
    .route("/produtos/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.produto.save))
    .get(admin(app.api.produto.getById))
    .delete(admin(app.api.produto.remove));

  await app
    .route("/todosProdutos/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.produto.todosProdutos));

  await app
    .route("/buscaProdutos/:nome/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.produto.getByNome));

  await app
    .route("/addEstoque/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.produto.addEstoque));

  await app
    .route("/valorEstoque/:emp_id")
    .all(app.config.passport.authenticate())
    .get(app.api.produto.getCustoLoja);

  await app
    .route("/caixasAbertos/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.caixa.save))
    .get(admin(app.api.caixa.getAbertos));

  await app
    .route("/caixasAbertos/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.caixa.save))
    .get(admin(app.api.caixa.getById))
    .delete(admin(app.api.caixa.remove));

  await app
    .route("/caixasAbertosTotalizacao/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.caixa.getTotalizacao));

  await app
    .route("/caixasFechados/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.caixa.getFechados));

  await app
    .route("/preencheValoresFechamento/:emp_id/:data")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.caixa.getPreencheValoresFechamento));

  await app
    .route("/fechaCaixa/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.caixa.fechaCaixa));

  await app
    .route("/buscaCaixaPorData/:data/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.caixa.buscaCaixaPorData));

  await app
    .route("/consignados/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.consignado.save))
    .get(admin(app.api.consignado.get));

  await app
    .route("/consignados/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.consignado.save))
    .get(admin(app.api.consignado.getById))
    .get(admin(app.api.consignado.getItens))
    .delete(admin(app.api.consignado.remove));

  await app
    .route("/consignadoItens/:documento/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.consignado.getItens))
    .delete(admin(app.api.consignado.remove));

  await app
    .route("/atualizaItemConsignado/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.consignado.atualizaItem));

  await app
    .route("/atualizaTotalConsignado/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.consignado.atualizaTotal));

  await app
    .route("/fechaconsignado/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.consignado.fechaConsignado));

  await app
    .route("/buscaProdutoCodigoBarras/:codigo/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.consignado.buscaProdutoCodigoBarras));

  await app
    .route("/receber/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.receber.save));

  await app
    .route("/receber/:nome/:data/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.get));

  await app
    .route("/receber/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.receber.save))
    .get(admin(app.api.receber.getById))
    .delete(admin(app.api.receber.remove));

  await app
    .route("/receberValoresCliente/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.getValoresCliente));

  await app
    .route("/recebimentos/:nome/:data/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.getRecebimentos));

  await app
    .route("/buscaClientesRecebimentos/:nome/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.getByClienteRecebimentos));

  await app
    .route("/buscaRecebimentosPorData/:data/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.getRecebimentosPorData));

  await app
    .route("/buscaDocumentosAVencer/:dataInicial/:dataFinal/:dia/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.getDocumentosAVencer));

  await app
    .route("/finalizarPagamento/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.receber.finalizarPagamento));

  await app
    .route("/itensDocumento/:documento/:cliente/:idVenda/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.receber.getItensDocumento));

  await app
    .route("/removePagamento/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .delete(admin(app.api.receber.removePagamento));

  await app
    .route("/limiteCreditoCliente/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .get(app.api.receber.getLimiteCredito);

  await app
    .route("/todosUsuarios/:emp_id")
    .all(app.config.passport.authenticate())
    .get(app.api.usuario.todosUsuarios);

  await app
    .route("/finalizaVenda/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.venda.save));

  await app
    .route("/listaVendas/:dataInicial/:dataFinal/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.venda.getVendas));

  await app
    .route("/devolucaoVenda/:numero/:cliente/:emp_id")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.venda.getVendaCancelamento))
    .post(admin(app.api.venda.devolucaoVenda));

  await app
    .route("/pagar/:emp_id")
    .all(app.config.passport.authenticate())
    .post(admin(app.api.tamanho.save))
    .get(admin(app.api.tamanho.get));

  await app
    .route("/pagar/:id/:emp_id")
    .all(app.config.passport.authenticate())
    .put(admin(app.api.tamanho.save))
    .get(admin(app.api.tamanho.getById))
    .delete(admin(app.api.tamanho.remove));

  //RELATÓRIOS

  await app
    .route("/totalVendas/:dataInicial/:dataFinal/:emp_id")
    //.all(app.config.passport.authenticate())
    .get(app.api.relatorio.getTotalVendas);

  await app
    .route("/totalRecebimentos/:dataInicial/:dataFinal/:emp_id")
    //.all(app.config.passport.authenticate())
    .get(app.api.relatorio.getTotalRecebimentos);

  await app
    .route("/totalPorVendedor/:dataInicial/:dataFinal/:id/:emp_id")
    //.all(app.config.passport.authenticate())
    .get(app.api.relatorio.getTotalPorVendedor);

  await app
    .route("/totalDespesas/:dataInicial/:dataFinal/:emp_id")
    //.all(app.config.passport.authenticate())
    .get(app.api.relatorio.getTotalDespesas);

  await app
    .route("/totalLucro/:dataInicial/:dataFinal/:emp_id")
    //.all(app.config.passport.authenticate())
    .get(app.api.relatorio.getLucro);

  await app
    .route("/clientesAVista/:emp_id")
    .get(app.api.relatorio.getClientesAVista);
};
