<template>
  <div class="relatorio-recebimentos">
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data Inicial:" label-for="relatorio-recebimentos-dataInicial">
            <b-form-input
              id="relatorio-recebimentos-dataInicial"
              type="date"
              v-model="relatorioRecebimento.dataInicial"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Data Final:" label-for="relatorio-recebimentos-dataFinal">
            <b-form-input
              id="relatorio-recebimentos-dataFinal"
              type="date"
              v-model="relatorioRecebimento.dataFinal"
            />
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
          <span>Relatório de Recebimentos - Período: {{this.dateToString(relatorioRecebimento.dataInicial)}} até {{this.dateToString(relatorioRecebimento.dataFinal)}}</span>
        </div>
        <hr />
        <div>
          <span>
            <b>Total de Recebimentos:</b>
            {{this.numberToReal(totalRecebido)}}
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
  name: "RelatorioRecebimento",
  data: function() {
    return {
      relatorioRecebimento: {},
      recebimentos: [],
      usuarioStorage: {},
      totalRecebido: 0.0
    };
  },
  methods: {
    reset() {
      this.relatorioRecebimento = {};
      this.recebimentos = [];
      this.totalRecebido = 0.0;
    },
    buscaValores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/totalRecebimentos/${this.relatorioRecebimento.dataInicial}/${this.relatorioRecebimento.dataFinal}/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then(res => {
          this.totalRecebido =
            res.data.totalRecebimentos[0].total === null
              ? 0.0
              : res.data.totalRecebimentos[0].total;
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
    }
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