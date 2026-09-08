<template>
  <div class="pagar-pages">
    <PageTitle icon="fa fa-usd" main="Contas à Pagar" />
    <div class="pagar-pages-tabs">
      <b-card no-body>
        <b-tabs card>
          <b-tab
            title="Documentos à Pagar"
            active
            :disabled="usuarioStorage.exibeDocumentos === 0"
          >
            <Pagar />
          </b-tab>
          <b-tab
            title="Pagamentos"
            :disabled="usuarioStorage.exibeRecebimentos === 0"
          >
            <Pagamentos />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Pagar from "./Pagar";
import Pagamentos from "./Pagamentos";
import { userKey } from "@/global";

export default {
  name: "PagarPages",
  components: { PageTitle, Pagar, Pagamentos },
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
