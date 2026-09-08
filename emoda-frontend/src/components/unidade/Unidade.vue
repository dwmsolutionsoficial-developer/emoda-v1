<template>
  <div class="unidade">
    <b-form>
      <input id="uni_id" type="hidden" v-model="unidade.id" />
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Sigla:" label-for="unidade-sigla">
            <b-form-input
              id="unidade-sigla"
              type="text"
              v-model="unidade.sigla"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Sigla da Unidade..."
            />
          </b-form-group>
        </b-col>
        <b-col md="8" sm="12">
          <b-form-group label="Descrição:" label-for="unidade-descricao">
            <b-form-input
              id="unidade-descricao"
              type="text"
              v-model="unidade.descricao"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Descrição da Unidade..."
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
    <b-table hover striped :items="unidades" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadUnidade(data.item)" class="mr-2">
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
  name: "Unidade",
  data: function() {
    return {
      mode: "save",
      usuarioStorage: {},
      unidade: {},
      unidades: [],
      fields: [
        { key: "uni_sigla", label: "Sigla", sortable: true },
        { key: "uni_descricao", label: "Descrição", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadUnidades() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/unidades/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.unidades = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.unidade = {};
      this.loadUnidades();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.unidade.empresa
        ? `/${this.unidade.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.unidade.id ? "put" : "post";
      const id = this.unidade.id ? `/${this.unidade.id}` : "";
      axios[method](`${baseApiUrl}/unidades${id}${empresa}`, this.unidade)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(unidade) {
      const id = unidade.uni_id;
      axios
        .delete(`${baseApiUrl}/unidades/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadUnidade(unidade, mode = "save") {
      this.mode = mode;
      const dados = {
        id: unidade.uni_id,
        sigla: unidade.uni_sigla,
        descricao: unidade.uni_descricao,
        empresa: unidade.emp_id
      };
      this.unidade = { ...dados };
    }
  },
  mounted() {
    this.loadUnidades();
  }
};
</script>

<style>
</style>