<template>
  <div class="caixa-fechado">
    <b-table hover striped :items="caixas" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadCaixa(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { baseApiUrl, userKey } from "@/global";
import axios from "axios";

export default {
  name: "CaixaAberto",
  data: function() {
    return {
      money: {
        decimal: ".",
        thousands: "",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      mode: "save",
      caixa: {},
      caixas: [],
      categories: [],
      users: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "cai_data", label: "Data", sortable: true },
        { key: "cai_cred_deb", label: "C/D", sortable: true },
        { key: "cai_descricao", label: "Descrição", sortable: true },
        { key: "cai_valor", label: "Valor", sortable: true }
      ],
      usuarioStorage: {}
    };
  },
  methods: {
    loadCaixas() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/caixasFechados/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then(res => {
        this.caixas = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    loadCaixa(caixa, mode = "save") {
      this.mode = mode;
      const dados = {
        id: caixa.cai_id,
        data: caixa.cai_data.substring(0, 10),
        credito_debito: caixa.cai_cred_deb,
        descricao: caixa.cai_descricao,
        valor: caixa.cai_valor,
        empresa: caixa.emp_id
      };
      this.caixa = { ...dados };
    },
    formataData(value) {
      if (value) {
        let dia = value.substr(8, 2);
        let mes = value.substr(5, 2);
        let ano = value.substr(0, 4);
        return dia + "/" + mes + "/" + ano;
      }
    }
  },
  watch: {
    page() {
      this.loadCaixas();
    }
  },
  mounted() {
    this.loadCaixas();
  }
};
</script>

<style>
</style>