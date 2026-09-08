<template>
  <div class="clienteAVencer">
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group
            label="Data Inicial:"
            label-for="clienteAVencer-data-inicial"
          >
            <b-form-input
              id="clienteAVencer-data-inicial"
              type="date"
              v-model="clienteAVencer.data_inicial"
              placeholder="Informe a Data Inicial"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            label="Data Final:"
            label-for="clienteAVencer-data-final"
          >
            <b-form-input
              id="clienteAVencer-data-final"
              type="date"
              v-model="clienteAVencer.data_final"
              placeholder="Informe a Data Final"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            label="Dia Preferencial:"
            label-for="clienteAVencer-dia-preferencial"
          >
            <b-form-input
              id="clienteAVencer-dia-preferencial"
              type="number"
              v-model="clienteAVencer.dia_preferencial"
              placeholder="Informe o dia"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" sm="12">
          <b-button variant="primary" @click="loadClientesAVencer()"
            >Listar</b-button
          >
        </b-col>
      </b-row>
    </b-form>
    <br />
    <b-table hover striped :items="dados" :fields="fields">
      <template slot="actions" slot-scope>
        <!--
        <b-button variant="warning" @click="loadBanco(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
        -->
      </template>
    </b-table>
    <b-pagination
      size="md"
      v-model="page"
      :total-rows="count"
      :per-page="limit"
    />
  </div>
</template>

<script>
import { baseApiUrl, userKey } from "@/global";
import axios from "axios";

export default {
  name: "clienteAVencer",
  data: function () {
    return {
      usuarioStorage: {},
      clienteAVencer: {},
      dados: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [{ key: "cli_nome", label: "Cliente", sortable: true }],
    };
  },
  methods: {
    loadClientesAVencer() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      if (
        this.clienteAVencer.dia_preferencial === undefined ||
        this.clienteAVencer.dia_preferencial > 31
      ) {
        this.clienteAVencer.dia_preferencial = 0;
      }

      const url = `${baseApiUrl}/buscaDocumentosAVencer/${this.clienteAVencer.data_inicial}/${this.clienteAVencer.data_final}/${this.clienteAVencer.dia_preferencial}/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then((res) => {
        this.dados = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    reset() {
      this.dados = {};
    },
  },
  watch: {
    page() {
      this.loadClientesAVencer();
    },
  },
};
</script>

<style>
</style>