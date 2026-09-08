<template>
  <div class="caixa-fechamento">
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data:" label-for="caixa-fechamento-data">
            <b-form-input
              id="caixa-fechamento-data"
              type="date"
              v-model="caixa.data"
              placeholder="Informe a Data."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Conta:"
            label-for="caixa-fechamento-conta"
          >
            <b-form-select
              id="caixa-fechamento-conta"
              :options="bancos"
              v-model="caixa.contaFechamento"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-button pill variant="success" @click="preencheValores"
        >Calcular Valores</b-button
      >
      <hr />
      <b-row>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Início Caixa:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              valoresFechamento.inicio === undefined
                ? 0.0
                : valoresFechamento.inicio.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Dinheiro:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              valoresFechamento.dinheiro === undefined
                ? 0.0
                : valoresFechamento.dinheiro.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Cartão:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              valoresFechamento.cartao === undefined
                ? 0.0
                : valoresFechamento.cartao.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Cheque:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              valoresFechamento.cheque === undefined
                ? 0.0
                : valoresFechamento.cheque.toFixed(2)
            }}</span>
          </div>
        </div>
      </b-row>
      <b-row>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Pix:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              valoresFechamento.pix === undefined
                ? 0.0
                : valoresFechamento.pix.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Crédito:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              valoresFechamento.credito === undefined
                ? 0.0
                : valoresFechamento.credito.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Débito:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-debito">{{
              valoresFechamento.debito === undefined
                ? 0.0
                : valoresFechamento.debito.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Total:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-total">{{
              valoresFechamento.total === undefined
                ? 0.0
                : valoresFechamento.total.toFixed(2)
            }}</span>
          </div>
        </div>
      </b-row>
      <b-button variant="primary" v-if="mode === 'save'" @click="fechaCaixa"
        >Fechar Caixa</b-button
      >
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "CaixaFechamento",
  data: function () {
    return {
      mode: "save",
      caixa: {},
      caixas: [],
      bancos: [],
      usuarioStorage: {},
      totalizacao: {},
      valoresFechamento: {},
      credito: 0,
      debito: 0,
      total: 0,
    };
  },
  methods: {
    reset() {
      this.mode = "save";
      this.caixa = {};
      this.valoresFechamento.inicio = 0.0;
      this.valoresFechamento.credito = 0.0;
      this.valoresFechamento.debito = 0.0;
      this.valoresFechamento.dinheiro = 0.0;
      this.valoresFechamento.cartao = 0.0;
      this.valoresFechamento.cheque = 0.0;
      this.valoresFechamento.pix = 0.0;
      this.valoresFechamento.total = 0.0;
    },
    fechaCaixa() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const date = new Date();
      let horaFechamento = date.getHours() + ":" + date.getMinutes();

      var dataFormatada =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      let dataFechamento = dataFormatada;
      this.caixa.dataFechamento = dataFechamento;
      this.caixa.horaFechamento = horaFechamento;
      this.caixa.total =
        this.valoresFechamento.total === undefined
          ? 0.0
          : this.valoresFechamento.total;

      const empresa = this.caixa.empresa
        ? `/${this.caixa.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = "put";
      axios[method](`${baseApiUrl}/fechaCaixa${empresa}`, this.caixa)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);

      const id = this.caixa.contaFechamento
        ? `/${this.caixa.contaFechamento}`
        : "";
      axios[method](
        `${baseApiUrl}/atualizaSaldoBanco${id}${empresa}`,
        this.valoresFechamento
      ).then(() => {
        this.reset();
      });
    },
    formataData(value) {
      if (value) {
        let dia = value.substr(8, 2);
        let mes = value.substr(5, 2);
        let ano = value.substr(0, 4);
        return dia + "/" + mes + "/" + ano;
      }
    },
    preencheValores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/preencheValoresFechamento/${this.usuarioStorage.empresa}/${this.caixa.data}`;
      axios
        .get(url)
        .then((res) => {
          this.valoresFechamento = res.data;
        })
        .catch(showError);
    },
    loadBancos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/bancos/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.bancos = res.data.map((banco) => {
          return { value: banco.ban_id, text: banco.ban_nome };
        });
      });
    },
  },
  mounted() {
    this.loadBancos();
  },
};
</script>

<style>
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
.totalizacao-value-credito {
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

.totalizacao-titulo h2 {
  font-size: 2rem;
}
</style>
