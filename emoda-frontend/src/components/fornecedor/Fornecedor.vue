<template>
  <div class="fornecedor">
    <b-form>
      <input id="for_id" type="hidden" v-model="fornecedor.id" />
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Nome:" label-for="fornecedor-nome">
            <b-form-input
              id="fornecedor-nome"
              type="text"
              v-model="fornecedor.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome do Fornecedor..."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Tipo Pessoa:"
            label-for="fornecedor-tipoPessoa"
          >
            <b-form-select
              id="fornecedor-tipoPessoa"
              :options="tipo"
              v-model="fornecedor.tipoPessoa"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="CPF:" label-for="fornecedor-cpf">
            <b-form-input
              id="fornecedor-cpf"
              type="text"
              v-mask="'###.###.###-##'"
              v-model="fornecedor.cpf"
              placeholder="Informe o CPF."
              :disabled="fornecedor.tipoPessoa === 'J'"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="RG:" label-for="fornecedor-rg">
            <b-form-input
              id="fornecedor-rg"
              type="text"
              v-model="fornecedor.rg"
              placeholder="Informe o RG."
              :disabled="fornecedor.tipoPessoa === 'J'"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="CNPJ:" label-for="fornecedor-cnpj">
            <b-form-input
              id="fornecedor-cnpj"
              type="text"
              v-mask="'##.###.###/####-##'"
              v-model="fornecedor.cnpj"
              placeholder="Informe o CNPJ."
              :disabled="fornecedor.tipoPessoa === 'F'"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Inscrição:" label-for="fornecedor-ie">
            <b-form-input
              id="fornecedor-ie"
              type="text"
              v-model="fornecedor.ie"
              placeholder="Informe a inscrição estadual."
              :disabled="fornecedor.tipoPessoa === 'F'"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Endereço:" label-for="fornecedor-endereco">
            <b-form-input
              id="fornecedor-endereco"
              type="text"
              v-model="fornecedor.endereco"
              placeholder="Informe o endereço."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Número:" label-for="fornecedor-numero">
            <b-form-input
              id="fornecedor-numero"
              type="number"
              v-model="fornecedor.numero"
              placeholder="Informe o número."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Bairro:" label-for="fornecedor-bairro">
            <b-form-input
              id="fornecedor-bairro"
              type="text"
              v-model="fornecedor.bairro"
              placeholder="Informe o bairro."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Complemento:" label-for="fornecedor-complemento">
            <b-form-input
              id="fornecedor-complemento"
              type="text"
              v-model="fornecedor.complemento"
              placeholder="Informe o complemento."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Cep:" label-for="fornecedor-cep">
            <b-form-input
              id="fornecedor-cep"
              type="text"
              v-mask="'#####-###'"
              v-model="fornecedor.cep"
              placeholder="Informe o cep."
            />
          </b-form-group>
        </b-col>
        <b-col md="7" sm="12">
          <b-form-group label="Cidade:" label-for="fornecedor-cidade">
            <b-form-input
              id="fornecedor-cidade"
              type="text"
              v-model="fornecedor.cidade"
              placeholder="Informe a cidade."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="UF:" label-for="fornecedor-uf">
            <b-form-input
              id="fornecedor-uf"
              type="text"
              v-model="fornecedor.uf"
              placeholder="Informe a UF."
              maxlength="2"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group label="Telefone:" label-for="fornecedor-telefone">
            <b-form-input
              id="fornecedor-telefone"
              type="text"
              v-mask="'(##) ####-####'"
              v-model="fornecedor.telefone"
              placeholder="Informe o telefone."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Celular:" label-for="fornecedor-celular">
            <b-form-input
              id="fornecedor-celular"
              type="text"
              v-mask="'(##) # ####-####'"
              v-model="fornecedor.celular"
              placeholder="Informe o celular."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Whatsapp:" label-for="fornecedor-whatsapp">
            <b-form-input
              id="fornecedor-whatsapp"
              type="text"
              v-mask="'(##) # ####-####'"
              v-model="fornecedor.whatsapp"
              placeholder="Informe o whatsapp."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="E-mail:" label-for="fornecedor-email">
            <b-form-input
              id="fornecedor-email"
              type="email"
              v-model="fornecedor.email"
              placeholder="Informe o e-mail."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data de Cadastro:" label-for="fornecedor-cadastro">
            <b-form-input id="fornecedor-cadastro" type="text" v-model="for_cadastro" disabled />
          </b-form-group>
        </b-col>
        <b-col md="8" sm="12">
          <b-form-group label=" " label-for="fornecedor-bloqueado">
            <b-form-checkbox id="fornecedor-bloqueado" v-model="bloqueado">Bloqueado?</b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>
    <hr />
    <b-table hover striped :items="fornecedores" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadFornecedor(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey, stringToDate } from "@/global";
import axios from "axios";
import Vue from "vue";
import VueTheMask from "vue-the-mask";

Vue.use(VueTheMask);

export default {
  name: "Fornecedor",
  data: function() {
    return {
      money: {
        decimal: ".",
        precision: 2,
        masked: false
      },
      mode: "save",
      fornecedor: {},
      fornecedores: [],
      for_cadastro: "",
      tipo: [{ value: "F", text: "Física" }, { value: "J", text: "Jurídica" }],
      usuarioStorage: {},
      bloqueado: false,
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "for_nome", label: "Nome", sortable: true },
        { key: "for_telefone", label: "Telefone", sortable: true },
        { key: "for_celular", label: "Celular", sortable: true },
        { key: "for_whatsapp", label: "Whatsapp", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadFornecedores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/fornecedores/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then(res => {
        this.fornecedores = res.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    reset() {
      this.mode = "save";
      this.fornecedor = {};
      this.loadFornecedores();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      this.fornecedor.cadastro = stringToDate(this.for_cadastro);
      this.fornecedor.bloqueado = this.bloqueado === false ? 0 : 1;
      const empresa = this.fornecedor.empresa
        ? `/${this.fornecedor.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.fornecedor.id ? "put" : "post";
      const id = this.fornecedor.id ? `/${this.fornecedor.id}` : "";
      axios[method](
        `${baseApiUrl}/fornecedores${id}${empresa}`,
        this.fornecedor
      )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(fornecedor) {
      const id = fornecedor.for_id;
      axios
        .delete(
          `${baseApiUrl}/fornecedores/${id}/${this.usuarioStorage.empresa}`
        )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadFornecedor(fornecedor, mode = "save") {
      this.mode = mode;
      const dados = {
        id: fornecedor.for_id,
        nome: fornecedor.for_nome,
        tipoPessoa: fornecedor.for_fisica_juridica,
        cpf: fornecedor.for_cpf,
        rg: fornecedor.for_rg,
        cnpj: fornecedor.for_cnpj,
        ie: fornecedor.for_ie,
        endereco: fornecedor.for_endereco,
        numero: fornecedor.for_numero,
        bairro: fornecedor.for_bairro,
        complemento: fornecedor.for_complemento,
        cep: fornecedor.for_cep,
        cidade: fornecedor.for_cidade,
        uf: fornecedor.for_uf,
        telefone: fornecedor.for_telefone,
        celular: fornecedor.for_celular,
        whatsapp: fornecedor.for_whatsapp,
        bloqueado: fornecedor.for_bloqueado,
        cadastro: fornecedor.for_cadastro,
        email: fornecedor.for_email,
        empresa: fornecedor.emp_id
      };
      this.fornecedor = { ...dados };
    },
    geraData: function() {
      var dataAtual = new Date();
      var dataFormatada =
        dataAtual.getDate() +
        "/" +
        (dataAtual.getMonth() + 1) +
        "/" +
        dataAtual.getFullYear();
      this.for_cadastro = dataFormatada;
    }
  },
  watch: {
    page() {
      this.loadFornecedores();
    }
  },
  mounted() {
    this.geraData();
    this.loadFornecedores();
  }
};
</script>

<style>
</style>