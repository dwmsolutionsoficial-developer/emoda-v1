<template>
  <div class="relatorio-vendas">
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group
            label="Data Inicial:"
            label-for="relatorio-venda-dataInicial"
          >
            <b-form-input
              id="relatorio-venda-dataInicial"
              type="date"
              v-model="relatorioVenda.dataInicial"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            label="Data Final:"
            label-for="relatorio-venda-dataFinal"
          >
            <b-form-input
              id="relatorio-venda-dataFinal"
              type="date"
              v-model="relatorioVenda.dataFinal"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" @click="buscaValores">Listar</b-button>
          <b-button variant="danger" class="ml-2" @click="reset"
            >Cancelar</b-button
          >
        </b-col>
      </b-row>
      <hr />
      <div>
        <div class="cabecario">
          <span
            >Relatório de Vendas - Período:
            {{ this.dateToString(relatorioVenda.dataInicial) }} até
            {{ this.dateToString(relatorioVenda.dataFinal) }}</span
          >
        </div>
        <hr />
        <div>
          <span>
            <b>Total de Vendas à Vista:</b>
            {{ this.numberToReal(aVista) }}
          </span>
          <br />
          <span>
            <b>Total de Vendas no Crediário:</b>
            {{ this.numberToReal(aPrazo) }}
          </span>
          <br />
          <span>
            <b>Total Geral:</b>
            {{ this.numberToReal(totalGeral) }}
          </span>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "RelatorioVenda",
  data: function () {
    return {
      relatorioVenda: {},
      vendas: [],
      usuarioStorage: {},
      aVista: 0.0,
      aPrazo: 0.0,
      totalGeral: 0.0,
    };
  },
  methods: {
    reset() {
      this.relatorioVenda = {};
      this.vendas = [];
      this.aVista = 0.0;
      this.aPrazo = 0.0;
      this.totalGeral = 0.0;
    },
    buscaValores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/totalVendas/${this.relatorioVenda.dataInicial}/${this.relatorioVenda.dataFinal}/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then((res) => {
          this.aVista =
            res.data.v1[0].aVista === null ? 0.0 : res.data.v1[0].aVista;
          this.aPrazo =
            res.data.v2[0].aPrazo === null ? 0.0 : res.data.v2[0].aPrazo;
          this.totalGeral = this.aVista + this.aPrazo;
        })
        .catch(showError);
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
    },
  },
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
