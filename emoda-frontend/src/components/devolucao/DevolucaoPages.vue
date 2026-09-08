<template>
  <div class="devolucao-pages">
    <PageTitle icon="fa fa-undo" main="Devoluções" />
    <div class="devolucao-pages-tabs">
      <b-card no-body>
        <b-tabs card v-model="tabIndex">
          <b-tab title="Vendas" active>
            <Vendas />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Bus from "../../config/bus";
import Vendas from "./DevolucaoVenda";

export default {
  name: "devolucaoPages",
  components: { PageTitle, Vendas },
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

<style>
</style>
