<template>
  <div class="cliente">
    <b-form>
      <input id="cli_id" type="hidden" v-model="cliente.id" />
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Nome:" label-for="cliente-nome">
            <b-form-input
              id="cliente-nome"
              type="text"
              v-model="cliente.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome do Cliente..."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Tipo Pessoa:"
            label-for="cliente-tipoPessoa"
          >
            <b-form-select
              id="cliente-tipoPessoa"
              :options="tipo"
              v-model="cliente.tipoPessoa"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="CPF:" label-for="cliente-cpf">
            <b-form-input
              id="cliente-cpf"
              type="text"
              v-mask="'###.###.###-##'"
              v-model="cliente.cpf"
              placeholder="Informe o CPF."
              :disabled="cliente.tipoPessoa === 'J'"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="RG:" label-for="cliente-rg">
            <b-form-input
              id="cliente-rg"
              type="text"
              v-model="cliente.rg"
              placeholder="Informe o RG."
              :disabled="cliente.tipoPessoa === 'J'"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="CNPJ:" label-for="cliente-cnpj">
            <b-form-input
              id="cliente-cnpj"
              type="text"
              v-mask="'##.###.###/####-##'"
              v-model="cliente.cnpj"
              placeholder="Informe o CNPJ."
              :disabled="cliente.tipoPessoa === 'F'"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Inscrição:" label-for="cliente-ie">
            <b-form-input
              id="cliente-ie"
              type="text"
              v-model="cliente.ie"
              placeholder="Informe a inscrição estadual."
              :disabled="cliente.tipoPessoa === 'F'"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Endereço:" label-for="cliente-endereco">
            <b-form-input
              id="cliente-endereco"
              type="text"
              v-model="cliente.endereco"
              placeholder="Informe o endereço."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Número:" label-for="cliente-numero">
            <b-form-input
              id="cliente-numero"
              type="number"
              v-model="cliente.numero"
              placeholder="Informe o número."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" sm="12">
          <b-form-group label="Bairro:" label-for="cliente-bairro">
            <b-form-input
              id="cliente-bairro"
              type="text"
              v-model="cliente.bairro"
              placeholder="Informe o bairro."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Complemento:" label-for="cliente-complemento">
            <b-form-input
              id="cliente-complemento"
              type="text"
              v-model="cliente.complemento"
              placeholder="Informe o complemento."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Cep:" label-for="cliente-cep">
            <b-form-input
              id="cliente-cep"
              type="text"
              v-mask="'#####-###'"
              v-model="cliente.cep"
              placeholder="Informe o cep."
            />
          </b-form-group>
        </b-col>
        <b-col md="7" sm="12">
          <b-form-group label="Cidade:" label-for="cliente-cidade">
            <b-form-input
              id="cliente-cidade"
              type="text"
              v-model="cliente.cidade"
              placeholder="Informe a cidade."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="UF:" label-for="cliente-uf">
            <b-form-input
              id="cliente-uf"
              type="text"
              v-model="cliente.uf"
              placeholder="Informe a UF."
              maxlength="2"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group label="Telefone:" label-for="cliente-telefone">
            <b-form-input
              id="cliente-telefone"
              type="text"
              v-mask="'(##) ####-####'"
              v-model="cliente.telefone"
              placeholder="Informe o telefone."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Celular:" label-for="cliente-celular">
            <b-form-input
              id="cliente-celular"
              type="text"
              v-mask="'(##) # ####-####'"
              v-model="cliente.celular"
              placeholder="Informe o celular."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Whatsapp:" label-for="cliente-whatsapp">
            <b-form-input
              id="cliente-whatsapp"
              type="text"
              v-mask="'(##) # ####-####'"
              v-model="cliente.whatsapp"
              placeholder="Informe o whatsapp."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="E-mail:" label-for="cliente-email">
            <b-form-input
              id="cliente-email"
              type="email"
              v-model="cliente.email"
              placeholder="Informe o e-mail."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Referência:" label-for="cliente-referencia">
            <b-form-input
              id="cliente-referencia"
              type="text"
              v-model="cliente.referencia"
              placeholder="Informe a referência."
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group
            label="Limite Mínimo:"
            label-for="cliente-limite-minimo"
          >
            <money
              id="cliente-limite-minimo"
              class="form-control"
              v-bind="money"
              v-model="cliente.limiteMinimo"
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Limite Máximo:" label-for="cliente-limite">
            <money
              id="cliente-limite"
              class="form-control"
              v-bind="money"
              v-model="cliente.limite"
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group
            label="Data de Nascimento:"
            label-for="cliente-nascimento"
          >
            <b-form-input
              id="cliente-nascimento"
              type="date"
              v-model="cliente.nascimento"
              placeholder="Informe a data de nascimento."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Data de Cadastro:" label-for="cliente-cadastro">
            <b-form-input
              id="cliente-cadastro"
              type="text"
              v-model="cli_cadastro"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group
            label="Dia Preferencial:"
            label-for="cliente-dia-preferencial"
          >
            <b-form-input
              id="cliente-dia-preferencial"
              type="number"
              v-model="cliente.diaPagamento"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label=" " label-for="cliente-bloqueado">
            <b-form-checkbox id="cliente-bloqueado" v-model="bloqueado"
              >Bloqueado?</b-form-checkbox
            >
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label=" " label-for="cliente-exibe-limite">
            <b-form-checkbox id="cliente-exibe-limite" v-model="exibeLimite"
              >Exibir Limite no Comprovante?</b-form-checkbox
            >
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label=" " label-for="cliente-inativo">
            <b-form-checkbox id="cliente-inativo" v-model="inativo"
              >Inativo?</b-form-checkbox
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

    <b-form-group label="Pesquisar" label-for="cliente-pesquisa">
      <b-form-input
        id="cliente-pesquisa"
        type="text"
        v-model="busca"
        placeholder="Digite o nome"
      />
    </b-form-group>

    <b-table hover striped :items="clientes" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button
          variant="warning"
          @click="loadCliente(data.item)"
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
  name: "Cliente",
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
      cliente: {},
      clientes: [],
      cli_cadastro: "",
      tipo: [
        { value: "F", text: "Física" },
        { value: "J", text: "Jurídica" },
      ],
      usuarioStorage: {},
      bloqueado: false,
      inativo: false,
      exibeLimite: false,
      page: 1,
      limit: 0,
      count: 0,
      busca: "",
      fields: [
        { key: "cli_nome", label: "Nome", sortable: true },
        { key: "cli_telefone", label: "Telefone", sortable: true },
        { key: "cli_celular", label: "Celular", sortable: true },
        { key: "cli_whatsapp", label: "Whatsapp", sortable: true },
        { key: "cli_referencia", label: "Referência", sortable: true },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  methods: {
    loadClientes() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/clientes/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then((res) => {
        this.clientes = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    reset() {
      this.mode = "save";
      this.cliente = {};
      this.cliente.limite = 0.0;
      this.cliente.limiteMinimo = 0.0;
      this.loadClientes();
      this.exibeLimite = false;
      this.bloqueado = false;
      this.inativo = false;
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      this.cliente.cadastro = stringToDate(this.cli_cadastro);
      this.cliente.bloqueado = this.bloqueado === false ? 0 : 1;
      this.cliente.inativo = this.inativo === false ? 0 : 1;
      this.cliente.exibeLimite = this.exibeLimite === false ? 0 : 1;
      const empresa = this.cliente.empresa
        ? `/${this.cliente.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.cliente.id ? "put" : "post";
      const id = this.cliente.id ? `/${this.cliente.id}` : "";
      axios[method](`${baseApiUrl}/clientes${id}${empresa}`, this.cliente)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(cliente) {
      const id = cliente.cli_id;
      axios
        .delete(`${baseApiUrl}/clientes/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadCliente(cliente, mode = "save") {
      this.mode = mode;
      const dados = {
        id: cliente.cli_id,
        nome: cliente.cli_nome,
        tipoPessoa: cliente.cli_fisica_juridica,
        cpf: cliente.cli_cpf,
        rg: cliente.cli_rg,
        cnpj: cliente.cli_cnpj,
        ie: cliente.cli_ie,
        endereco: cliente.cli_endereco,
        numero: cliente.cli_numero,
        bairro: cliente.cli_bairro,
        complemento: cliente.cli_complemento,
        cep: cliente.cli_cep,
        cidade: cliente.cli_cidade,
        uf: cliente.cli_uf,
        telefone: cliente.cli_telefone,
        celular: cliente.cli_celular,
        whatsapp: cliente.cli_whatsapp,
        bloqueado: cliente.cli_bloqueado,
        inativo: cliente.cli_inativo,
        exibeLimite: cliente.cli_exibe_limite,
        cadastro: cliente.cli_cadastro,
        nascimento: cliente.cli_nascimento
          ? cliente.cli_nascimento.substring(0, 10)
          : "",
        email: cliente.cli_email,
        referencia: cliente.cli_referencia,
        limite: cliente.cli_limite,
        limiteMinimo: cliente.cli_limite_minimo,
        diaPagamento: cliente.cli_dia_pagamento,
        empresa: cliente.emp_id,
      };
      this.bloqueado = cliente.cli_bloqueado === 0 ? false : true;
      this.inativo = cliente.cli_inativo === 0 ? false : true;
      this.exibeLimite = cliente.cli_exibe_limite === 0 ? false : true;
      this.cliente = { ...dados };
    },
    geraData: function () {
      var dataAtual = new Date();
      var dataFormatada =
        dataAtual.getDate() +
        "/" +
        (dataAtual.getMonth() + 1) +
        "/" +
        dataAtual.getFullYear();
      this.cli_cadastro = dataFormatada;
    },
  },
  watch: {
    page() {
      this.loadClientes();
    },
    busca: function (val) {
      if (val === "") {
        this.loadClientes();
      } else {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const method = "get";
        axios[method](
          `${baseApiUrl}/buscaClientes/${val}/${this.usuarioStorage.empresa}?page=${this.page}`
        ).then((res) => {
          this.clientes = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        });
      }
    },
  },
  mounted() {
    this.loadClientes();
    this.geraData();
  },
};
</script>

<style>
</style>