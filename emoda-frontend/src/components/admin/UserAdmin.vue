<template>
  <div class="user-admin">
    <b-form>
      <input id="user-id" type="hidden" v-model="user.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="user-name">
            <b-form-input
              id="user-name"
              type="text"
              v-model="user.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome do Usuário..."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="E-mail:" label-for="user-email">
            <b-form-input
              id="user-email"
              type="text"
              v-model="user.email"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o E-mail do Usuário..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-show="mode === 'save'">
        <b-col md="6" sm="12">
          <b-form-group label="Senha:" label-for="user-password">
            <b-form-input
              id="user-password"
              type="password"
              v-model="user.senha"
              required
              placeholder="Informe a Senha do Usuário..."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group
            label="Confirmação de Senha:"
            label-for="user-confirm-password"
          >
            <b-form-input
              id="user-confirm-password"
              type="password"
              v-model="user.confirmPassword"
              required
              placeholder="Confirme a Senha do Usuário..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col md="12" sm="12">
          <b-form-group label="Nível de Usuário:">
            <b-form-checkbox
              id="user-admin"
              v-show="mode === 'save'"
              v-model="user.admin"
              class="mt-3 mb-3"
              >Administrador?</b-form-checkbox
            >
            <b-form-checkbox
              id="user-bloqueado"
              v-show="mode === 'save'"
              v-model="user.bloqueado"
              class="mt-3 mb-3"
              >Bloqueado?</b-form-checkbox
            >
            <b-form-checkbox
              id="user-oculta-pco-custo"
              v-show="mode === 'save'"
              v-model="user.oculta_pco_custo"
              class="mt-3 mb-3"
              >Ocultar preço de custo?</b-form-checkbox
            >
          </b-form-group>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col md="12" sm="12">
          <b-form-group id="form-group" label="Permissões do Usuário:">
            <b-form-checkbox
              id="user-exibe-banco"
              v-show="mode === 'save'"
              v-model="user.exibeBanco"
              class="mt-3 mb-3"
              >Bancos</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-grupo"
              v-show="mode === 'save'"
              v-model="user.exibeGrupo"
              class="mt-3 mb-3"
              >Grupos</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-marca"
              v-show="mode === 'save'"
              v-model="user.exibeMarca"
              class="mt-3 mb-3"
              >Marcas</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-cor"
              v-show="mode === 'save'"
              v-model="user.exibeCor"
              class="mt-3 mb-3"
              >Cores</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-tamanho"
              v-show="mode === 'save'"
              v-model="user.exibeTamanho"
              class="mt-3 mb-3"
              >Tamanhos</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-unidade"
              v-show="mode === 'save'"
              v-model="user.exibeUnidade"
              class="mt-3 mb-3"
              >Unidades</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-cliente"
              v-show="mode === 'save'"
              v-model="user.exibeCliente"
              class="mt-3 mb-3"
              >Clientes</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-fornecedor"
              v-show="mode === 'save'"
              v-model="user.exibeFornecedor"
              class="mt-3 mb-3"
              >Fornecedores</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-produto"
              v-show="mode === 'save'"
              v-model="user.exibeProduto"
              class="mt-3 mb-3"
              >Produtos</b-form-checkbox
            >
          </b-form-group>
          <b-form-group id="form-group">
            <b-form-checkbox
              id="user-exibe-caixa"
              v-show="mode === 'save'"
              v-model="user.exibeCaixa"
              class="mt-3 mb-3"
              >Controle de Caixa</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-consignado"
              v-show="mode === 'save'"
              v-model="user.exibeConsignado"
              class="mt-3 mb-3"
              >Consignado</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-receber"
              v-show="mode === 'save'"
              v-model="user.exibeReceber"
              class="mt-3 mb-3"
              >Contas à Receber</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-clientes-vencer"
              v-show="mode === 'save'"
              v-model="user.exibeClientesVencer"
              class="mt-3 mb-3"
              >Clientes à Vencer</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-venda"
              v-show="mode === 'save'"
              v-model="user.exibeVendas"
              class="mt-3 mb-3"
              >Vendas</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-relatorio"
              v-show="mode === 'save'"
              v-model="user.exibeRelatorios"
              class="mt-3 mb-3"
              >Relatórios</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-devolucao"
              v-show="mode === 'save'"
              v-model="user.exibeDevolucoes"
              class="mt-3 mb-3"
              >Devoluções</b-form-checkbox
            >
          </b-form-group>
          <b-form-group id="form-group">
            <b-form-checkbox
              id="user-exibe-documentos"
              v-show="mode === 'save'"
              v-model="user.exibeDocumentos"
              class="mt-3 mb-3"
              >Documentos</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-pagamento"
              v-show="mode === 'save'"
              v-model="user.exibePagamento"
              class="mt-3 mb-3"
              >Pagamento</b-form-checkbox
            >
            <b-form-checkbox
              id="user-exibe-recebimentos"
              v-show="mode === 'save'"
              v-model="user.exibeRecebimentos"
              class="mt-3 mb-3"
              >Recebimentos</b-form-checkbox
            >
          </b-form-group>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" v-if="mode === 'save'" @click="save"
            >Salvar</b-button
          >
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove"
            >Excluir</b-button
          >
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <b-table hover striped :items="users" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "UserAdmin",
  data: function () {
    return {
      mode: "save",
      user: {},
      usuarioStorage: {},
      users: [],
      fields: [
        { key: "usu_nome", label: "Nome", sortable: true },
        { key: "usu_email", label: "E-mail", sortable: true },
        {
          key: "usu_admin",
          label: "Administrador",
          sortable: true,
          formatter: (value) => (value ? "Sim" : "Não"),
        },
        {
          key: "usu_bloqueado",
          label: "Bloqueado",
          sortable: true,
          formatter: (value) => (value ? "Sim" : "Não"),
        },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  methods: {
    loadUsers() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/usuarios/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.users = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.user = {};
      this.loadUsers();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));

      if (this.user.admin) {
        this.user.exibeBanco = true;
        this.user.exibeGrupo = true;
        this.user.exibeMarca = true;
        this.user.exibeCor = true;
        this.user.exibeTamanho = true;
        this.user.exibeUnidade = true;
        this.user.exibeCliente = true;
        this.user.exibeFornecedor = true;
        this.user.exibeProduto = true;
        this.user.exibeCaixa = true;
        this.user.exibeConsignado = true;
        this.user.exibeReceber = true;
        this.user.exibeClientesVencer = true;
        this.user.exibeVendas = true;
        this.user.exibeRelatorios = true;
        this.user.exibeDevolucoes = true;
        this.user.exibeDocumentos = true;
        this.user.exibePagamento = true;
        this.user.exibeRecebimentos = true;
      }

      const method = this.user.id ? "put" : "post";
      const id = this.user.id ? `/${this.user.id}` : "";
      const empresa = this.user.empresa
        ? `/${this.user.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      axios[method](`${baseApiUrl}/usuarios${id}${empresa}`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(user) {
      const id = user.usu_id;
      axios
        .delete(`${baseApiUrl}/usuarios/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadUser(user, mode = "save") {
      this.mode = mode;
      const dados = {
        id: user.usu_id,
        nome: user.usu_nome,
        email: user.usu_email,
        bloqueado: user.usu_bloqueado === 1 ? true : false,
        oculta_pco_custo: user.usu_oculta_pco_custo === 1 ? true : false,
        empresa: user.emp_id,
        admin: user.usu_admin === 1 ? true : false,
        exibeBanco: user.usu_exibe_banco === 1 ? true : false,
        exibeGrupo: user.usu_exibe_grupo === 1 ? true : false,
        exibeMarca: user.usu_exibe_marca === 1 ? true : false,
        exibeCor: user.usu_exibe_cor === 1 ? true : false,
        exibeTamanho: user.usu_exibe_tamanho === 1 ? true : false,
        exibeUnidade: user.usu_exibe_unidade === 1 ? true : false,
        exibeCliente: user.usu_exibe_cliente === 1 ? true : false,
        exibeFornecedor: user.usu_exibe_fornecedor === 1 ? true : false,
        exibeProduto: user.usu_exibe_produto === 1 ? true : false,
        exibeCaixa: user.usu_exibe_caixa === 1 ? true : false,
        exibeConsignado: user.usu_exibe_consignado === 1 ? true : false,
        exibeReceber: user.usu_exibe_receber === 1 ? true : false,
        exibeClientesVencer:
          user.usu_exibe_clientes_vencer === 1 ? true : false,
        exibeVendas: user.usu_exibe_vendas === 1 ? true : false,
        exibeRelatorios: user.usu_exibe_relatorios === 1 ? true : false,
        exibeDevolucoes: user.usu_exibe_devolucoes === 1 ? true : false,
        exibeDocumentos: user.usu_exibe_documento === 1 ? true : false,
        exibePagamento: user.usu_exibe_pagamento === 1 ? true : false,
        exibeRecebimentos: user.usu_exibe_recebimento === 1 ? true : false,
      };
      this.user = { ...dados };
    },
  },
  mounted() {
    this.loadUsers();
  },
};
</script>

<style>
</style>
