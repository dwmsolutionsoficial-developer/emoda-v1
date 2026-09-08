<template>
  <div class="produto">
    <b-form>
      <input id="pro_id" type="hidden" v-model="produto.id" />
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Nome:" label-for="produto-nome">
            <b-form-input
              id="produto-nome"
              type="text"
              v-model="produto.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Código de Barras:"
            label-for="produto-codigo-barras"
          >
            <b-form-input
              id="produto-codigo-barras"
              type="text"
              v-model="produto.codigoBarras"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Código de Barras."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Unidade:"
            label-for="produto-unidade"
          >
            <b-form-select
              id="produto-unidade"
              :options="unidades"
              v-model="produto.unidade"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Marca:"
            label-for="produto-marca"
          >
            <b-form-select
              id="produto-marca"
              :options="marcas"
              v-model="produto.marca"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Grupo:"
            label-for="produto-grupo"
          >
            <b-form-select
              id="produto-grupo"
              :options="grupos"
              v-model="produto.grupo"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Cor:"
            label-for="produto-cor"
          >
            <b-form-select
              id="produto-cor"
              :options="cores"
              v-model="produto.cor"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Tamanho:"
            label-for="produto-tamanho"
          >
            <b-form-select
              id="produto-tamanho"
              :options="tamanhos"
              v-model="produto.tamanho"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Preço de Custo:" label-for="produto-precoCusto">
            <money
              v-if="this.usuarioStorage.oculta_pco_custo === 1"
              class="form-control"
              v-bind="money"
              v-model="custo"
              disabled
            ></money>
            <money
              v-else
              class="form-control"
              v-bind="money"
              v-model="produto.precoCusto"
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            label="Margem de Lucro (%):"
            label-for="produto-margemLucro"
          >
            <money
              class="form-control"
              v-bind="money"
              v-model="calculaLucro"
              disabled
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Preço de Venda:" label-for="produto-precoVenda">
            <money
              class="form-control"
              v-bind="money"
              v-model="produto.precoVenda"
            ></money>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Estoque:" label-for="produto-estoque">
            <money
              class="form-control"
              v-bind="money"
              v-model="produto.estoque"
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            label="Estoque Mínimo:"
            label-for="produto-estoqueMinimo"
          >
            <money
              class="form-control"
              v-bind="money"
              v-model="produto.estoqueMinimo"
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Referência:" label-for="produto-referencia">
            <b-form-input
              id="produto-referencia"
              type="text"
              v-model="produto.referencia"
              placeholder="Informe a referência."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data de Cadastro:" label-for="produto-cadastro">
            <b-form-input
              id="produto-cadastro"
              type="text"
              v-model="pro_cadastro"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="8" sm="12">
          <b-form-group label=" " label-for="produto-bloqueado">
            <b-form-checkbox id="produto-bloqueado" v-model="produto.bloqueado"
              >Inativo</b-form-checkbox
            >
          </b-form-group>
        </b-col>
      </b-row>
      <b-button variant="primary" v-if="mode === 'save'" @click="save"
        >Salvar</b-button
      >
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>
    <hr />
    <b-form-group label="Pesquisar" label-for="produto-pesquisa">
      <b-form-input
        id="produto-pesquisa"
        type="text"
        v-model="busca"
        placeholder="Digite o nome do produto"
      />
    </b-form-group>
    <b-table hover striped :items="produtos" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button
          variant="warning"
          @click="loadProduto(data.item)"
          class="mr-2"
        >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)" class="mr-2">
          <i class="fa fa-trash"></i>
        </b-button>
        <b-button variant="success" @click="addEstoque(data.item)">
          <i class="fa fa-plus"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination
      size="md"
      v-model="page"
      :total-rows="count"
      :per-page="limit"
    />

    <b-modal ref="my-modal" hide-footer title="Inserir Estoque">
      <div class="d-block text-center">
        <b-form-group label="Qtde. de Estoque:" label-for="produto-estoque">
          <money class="form-control" v-bind="money" v-model="estoque"></money>
        </b-form-group>
      </div>
      <b-button variant="danger" @click="hideModal">Cancelar</b-button>
      <b-button class="ml-2" variant="primary" @click="inserirEstoque()"
        >Salvar</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey, stringToDate } from "@/global";
import axios from "axios";
import Vue from "vue";
import VueTheMask from "vue-the-mask";
import money from "v-money";

Vue.use(money, { precision: 4 });
Vue.use(VueTheMask);

export default {
  name: "Produto",
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
      produto: {},
      produtos: [],
      unidades: [],
      marcas: [],
      grupos: [],
      cores: [],
      tamanhos: [],
      pro_cadastro: "",
      usuarioStorage: {},
      bloqueado: false,
      page: 1,
      limit: 0,
      count: 0,
      custo: 0.0,
      estoque: 0.0,
      estoque_atual: 0.0,
      id_produto: 0,
      busca: "",
      fields: [
        { key: "pro_nome", label: "Nome", sortable: true },
        { key: "pro_estoque", label: "Estoque", sortable: true },
        { key: "pro_venda", label: "Pço. Venda", sortable: true },
        { key: "pro_referencia", label: "Referência", sortable: true },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  methods: {
    loadProdutos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/produtos/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then((res) => {
        this.produtos = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    reset() {
      this.mode = "save";
      this.produto = {};
      this.produto.precoCusto = 0.0;
      this.produto.margemLucro = 0.0;
      this.produto.precoVenda = 0.0;
      this.produto.estoque = 0.0;
      this.produto.estoqueMinimo = 0.0;
      this.id_produto = 0;
      this.estoque_atual = 0;
      this.estoque = 0;
      this.loadProdutos();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      this.produto.cadastro = stringToDate(this.pro_cadastro);
      // this.produto.bloqueado = this.bloqueado === false ? 0 : 1;
      this.produto.margemLucro =
        ((this.produto.precoVenda - this.produto.precoCusto) /
          this.produto.precoCusto) *
        100;
      const empresa = this.produto.empresa
        ? `/${this.produto.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.produto.id ? "put" : "post";
      const id = this.produto.id ? `/${this.produto.id}` : "";
      axios[method](`${baseApiUrl}/produtos${id}${empresa}`, this.produto)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(produto) {
      const id = produto.pro_id;
      axios
        .delete(`${baseApiUrl}/produtos/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadProduto(produto, mode = "save") {
      this.mode = mode;
      const dados = {
        id: produto.pro_id,
        nome: produto.pro_nome,
        codigoBarras: produto.pro_cod_barra,
        unidade: produto.uni_id,
        marca: produto.mar_id,
        grupo: produto.gru_id,
        cor: produto.cor_id,
        tamanho: produto.tam_id,
        precoCusto: produto.pro_custo,
        margemLucro: produto.pro_lucro,
        precoVenda: produto.pro_venda,
        estoque: produto.pro_estoque,
        estoqueMinimo: produto.pro_estoque_minimo,
        referencia: produto.pro_referencia,
        bloqueado: produto.pro_bloqueado === 1 ? true : false,
        cadastro: produto.pro_cadastro,
        empresa: produto.emp_id,
      };
      this.bloqueado = produto.pro_bloqueado;
      this.produto = { ...dados };
    },
    geraData: function () {
      var dataAtual = new Date();
      var dataFormatada =
        dataAtual.getDate() +
        "/" +
        (dataAtual.getMonth() + 1) +
        "/" +
        dataAtual.getFullYear();
      this.pro_cadastro = dataFormatada;
    },
    loadUnidades() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/unidades/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.unidades = res.data.map((unidade) => {
          return { value: unidade.uni_id, text: unidade.uni_sigla };
        });
      });
    },
    loadMarcas() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/marcas/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.marcas = res.data.map((marca) => {
          return { value: marca.mar_id, text: marca.mar_nome };
        });
      });
    },
    loadGrupos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/grupos/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.grupos = res.data.map((grupo) => {
          return { value: grupo.gru_id, text: grupo.gru_nome };
        });
      });
    },
    loadCores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/cores/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.cores = res.data.map((cor) => {
          return { value: cor.cor_id, text: cor.cor_descricao };
        });
      });
    },
    loadTamanhos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/tamanhos/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.tamanhos = res.data.map((tamanho) => {
          return { value: tamanho.tam_id, text: tamanho.tam_sigla };
        });
      });
    },
    addEstoque(item) {
      this.id_produto = item.pro_id;
      this.estoque_atual = item.pro_estoque;
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    inserirEstoque() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = `/${this.usuarioStorage.empresa}`;
      const method = "put";

      axios[method](`${baseApiUrl}/addEstoque/${this.id_produto}${empresa}`, {
        estoque: this.estoque + this.estoque_atual,
      })
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
          this.hideModal();
        })
        .catch(showError);
    },
  },
  watch: {
    page() {
      this.loadProdutos();
    },
    busca: function (val) {
      if (val === "") {
        this.loadClientes();
      } else {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const method = "get";
        axios[method](
          `${baseApiUrl}/buscaProdutos/${val}/${this.usuarioStorage.empresa}?page=${this.page}`
        ).then((res) => {
          this.produtos = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        });
      }
    },
  },
  mounted() {
    this.loadUnidades();
    this.loadMarcas();
    this.loadGrupos();
    this.loadCores();
    this.loadTamanhos();
    this.loadProdutos();
    this.geraData();
  },
  computed: {
    calculaLucro() {
      return (
        ((this.produto.precoVenda - this.produto.precoCusto) /
          this.produto.precoCusto) *
        100
      );
    },
  },
};
</script>

<style></style>
