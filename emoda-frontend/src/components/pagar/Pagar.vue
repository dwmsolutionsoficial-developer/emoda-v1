<template>
  <div class="receber">
    <b-form>
      <input id="cr_id" type="hidden" v-model="receber.id" />
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Nº Documento" label-for="receber-documento">
            <b-form-input
              id="receber-documento"
              type="text"
              v-model="receber.documento"
              required
              placeholder="Informe o Nº de documento"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Data de Emissão:" label-for="receber-emissao">
            <b-form-input
              id="receber-emissao"
              type="date"
              v-model="receber.emissao"
              placeholder="Informe a data."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Cliente:" label-for="receber-cliente">
            <model-select
              class="form-control"
              :options="clientes"
              v-model="receber.cliente"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Valor:" label-for="receber-valor">
            <money
              class="form-control"
              v-bind="money"
              v-model="receber.valor"
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
      <b-col md="6" sm="12">
        <b-form-group label="Pesquisar" label-for="receber-pesquisa">
          <b-form-input
            id="receber-pesquisa"
            type="text"
            v-model="busca"
            placeholder="Digite o nome"
          />
        </b-form-group>
      </b-col>
      <b-col md="6" sm="12">
        <b-form-group
          label="Data de Vencimento:"
          label-for="receber-pesquisa-data"
        >
          <b-form-input
            id="receber-pesquisa-data"
            type="date"
            v-model="buscaDataVencimento"
            placeholder="Informe a data."
          />
        </b-form-group>
      </b-col>
    </b-row>

    <b-table hover striped :items="filteredItems" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button
          variant="success"
          class="mr-2"
          @click="loadProdutos(data.item)"
        >
          <i class="fa fa-product-hunt"></i>
        </b-button>
        <b-button
          variant="warning"
          @click="loadDocumento(data.item)"
          class="mr-2"
        >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination
      size="md"
      v-model="page"
      :total-rows="count"
      :per-page="limit"
    />

    <b-modal ref="produtos" title="Itens do Documento" hide-footer size="lg">
      <div class="d-block text-center">
        <b-table
          hover
          striped
          :items="itensDocumento"
          :fields="fieldsItens"
        ></b-table>
      </div>
    </b-modal>

    <b-modal ref="avisoExclusao" title="Atenção" ok-only>
      <div align="center">
        <p>Este documento não pode ser excluido!</p>
        <p>Realize o cancelamento da venda.</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import Vue from "vue";
import money from "v-money";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

Vue.use(money, { precision: 4 });

export default {
  name: "Receber",
  components: {
    ModelSelect,
  },
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
      receber: {},
      receberes: [],
      clientes: [],
      page: 1,
      limit: 0,
      count: 0,
      busca: "",
      buscaDataVencimento: "",
      diaPagamentoCliente: 0,
      fields: [
        { key: "cr_documento", label: "Documento", sortable: true },
        { key: "cli_nome", label: "Cliente", sortable: true },
        { key: "cr_emissao", label: "Emissão", sortable: true },
        { key: "cr_vencimento", label: "Vencimento", sortable: true },
        { key: "cr_valor", label: "Valor", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      usuarioStorage: {},
      pesquisa: "",
      itensDocumento: [],
      fieldsItens: [
        { key: "nome", label: "Produto", sortable: true },
        { key: "quantidade", label: "Qtde.", sortable: true },
        { key: "total", label: "Total", sortable: true },
      ],
    };
  },
  methods: {
    loadReceber() {
      const nome = this.busca === "" ? null : this.busca;
      const data =
        this.buscaDataVencimento === "" ? null : this.buscaDataVencimento;

      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/receber/${nome}/${data}/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios
        .get(url)
        .then((res) => {
          this.receberes = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        })
        .catch(showError);
    },
    reset() {
      this.mode = "save";
      this.receber = {};
      this.clientes = [];
      this.receber.valor = 0.0;
      this.diaPagamentoCliente = 0;
      this.loadClientes();
      this.loadReceber();
    },
    async save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      this.receber.vencimento = this.receber.emissao;
      this.receber.usuario = this.usuarioStorage.id;
      const empresa = this.receber.empresa
        ? `/${this.receber.empresa}`
        : `/${this.usuarioStorage.empresa}`;

      const url = `${baseApiUrl}/buscaDiaPagamentoCliente/${this.receber.cliente}${empresa}`;
      await axios.get(url).then((res) => {
        this.receber.diaPagamentoCliente = res.data.data[0].cli_dia_pagamento;
      });

      const method = this.receber.id ? "put" : "post";
      const id = this.receber.id ? `/${this.receber.id}` : "";
      axios[method](`${baseApiUrl}/receber${id}${empresa}`, this.receber)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(receber) {
      if (receber.cr_documento === null) {
        const id = receber.cr_id;
        axios
          .delete(`${baseApiUrl}/receber/${id}/${this.usuarioStorage.empresa}`)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.loadReceber();
            this.reset();
          })
          .catch(showError);
      } else {
        this.showModalExclusao();
      }
    },
    loadDocumento(receber, mode = "save") {
      this.mode = mode;
      const dados = {
        id: receber.cr_id,
        documento: receber.cr_documento,
        cliente: receber.cli_id,
        emissao: this.stringToDate(receber.cr_emissao.substring(0, 10)),
        valor: receber.cr_valor,
        empresa: receber.emp_id,
      };
      this.receber = { ...dados };
    },
    loadClientes() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosClientes/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.clientes = res.data.data.map((cliente) => {
          return { value: cliente.cli_id, text: cliente.cli_nome };
        });
      });
    },
    loadProdutos(documento) {
      const idCliente = documento.cli_id;
      const idDocumento = documento.cr_documento;
      const idVenda = documento.con_id;

      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/itensDocumento/${idDocumento}/${idCliente}/${idVenda}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.itensDocumento = res.data;
      });

      this.$refs["produtos"].show();
    },
    dateToString(value) {
      if (value) {
        let dia = value.substr(8, 2);
        let mes = value.substr(5, 2);
        let ano = value.substr(0, 4);
        return ano + "-" + mes + "-" + dia;
      }
    },
    stringToDate(value) {
      if (value.length >= 9) {
        let parts = value.split("/");
        let date = parts[2] + "-" + parts[1] + "-" + parts[0];
        return date;
      } else {
        let parts = value.split("/");
        let date = parts[2] + "-" + parts[1] + "-" + parts[0];
        return date;
      }
    },
    showModalExclusao() {
      this.$refs["avisoExclusao"].show();
    },
  },
  watch: {
    page() {
      this.loadReceber();
    },
    busca: function () {
      this.loadReceber();
    },
    buscaDataVencimento: function () {
      this.loadReceber();
    },
  },
  mounted() {
    this.loadClientes();
    this.loadReceber();
  },
  computed: {
    filteredItems() {
      return !this.pesquisa.length
        ? this.receberes
        : this.receberes.filter((item) =>
            item.cli_nome.includes(this.pesquisa)
          );
    },
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