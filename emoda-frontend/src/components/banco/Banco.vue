<template>
  <div class="banco">
    <b-form>
      <input id="ban_id" type="hidden" v-model="banco.id" />
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Nome:" label-for="banco-nome">
            <b-form-input
              id="banco-nome"
              type="text"
              v-model="banco.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome da banco..."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Agência:" label-for="banco-agencia">
            <b-form-input
              id="banco-agencia"
              type="text"
              v-model="banco.agencia"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Agência da banco..."
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Operação:" label-for="banco-operacao">
            <b-form-input
              id="banco-operacao"
              type="text"
              v-model="banco.operacao"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Operacao da banco..."
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Conta:" label-for="banco-conta">
            <b-form-input
              id="banco-conta"
              type="text"
              v-model="banco.conta"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Conta da banco..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <b-table hover striped :items="bancos" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadBanco(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="remove(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-modal id="modal-senha" title="Senha Administrativa" hide-footer ref="modalSenha">
      <input id="acao" type="hidden" v-model="acao" />
      <b-form-group label="Senha:" label-for="conf-senha">
        <b-form-input
          id="confSenha"
          type="password"
          v-model="senha"
          placeholder="Informe a Senha Administrativa"
          ref="confSenha"
          autofocus
        />
      </b-form-group>
      <b-alert
        :show="dismissCountDown"
        dismissible
        variant="danger"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >Senha Incorreta!</b-alert>
      <hr />
      <b-row>
        <b-col xs="12">
          <b-button variant="danger" @click="hideModalSenha">Cancelar</b-button>
          <b-button
            variant="primary"
            @click="verificaSenhaAdministrativaEditar"
            class="ml-2"
          >Continuar</b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "banco",
  data: function() {
    return {
      mode: "save",
      usuarioStorage: {},
      banco: {},
      bancoAux: {},
      bancos: [],
      senha: "",
      acao: "",
      resposta: 0,
      fields: [
        { key: "ban_nome", label: "Nome", sortable: true },
        { key: "ban_saldo", label: "Saldo", sortable: true },
        { key: "actions", label: "Ações" }
      ],
      dismissSecs: 2,
      dismissCountDown: 0
    };
  },
  methods: {
    loadBancos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/bancos/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.bancos = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.banco = {};
      this.bancoAux = {};
      this.loadBancos();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.banco.empresa
        ? `/${this.banco.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.banco.id ? "put" : "post";
      const id = this.banco.id ? `/${this.banco.id}` : "";
      axios[method](`${baseApiUrl}/bancos${id}${empresa}`, this.banco)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(banco) {
      if (this.usuarioStorage.conf_SenhaExcluir === 1) {
        this.bancoAux = {};
        this.bancoAux = banco;
        this.senha = "";
        this.acao = "excluir";
        this.$refs["modalSenha"].show();
      } else {
        const id = banco.ban_id;
        axios
          .delete(`${baseApiUrl}/bancos/${id}/${this.usuarioStorage.empresa}`)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
          })
          .catch(showError);
      }
    },
    loadBanco(banco, mode = "save") {
      if (this.usuarioStorage.conf_SenhaEditar === 1) {
        this.bancoAux = {};
        this.bancoAux = banco;
        this.senha = "";
        this.acao = "editar";
        this.$refs["modalSenha"].show();
      } else {
        this.mode = mode;
        const dados = {
          id: banco.ban_id,
          nome: banco.ban_nome,
          agencia: banco.ban_agencia,
          operacao: banco.ban_operacao,
          conta: banco.ban_conta,
          saldo: banco.ban_saldo,
          empresa: banco.emp_id
        };
        this.banco = { ...dados };
      }
    },
    hideModalSenha() {
      this.$refs["modalSenha"].hide();
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    verificaSenhaAdministrativaEditar() {
      if (this.acao === "editar") {
        if (this.senha === this.usuarioStorage.conf_senhaGeral) {
          const dados = {
            id: this.bancoAux.ban_id,
            nome: this.bancoAux.ban_nome,
            agencia: this.bancoAux.ban_agencia,
            operacao: this.bancoAux.ban_operacao,
            conta: this.bancoAux.ban_conta,
            saldo: this.bancoAux.ban_saldo,
            empresa: this.bancoAux.emp_id
          };
          this.banco = { ...dados };
          this.hideModalSenha();
        } else {
          this.showAlert();
          this.$refs.confSenha.focus();
        }
      } else if (this.acao === "excluir") {
        if (this.senha === this.usuarioStorage.conf_senhaGeral) {
          const id = this.bancoAux.ban_id;
          axios
            .delete(`${baseApiUrl}/bancos/${id}/${this.usuarioStorage.empresa}`)
            .then(() => {
              this.$toasted.global.defaultSuccess();
              this.reset();
            })
            .catch(showError);
          this.hideModalSenha();
        } else {
          this.showAlert();
          this.$refs.confSenha.focus();
        }
      }
    }
  },
  mounted() {
    this.loadBancos();
  }
};
</script>

<style>
</style>