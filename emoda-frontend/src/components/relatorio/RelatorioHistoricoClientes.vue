<template>
  <div>
    <!-- <b-table hover striped :items="clientes" :fields="fields"> </b-table> -->
    <b-table
      hover
      striped
      :items="clientesPaginados"
      :fields="fields"
    ></b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="clientes.length"
      :per-page="perPage"
      @change="handlePageChange"
    ></b-pagination>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "RelatorioHistoricoClientes",
  data: function () {
    return {
      clientes: [],
      usuarioStorage: {},
      perPage: 20, // Número de itens por página
      currentPage: 1, // Página atual
      fields: [
        { key: "nome_cliente", label: "Nome", sortable: true },
        {
          key: "ultimaDataCompra",
          label: "Data da Última Compra",
          sortable: true,
          formatter: this.dateToString,
        },
        {
          key: "ultimaDataPagamento",
          label: "Data do Último Pagamento",
          sortable: true,
          formatter: this.dateToString,
        },
        {
          key: "totalSaldo",
          label: "Saldo Devedor",
          sortable: true,
          formatter: this.numberToReal,
        },
      ],
    };
  },
  created() {
    this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
    this.buscaClientes();
  },
  computed: {
    clientesPaginados() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.clientes.slice(startIndex, endIndex);
    },
  },
  methods: {
    buscaClientes() {
      const url = `${baseApiUrl}/historicoClientes/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then((res) => {
          this.clientes = res.data.listaClientes;
        })
        .catch(showError);
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    dateToString(value) {
      if (value) {
        let dia = value.substr(8, 2);
        let mes = value.substr(5, 2);
        let ano = value.substr(0, 4);
        return ano + "-" + mes + "-" + dia;
      }
    },
    numberToReal(numero) {
      var num = numero.toFixed(2).split(".");
      num[0] = "R$ " + num[0].split(/(?=(?:...)*$)/).join(".");
      return num.join(",");
    },
  },
};
</script>

<style></style>
