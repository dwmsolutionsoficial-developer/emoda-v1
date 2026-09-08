<template>
  <div class="devolucao-venda">
    <PageTitle icon="fa fa-close" main="Devolução de Venda" />
    <b-form>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Nº da Venda:" label-for="devolucao-venda-numero">
            <b-form-input
              id="devolucao-venda-numero"
              type="number"
              v-model="devolucaoVenda.numero"
            />
          </b-form-group>
        </b-col>
        <b-col md="5" sm="12">
          <b-form-group label="Cliente:" label-for="devolucao-venda-cliente">
            <model-select
              class="form-control"
              :options="clientes"
              v-model="devolucaoVenda.cliente"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button
            :disabled="buttonBuscar"
            variant="primary"
            @click="buscaVenda"
            >Buscar</b-button
          >
          <b-button
            :disabled="buttonDevolver"
            variant="success"
            class="ml-2"
            @click="vendaDevolucao"
            >Devolver</b-button
          >
          <b-button variant="danger" class="ml-2" @click="reset"
            >Limpar</b-button
          >
        </b-col>
      </b-row>
      <br />
      <hr />
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group label="Nº da Venda:">
            <b-form-input
              type="number"
              v-model="venda.con_documento"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Data:">
            <b-form-input type="text" v-model="venda.con_data" disabled />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Cliente:">
            <b-form-input type="text" v-model="venda.cli_nome" disabled />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Valor Total:">
            <b-form-input type="number" v-model="venda.con_total" disabled />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Pagamento:">
            <b-form-input type="text" v-model="venda.pagamento" disabled />
          </b-form-group>
        </b-col>
      </b-row>

      <b-table hover striped :items="venda_itens" :fields="fields">
        <template slot="actions"></template>
      </b-table>
      <b-pagination
        size="md"
        v-model="page"
        :total-rows="count"
        :per-page="limit"
      />
    </b-form>
    <div v-show="showLoad" class="load">
      <div class="spin"></div>
      <div class="loading">CARREGANDO...</div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

export default {
  name: "devolucaoVenda",
  components: { PageTitle, ModelSelect },
  data: function () {
    return {
      devolucaoVenda: {},
      venda: {},
      venda_itens: [],
      produtos: [],
      usuarioStorage: {},
      clientes: [],
      fields: [
        { key: "pro_nome", label: "Produto", sortable: true },
        { key: "conit_quantidade", label: "Quantidade", sortable: true },
        { key: "conit_total", label: "Valor Total", sortable: true },
      ],
      page: 1,
      limit: 0,
      count: 0,
      showLoad: false,
      buttonBuscar: false,
      buttonDevolver: false,
    };
  },
  methods: {
    loadClientes() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosClientes/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.clientes = res.data.data.map((cliente) => {
          return { value: cliente.cli_id, text: cliente.cli_nome };
        });
      });
    },
    reset() {
      this.devolucaoVenda = {};
      this.venda = {};
      this.venda_itens = [];
      this.produtos = [];
      this.loadClientes();
    },
    async buscaVenda() {
      this.showLoad = true;
      this.buttonBuscar = true;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/devolucaoVenda/${this.devolucaoVenda.numero}/${this.devolucaoVenda.cliente}/${this.usuarioStorage.empresa}?page=${this.page}`;
      await axios
        .get(url)
        .then((res) => {
          this.venda = res.data.venda[0];
          this.venda_itens = res.data.venda_itens;
          this.produtos = res.data.produtos;
          this.count = res.data.count;
          this.limit = res.data.limit;
        })
        .catch(showError)
        .finally(() => ((this.showLoad = false), (this.buttonBuscar = false)));
    },
    async vendaDevolucao() {
      this.showLoad = true;
      this.buttonDevolver = true;
      const date = new Date();
      let hora = date.getHours() + ":" + date.getMinutes();
      var dataFormatada =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.venda.dataDevolucao = dataFormatada;
      this.venda.horaDevolucao = hora;

      const venda = this.venda;
      const vendaItens = this.venda_itens;
      const produtos = this.produtos;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/devolucaoVenda/${this.devolucaoVenda.numero}/${this.devolucaoVenda.cliente}/${this.usuarioStorage.empresa}`;
      await axios
        .post(url, { venda, vendaItens, produtos })
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError)
        .finally(
          () => ((this.showLoad = false), (this.buttonDevolver = false))
        );
    },
  },
  watch: {
    page() {
      this.buscaVenda();
    },
  },
  mounted() {
    this.loadClientes();
  },
};
</script>

<style>
.load {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spin {
  background: #00000020;
  height: 150px;
  width: 150px;
  border-radius: 50vh;
  border: 5px solid #00000000;
  border-top: 5px solid #000;
  animation: loading 3s linear infinite;
}
.loading {
  position: absolute;
  color: #000;
}
@keyframes loading {
  100% {
    transform: rotate(360deg);
  }
}
</style>