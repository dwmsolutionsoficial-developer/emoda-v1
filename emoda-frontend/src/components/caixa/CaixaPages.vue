<template>
  <div class="caixa-pages">
    <PageTitle icon="fa fa-usd" main="Controle de Caixa" />
    <div class="caixa-pages-tabs">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Caixa em Aberto" active>
            <CaixaAberto />
          </b-tab>
          <b-tab title="Caixas Fechados">
            <CaixaFechado />
          </b-tab>
          <b-tab title="Fechamento de Caixa">
            <CaixaFechamento />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import CaixaAberto from "./CaixaAberto";
import CaixaFechado from "./CaixaFechado";
import CaixaFechamento from "./CaixaFechamento";

export default {
  name: "CaixaPages",
  components: { PageTitle, CaixaAberto, CaixaFechado, CaixaFechamento }
};
</script>

<style>
</style>
