<template>
  <div class="relatorio-vendas-por-vendedor">
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data Inicial:" label-for="relatorio-venda-por-vendedor-dataInicial">
            <b-form-input
              id="relatorio-venda-por-vendedor-dataInicial"
              type="date"
              v-model="relatorioVendaPorVendedor.dataInicial"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Data Final:" label-for="relatorio-venda-por-vendedor-dataFinal">
            <b-form-input
              id="relatorio-venda-por-vendedor-dataFinal"
              type="date"
              v-model="relatorioVendaPorVendedor.dataFinal"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Vendedor:" label-for="relatorio-venda-por-vendedor">
            <model-select
              class="form-control"
              :options="vendedores"
              v-model="relatorioVendaPorVendedor.vendedor"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" @click="buscaValores">Listar</b-button>
          <b-button variant="danger" class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
      <hr />
      <div>
        <div class="cabecario">
          <span>Relatório de Vendas Por Vendedor - Período: {{this.dateToString(relatorioVendaPorVendedor.dataInicial)}} até {{this.dateToString(relatorioVendaPorVendedor.dataFinal)}}</span>
        </div>
        <hr />
        <div>
          <span>
            <b>Vendedor:</b>
            {{this.nome}}
            <br />
            <b>Total de Vendas:</b>
            {{this.numberToReal(this.total)}}
          </span>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

export default {
  name: "RelatorioVendasPorVendedor",
  components: {
    ModelSelect
  },
  data: function() {
    return {
      relatorioVendaPorVendedor: {},
      vendedores: [],
      usuarioStorage: {},
      nome: "",
      total: 0.0
    };
  },
  methods: {
    reset() {
      this.relatorioVendaPorVendedor = {};
      this.vendedores = [];
      this.nome = "";
      this.total = 0.0;
      this.loadVendedores();
    },
    buscaValores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/totalPorVendedor/${this.relatorioVendaPorVendedor.dataInicial}/${this.relatorioVendaPorVendedor.dataFinal}/${this.relatorioVendaPorVendedor.vendedor}/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then(res => {
          this.nome =
            res.data.totalPorVendedor[0].nome === null
              ? ""
              : res.data.totalPorVendedor[0].nome;
          this.total =
            res.data.totalPorVendedor[0].total === null
              ? 0.0
              : res.data.totalPorVendedor[0].total;
        })
        .catch(showError);
    },
    loadVendedores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosUsuarios/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.vendedores = res.data.data.map(vendedor => {
          return { value: vendedor.usu_id, text: vendedor.usu_nome };
        });
      });
    },
    dateToString(value) {
      if (value) {
        let dia = value.substr(8, 2);
        let mes = value.substr(5, 2);
        let ano = value.substr(0, 4);
        return dia + "/" + mes + "/" + ano;
      }
    },
    numberToReal(numero) {
      var num = numero.toFixed(2).split(".");
      num[0] = "R$ " + num[0].split(/(?=(?:...)*$)/).join(".");
      return num.join(",");
    }
  },
  mounted() {
    this.loadVendedores();
  }
};
</script>

<style>
.cabecario {
  text-align: center;
  font-family: Arial;
  font-size: 15px !important;
  font-weight: bold;
}
.span {
  font-family: Arial;
  font-size: 15px !important;
}
</style>