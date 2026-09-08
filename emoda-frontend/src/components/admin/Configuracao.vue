<template>
  <div class="configuracao">
    <b-form>
      <input id="conf_id" type="hidden" v-model="configuracao.id" />
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Número de Venda:" label-for="configuracao-numero-venda">
            <b-form-input
              id="configuracao-numero-venda"
              type="number"
              v-model="configuracao.numeroVenda"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Permissões:">
        <b-form-checkbox v-model="configuracao.senhaEditar">Solicitar senha para edição?</b-form-checkbox>
        <b-form-checkbox v-model="configuracao.senhaExcluir">Solicitar senha para exclusão?</b-form-checkbox>
      </b-form-group>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Senha Geral:" label-for="configuracao-senhaGeral">
            <b-form-input
              id="configuracao-senhaGeral"
              type="password"
              v-model="configuracao.senhaGeral"
              placeholder="Informe a Senha Geral"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
    </b-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "Configuracao",
  components: { VueEditor },
  data: function() {
    return {
      mode: "save",
      configuracao: {},
      configuracoes: [],
      usuarioStorage: {}
    };
  },
  methods: {
    loadConfiguracoes() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/configuracoes/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.loadConfiguracao(res.data);
      });
    },

    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.configuracao.empresa
        ? `/${this.configuracao.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.configuracao.id ? "put" : "post";
      const id = this.configuracao.id ? `/${this.configuracao.id}` : "";
      axios[method](
        `${baseApiUrl}/configuracoes${id}${empresa}`,
        this.configuracao
      )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadConfiguracoes();
        })
        .catch(showError);
    },

    loadConfiguracao(config, mode = "save") {
      this.mode = mode;
      const dados = {
        id: config[0].conf_id,
        numeroVenda: config[0].conf_numero_venda,
        senhaEditar: config[0].conf_senha_para_editar === 1 ? true : false,
        senhaExcluir: config[0].conf_senha_para_excluir === 1 ? true : false,
        senhaGeral: config[0].conf_senha_geral,
        empresa: config[0].emp_id
      };
      this.configuracao = { ...dados };
    }
  },
  mounted() {
    this.loadConfiguracoes();
  }
};
</script>

<style>
</style>