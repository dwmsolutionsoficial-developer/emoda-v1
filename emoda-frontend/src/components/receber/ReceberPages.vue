<template>
  <div class="caixa-pages">
    <PageTitle icon="fa fa-usd" main="Contas à Receber" />
    <div class="caixa-pages-tabs">
      <b-card no-body>
        <b-tabs card>
          <b-tab
            title="Documentos"
            active
            :disabled="usuarioStorage.exibeDocumentos === 0"
          >
            <Receber />
          </b-tab>
          <b-tab
            title="Pagamento"
            :disabled="usuarioStorage.exibePagamento === 0"
          >
            <ReceberPagamento />
          </b-tab>
          <b-tab
            title="Recebimentos"
            :disabled="usuarioStorage.exibeRecebimentos === 0"
          >
            <Recebimentos />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Receber from "./Receber";
import ReceberPagamento from "./ReceberPagamento";
import Recebimentos from "./Recebimentos";
import { userKey } from "@/global";

export default {
  name: "ReceberPages",
  components: { PageTitle, Receber, ReceberPagamento, Recebimentos },
  data: function () {
    return {
      usuarioStorage: {},
    };
  },
  methods: {
    loadUsuario() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
    },
  },
  mounted() {
    this.loadUsuario();
  },
};
</script>

<style>
</style>
