<template>
  <div class="relatorio-lucro">
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group
            label="Data Inicial:"
            label-for="relatorio-lucro-dataInicial"
          >
            <b-form-input
              id="relatorio-lucro-dataInicial"
              type="date"
              v-model="relatorioLucro.dataInicial"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            label="Data Final:"
            label-for="relatorio-lucro-dataFinal"
          >
            <b-form-input
              id="relatorio-lucro-dataFinal"
              type="date"
              v-model="relatorioLucro.dataFinal"
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
            >Relatório de Lucro - Período:
            {{ this.dateToString(relatorioLucro.dataInicial) }} até
            {{ this.dateToString(relatorioLucro.dataFinal) }}</span
          >
        </div>
        <hr />
        <div>
          <b-row>
            <b-col xs="4">
              <span>
                <b>Início do Caixa:</b>
                {{ this.numberToReal(totalAbertura) }}
              </span>
              <br />
              <br />
              <span>
                <b>Total de Dinheiro:</b>
                {{ this.numberToReal(totalDinheiro) }}
              </span>
              <br />
              <br />
              <span>
                <b>Total de Cartão:</b>
                {{ this.numberToReal(totalCartao) }}
              </span>
              <br />
              <br />
              <span>
                <b>Total de Cheque:</b>
                {{ this.numberToReal(totalCheque) }}
              </span>
              <br />
              <br />
              <span>
                <b>Total de Pix:</b>
                {{ this.numberToReal(totalPix) }}
              </span>
              <br />
              <hr />
              <span>
                <h4>
                  <b>Total de Créditos:</b>
                  {{ this.numberToReal(totalCredito) }}
                </h4>
              </span>
            </b-col>
            <b-col xs="4">
              <span>
                <b>Alimentação:</b>
                {{ this.numberToReal(totalAlimentacao) }}
              </span>
              <br />
              <br />
              <span>
                <b>Pagamentos:</b>
                {{ this.numberToReal(totalPagamentos) }}
              </span>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <hr />
              <span>
                <h4>
                  <b>Total de Débitos:</b>
                  {{ this.numberToReal(totalDebito) }}
                </h4>
              </span>
            </b-col>
            <b-col xs="4">
              <br /><br /><br /><br />
              <div>
                <div>
                  <h3>
                    <b>Lucro Total:</b>
                    {{
                      totalLucro === undefined
                        ? 0.0
                        : this.numberToReal(totalLucro)
                    }}
                  </h3>
                </div>
              </div>
            </b-col>
          </b-row>
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
  data: function () {
    return {
      relatorioLucro: {},
      dados: [],
      usuarioStorage: {},
      totalCredito: 0.0,
      totalDebito: 0.0,
      totalLucro: 0.0,
      totalDinheiro: 0.0,
      totalCartao: 0.0,
      totalCheque: 0.0,
      totalPix: 0.0,
      totalAbertura: 0.0,
      totalAlimentacao: 0.0,
      totalPagamentos: 0.0,
    };
  },
  methods: {
    reset() {
      this.relatorioLucro = {};
      this.dados = [];
      this.totalCredito = 0.0;
      this.totalDebito = 0.0;
      this.totalLucro = 0.0;
      this.totalDinheiro = 0.0;
      this.totalCartao = 0.0;
      this.totalCheque = 0.0;
      this.totalPix = 0.0;
      this.totalAbertura = 0.0;
      this.totalAlimentacao = 0.0;
      this.totalPagamentos = 0.0;
    },
    buscaValores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/totalLucro/${this.relatorioLucro.dataInicial}/${this.relatorioLucro.dataFinal}/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then((res) => {
          this.totalCredito = res.data.Credito;
          this.totalDebito = res.data.Debito;
          this.totalLucro = res.data.Lucro;
          this.totalDinheiro = res.data.Dinheiro;
          this.totalCartao = res.data.Cartao;
          this.totalCheque = res.data.Cheque;
          this.totalPix = res.data.Pix;

          this.totalAbertura = res.data.Abertura;
          this.totalAlimentacao = res.data.Alimentacao;
          this.totalPagamentos = res.data.Pagamentos;
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
.totalizacao {
  flex: 1;
  display: flex;
  border-radius: 8px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}
.totalizacao-value-quantidade {
  font-size: 3rem;
  color: blue;
}
.totalizacao-value-debito {
  font-size: 3rem;
  color: crimson;
}
.totalizacao-value-total {
  font-size: 3rem;
  color: green;
}
.totalizacao-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.totalizacao-titulo {
  display: flex;
  align-items: center;
}

.totalizacao-titulo h3 {
  font-size: 2rem;
}
</style>
