<template>
  <div class="consignado-pages">
    <PageTitle icon="fa fa-cart-plus" main="Controle de Consignado" />
    <div class="consignado-pages-tabs">
      <b-card no-body>
        <b-tabs card v-model="tabIndex">
          <b-tab title="Novo Consignado" active>
            <NovoConsignado />
          </b-tab>
          <b-tab title="Consignados em Aberto">
            <ConsignadoAberto />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import NovoConsignado from "./NovoConsignado";
import ConsignadoAberto from "./ConsignadoAberto";
import Bus from "../../config/bus";

export default {
  name: "consignadoPages",
  components: { PageTitle, NovoConsignado, ConsignadoAberto },
  data() {
    return {
      tabIndex: 1
    };
  },
  mounted() {
    Bus.$on("pagina", value => {
      this.tabIndex -= value;
    });
  }
};
</script>

<style>
</style>
