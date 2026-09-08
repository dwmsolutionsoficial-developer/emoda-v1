<template>
  <div class="cor">
    <b-form>
      <input id="cor_id" type="hidden" v-model="cor.id" />
      <b-col md="6" sm="12">
        <b-form-group label="Descrição:" label-for="cor-descricao">
          <b-form-input
            id="cor-descricao"
            type="text"
            v-model="cor.descricao"
            required
            :readonly="mode === 'remove'"
            placeholder="Informe a Descrição da Cor..."
          />
        </b-form-group>
      </b-col>
      <b-col xs="12">
        <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
        <b-button class="ml-2" @click="reset">Cancelar</b-button>
      </b-col>
    </b-form>
    <hr />
    <b-table hover striped :items="cores" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadCor(data.item)" class="mr-2">
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
  name: "Cor",
  data: function() {
    return {
      mode: "save",
      usuarioStorage: {},
      cor: {},
      cores: [],
      fields: [
        { key: "cor_descricao", label: "Descrição", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadCores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/cores/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.cores = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.cor = {};
      this.loadCores();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.cor.empresa
        ? `/${this.cor.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.cor.id ? "put" : "post";
      const id = this.cor.id ? `/${this.cor.id}` : "";
      axios[method](`${baseApiUrl}/cores${id}${empresa}`, this.cor)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(cor) {
      const id = cor.cor_id;
      axios
        .delete(`${baseApiUrl}/cores/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadCor(cor, mode = "save") {
      this.mode = mode;
      const dados = {
        id: cor.cor_id,
        descricao: cor.cor_descricao,
        empresa: cor.emp_id
      };
      this.cor = { ...dados };
    }
  },
  mounted() {
    this.loadCores();
  }
};
</script>

<style>
</style>