<template>
  <div class="grupo">
    <b-form>
      <input id="gru_id" type="hidden" v-model="grupo.id" />
      <b-col md="6" sm="12">
        <b-form-group label="Nome:" label-for="grupo-nome">
          <b-form-input
            id="grupo-nome"
            type="text"
            v-model="grupo.nome"
            required
            :readonly="mode === 'remove'"
            placeholder="Informe o Nome do Grupo..."
          />
        </b-form-group>
      </b-col>
      <b-col xs="12">
        <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
        <b-button class="ml-2" @click="reset">Cancelar</b-button>
      </b-col>
    </b-form>
    <hr />
    <b-table hover striped :items="grupos" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadGrupo(data.item)" class="mr-2">
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
  name: "Grupo",
  data: function() {
    return {
      mode: "save",
      usuarioStorage: {},
      grupo: {},
      grupoAux: {},
      grupos: [],
      senha: "",
      acao: "",
      resposta: 0,
      fields: [
        { key: "gru_nome", label: "Nome", sortable: true },
        { key: "actions", label: "Ações" }
      ],
      dismissSecs: 2,
      dismissCountDown: 0
    };
  },
  methods: {
    loadGrupos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/grupos/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.grupos = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.grupo = {};
      this.grupoAux = {};
      this.loadGrupos();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.grupo.empresa
        ? `/${this.grupo.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.grupo.id ? "put" : "post";
      const id = this.grupo.id ? `/${this.grupo.id}` : "";
      axios[method](`${baseApiUrl}/grupos${id}${empresa}`, this.grupo)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(grupo) {
      if (this.usuarioStorage.conf_SenhaExcluir === 1) {
        this.grupoAux = {};
        this.grupoAux = grupo;
        this.senha = "";
        this.acao = "excluir";
        this.$refs["modalSenha"].show();
      } else {
        const id = grupo.gru_id;
        axios
          .delete(`${baseApiUrl}/grupos/${id}/${this.usuarioStorage.empresa}`)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.reset();
          })
          .catch(showError);
      }
    },
    loadGrupo(grupo, mode = "save") {
      if (this.usuarioStorage.conf_SenhaEditar === 1) {
        this.grupoAux = {};
        this.grupoAux = grupo;
        this.senha = "";
        this.acao = "editar";
        this.$refs["modalSenha"].show();
      } else {
        this.mode = mode;
        const dados = {
          id: grupo.gru_id,
          nome: grupo.gru_nome,
          empresa: grupo.emp_id
        };
        this.grupo = { ...dados };
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
            id: this.grupoAux.gru_id,
            nome: this.grupoAux.gru_nome,
            empresa: this.grupoAux.emp_id
          };
          this.grupo = { ...dados };
          this.hideModalSenha();
        } else {
          this.showAlert();
          this.$refs.confSenha.focus();
        }
      } else if (this.acao === "excluir") {
        if (this.senha === this.usuarioStorage.conf_senhaGeral) {
          const id = this.grupoAux.gru_id;
          axios
            .delete(`${baseApiUrl}/grupos/${id}/${this.usuarioStorage.empresa}`)
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
    this.loadGrupos();
  }
};
</script>

<style>
</style>