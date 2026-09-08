<template>
  <div class="compra">
    <PageTitle icon="fa fa-cubes" main="Entrada de Mercadorias" />
    <b-form>
      <b-row>
        <b-col md="5" sm="12">
          <b-form-group label="Fornecedor:" label-for="compra-fornecedor">
            <model-select
              class="form-control"
              :options="fornecedores"
              v-model="compra.fornecedor"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Emissão:" label-for="compra-emissao">
            <b-form-input
              id="compra-emissao"
              type="date"
              v-model="compra.emissao"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Entrada:" label-for="compra-entrada">
            <b-form-input
              id="compra-entrada"
              type="date"
              v-model="compra.entrada"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Nº da Nota:" label-for="compra-numero">
            <b-form-input
              id="compra-numero"
              type="number"
              v-model="compra.numero"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="5" sm="12">
          <b-form-group label="Pagamento:" label-for="compra-pagamento">
            <b-form-select
              id="compra-pagamento"
              :options="pagamento"
              v-model="compra.pagamento"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Nº de Parcelas:" label-for="compra-parcela">
            <b-form-input
              id="compra-parcela"
              type="number"
              v-model="compra.parcela"
            />
          </b-form-group>
        </b-col>
        <b-col md="5" sm="12">
          <b-form-group label="Valor Total (R$):" label-for="compra-total">
            <money
              class="form-control"
              v-bind="money"
              v-model="compra.total"
            ></money>
          </b-form-group>
        </b-col>
      </b-row>
      <hr />
    </b-form>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, userKey } from "@/global";
import axios from "axios";
import Vue from "vue";
import money from "v-money";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";
//import Bus from "../../config/bus";

Vue.use(money, { precision: 4 });

export default {
  name: "realizarCompra",
  components: { PageTitle, ModelSelect },
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
      compra: {},
      fornecedores: [],
      pagamento: [
        { value: 1, text: "A Vista" },
        { value: 2, text: "Crediário" },
      ],
    };
  },
  methods: {
    loadFornecedores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosFornecedores/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.fornecedores = res.data.data.map((fornecedor) => {
          return { value: fornecedor.for_id, text: fornecedor.for_nome };
        });
      });
    },
  },
  mounted() {
    this.loadFornecedores();
  },
};
</script>

<style>
</style>