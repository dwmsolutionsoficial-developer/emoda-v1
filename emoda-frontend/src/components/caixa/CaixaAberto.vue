<template>
  <div class="caixa-aberto">
    <b-form>
      <input id="cai_id" type="hidden" v-model="caixa.id" />
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Crédito/Débito (C/D):"
            label-for="caixa-credito-debito"
          >
            <b-form-select
              id="caixa-credito-debito"
              :options="credito_debito"
              v-model="caixa.credito_debito"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Tipo:"
            label-for="caixa-tipo"
          >
            <b-form-select
              id="caixa-tipo"
              :options="caixa.credito_debito === 'C' ? c : d"
              v-model="caixa.tipo"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Tipo de Pagamento:"
            label-for="caixa-tipo"
          >
            <b-form-select
              id="caixa-tipo"
              :options="tipoPagamento"
              v-model="caixa.tipoPagamento"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data:" label-for="caixa-data">
            <b-form-input
              id="caixa-data"
              type="date"
              v-model="caixa.data"
              placeholder="Informe a data."
            />
          </b-form-group>
        </b-col>
        <b-col md="5" sm="12">
          <b-form-group label="Descrição" label-for="caixa-descricao">
            <b-form-input
              id="caixa-descricao"
              type="text"
              v-model="caixa.descricao"
              required
              placeholder="Informe a Descrição"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Valor:" label-for="caixa-valor">
            <money
              class="form-control"
              v-bind="money"
              v-model="caixa.valor"
            ></money>
          </b-form-group>
        </b-col>
      </b-row>
      <b-button variant="primary" v-if="mode === 'save'" @click="save"
        >Salvar</b-button
      >
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>
    <hr />
    <b-row>
      <b-col md="4" sm="12">
        <b-form-group label="Pesquisar">
          <b-form-input
            id="caixa-pesquisa-data"
            type="date"
            v-model="pesquisaData"
            placeholder="Informe a data."
          />
        </b-form-group>
      </b-col>
      <b-form-group label=".">
        <b-button variant="primary" class="ml-2" @click="buscaCaixaPorData"
          >Filtrar</b-button
        >
      </b-form-group>
    </b-row>
    <hr />
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
    <hr />
    <b-row>
      <div class="totalizacao">
        <div class="totalizacao-titulo">
          <h2>Crédito:</h2>
        </div>
        <div class="stat-info">
          <span class="totalizacao-value-credito">{{
            totalizacao.credito === undefined
              ? 0.0
              : totalizacao.credito.toFixed(2)
          }}</span>
        </div>
      </div>
      <div class="totalizacao">
        <div class="totalizacao-titulo">
          <h2>Débito:</h2>
        </div>
        <div class="totalizacao-info">
          <span class="totalizacao-value-debito">{{
            totalizacao.debito === undefined
              ? 0.0
              : totalizacao.debito.toFixed(2)
          }}</span>
        </div>
      </div>
      <div class="totalizacao">
        <div class="totalizacao-titulo">
          <h2>Total:</h2>
        </div>
        <div class="totalizacao-info">
          <span class="totalizacao-value-total">{{
            totalizacao.total === undefined ? 0.0 : totalizacao.total.toFixed(2)
          }}</span>
        </div>
      </div>
    </b-row>
    <hr />
    <b-pagination
      size="md"
      v-model="page"
      :total-rows="count"
      :per-page="limit"
    />
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import Vue from "vue";
import money from "v-money";

Vue.use(money, { precision: 4 });

export default {
  name: "CaixaAberto",
  data: function () {
    return {
      money: {
        decimal: ".",
        thousands: "",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */,
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
        {
          key: "tipo_pagamento",
          label: "Tipo de Pagamento",
          sortable: true,
        },
        { key: "cai_descricao", label: "Descrição", sortable: true },
        { key: "cai_valor", label: "Valor", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      credito_debito: [
        { value: "C", text: "Crédito" },
        { value: "D", text: "Débito" },
      ],
      c: [
        { value: "1.0", text: "Venda à Vista" },
        { value: "1.1", text: "Venda no Crediário" },
        { value: "1.2", text: "Recebimento" },
        { value: "1.3", text: "Suprimento" },
      ],
      d: [
        { value: "2.0", text: "Devolução de Venda à Vista" },
        { value: "2.1", text: "Devolução de Venda no Crediário" },
        { value: "2.2", text: "Pagamentos" },
        { value: "2.3", text: "Estorno de Recebimento" },
        { value: "2.4", text: "Compra à Vista" },
        { value: "2.5", text: "Compra no Crediário" },
        { value: "2.6", text: "Sangria" },
        { value: "2.7", text: "Alimentação" },
        { value: "2.8", text: "Produtos" },
        { value: "2.9", text: "Passagem/Frete" },
        { value: "3.0", text: "Funcionários" },
        { value: "3.1", text: "Comissão" },
        { value: "3.2", text: "Publicidade" },
        { value: "3.3", text: "E-Social" },
        { value: "3.4", text: "Contador" },
        { value: "3.5", text: "Aluguel" },
        { value: "3.6", text: "Água" },
        { value: "3.7", text: "Energia Elétrica" },
        { value: "3.8", text: "Internet" },
        { value: "3.9", text: "Impostos" },
        { value: "4.0", text: "Limpeza" },
        { value: "4.1", text: "Papelaria" },
        { value: "4.2", text: "Manutenção em Geral" },
      ],
      tipoPagamento: [
        { value: 1, text: "Dinheiro" },
        { value: 2, text: "Cartão" },
        { value: 3, text: "Cheque" },
        { value: 5, text: "Pix" },
      ],
      usuarioStorage: {},
      totalizacao: {},
      credito: 0,
      debito: 0,
      total: 0,
      pesquisaData: "",
    };
  },
  methods: {
    loadCaixas() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/caixasAbertos/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then((res) => {
        this.caixas = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    buscaCaixaPorData() {
      if (this.pesquisaData) {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const url = `${baseApiUrl}/buscaCaixaPorData/${this.pesquisaData}/${this.usuarioStorage.empresa}?page=${this.page}`;
        axios.get(url).then((res) => {
          this.caixas = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        });
      } else {
        this.loadCaixas();
      }
    },
    reset() {
      this.mode = "save";
      this.caixa = {};
      this.caixa.valor = 0.0;
      this.pesquisaData = "";
      this.loadCaixas();
      this.getTotalizacao();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const date = new Date();
      let hora = date.getHours() + ":" + date.getMinutes();
      this.caixa.hora = hora;
      this.caixa.status = 0;
      const empresa = this.caixa.empresa
        ? `/${this.caixa.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.caixa.id ? "put" : "post";
      const id = this.caixa.id ? `/${this.caixa.id}` : "";
      axios[method](`${baseApiUrl}/caixasAbertos${id}${empresa}`, this.caixa)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
          this.getTotalizacao();
        })
        .catch(showError);
    },
    remove(caixa) {
      const id = caixa.cai_id;
      axios
        .delete(
          `${baseApiUrl}/caixasAbertos/${id}/${this.usuarioStorage.empresa}`
        )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadCaixas();
          this.getTotalizacao();
          this.reset();
        })
        .catch(showError);
    },
    loadCaixa(caixa, mode = "save") {
      this.mode = mode;
      const dados = {
        id: caixa.cai_id,
        data: this.stringToDate(caixa.cai_data),
        credito_debito: caixa.cai_cred_deb,
        tipo: caixa.cai_codigo,
        tipoPagamento: caixa.cai_tipo_pagamento,
        descricao: caixa.cai_descricao,
        valor: caixa.cai_valor,
        empresa: caixa.emp_id,
      };
      this.caixa = { ...dados };
    },
    stringToDate(value) {
      if (value.length >= 9) {
        let parts = value.split("/");
        let date = parts[2] + "-" + parts[1] + "-" + parts[0];
        return date;
      }
    },
    getTotalizacao() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/caixasAbertosTotalizacao/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.totalizacao = res.data;
      });
    },
  },
  watch: {
    page() {
      this.loadCaixas();
      this.getTotalizacao();
    },
  },
  mounted() {
    this.loadCaixas();
    this.getTotalizacao();
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
