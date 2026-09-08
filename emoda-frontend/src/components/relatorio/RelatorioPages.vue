<template>
  <div class="relatorio-pages">
    <PageTitle icon="fa fa-list-alt" main="Relatórios" />
    <div class="relatorio-pages-tabs">
      <b-card no-body>
        <b-tabs card v-model="tabIndex">
          <b-tab title="Vendas" active>
            <Vendas />
          </b-tab>
          <b-tab title="Recebimentos">
            <Recebimentos />
          </b-tab>
          <b-tab title="Por Vendedor">
            <VendasPorVendedor />
          </b-tab>
          <b-tab title="Lucro">
            <Lucro />
          </b-tab>
          <b-tab title="Valor do Estoque">
            <CustoLoja />
          </b-tab>
          <b-tab title="Histórico de Clientes">
            <HistoricoClientes />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Bus from "../../config/bus";
import Vendas from "./RelatorioVendas";
import Recebimentos from "./RelatorioRecebimentos";
import VendasPorVendedor from "./RelatorioVendasPorVendedor";
import Lucro from "./RelatorioLucro.vue";
import CustoLoja from "./RelatorioCustoLoja.vue";
import HistoricoClientes from "./RelatorioHistoricoClientes.vue";

export default {
  name: "relatorioPages",
  components: {
    PageTitle,
    Vendas,
    Recebimentos,
    VendasPorVendedor,
    Lucro,
    CustoLoja,
    HistoricoClientes,
  },
  data() {
    return {
      tabIndex: 1,
    };
  },
  mounted() {
    Bus.$on("pagina", (value) => {
      this.tabIndex -= value;
    });
  },
};
</script>

<style></style>
