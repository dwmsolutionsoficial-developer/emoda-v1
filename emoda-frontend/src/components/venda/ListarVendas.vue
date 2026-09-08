<template>
  <div class="listar-vendas">
    <PageTitle icon="fa fa-list-alt" main="Listagem de Vendas" />
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data Inicial:" label-for="listar-vendas-dataInicial">
            <b-form-input
              id="listar-vendas-dataInicial"
              type="date"
              v-model="listarVendas.dataInicial"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Data Final:" label-for="listar-vendas-dataFinal">
            <b-form-input
              id="listar-vendas-dataFinal"
              type="date"
              v-model="listarVendas.dataFinal"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" @click="buscaVendas">Buscar</b-button>
          <b-button variant="danger" class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
      <br />
      <b-table hover striped :items="vendas" :fields="fields">
        <template slot="actions"></template>
      </b-table>
      <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </b-form>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "listarVendas",
  components: { PageTitle },
  data: function () {
    return {
      listarVendas: {},
      vendas: [],
      usuarioStorage: {},
      fields: [
        { key: "con_documento", label: "Documento", sortable: true },
        { key: "cli_nome", label: "Cliente", sortable: true },
        { key: "con_data", label: "Data", sortable: true },
        { key: "con_total", label: "Total", sortable: true },
        { key: "pagamento", label: "Pagamento", sortable: true },
        { key: "tipo_pagamento", label: "Tipo de Pagamento", sortable: true },
        { key: "usu_nome", label: "Vendedor", sortable: true },
      ],
      page: 1,
      limit: 0,
      count: 0,
    };
  },
  methods: {
    reset() {
      this.listarVendas = {};
      this.vendas = [];
      this.buscaVendas();
    },
    buscaVendas() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/listaVendas/${this.listarVendas.dataInicial}/${this.listarVendas.dataFinal}/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios
        .get(url)
        .then((res) => {
          this.vendas = res.data.vendas;
          this.count = res.data.count;
          this.limit = res.data.limit;
        })
        .catch(showError);
    },
  },
  watch: {
    page() {
      this.buscaVendas();
    },
  },
  mounted() {
    this.buscaVendas();
  },
};
</script>

<style>
</style>