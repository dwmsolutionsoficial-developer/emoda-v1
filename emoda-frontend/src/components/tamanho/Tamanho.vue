<template>
  <div class="tamanho">
    <b-form>
      <input id="tam_id" type="hidden" v-model="tamanho.id" />
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Sigla:" label-for="tamanho-sigla">
            <b-form-input
              id="tamanho-sigla"
              type="text"
              v-model="tamanho.sigla"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Sigla do Tamanho..."
            />
          </b-form-group>
        </b-col>
        <b-col md="8" sm="12">
          <b-form-group label="Descrição:" label-for="tamanho-descricao">
            <b-form-input
              id="tamanho-descricao"
              type="text"
              v-model="tamanho.descricao"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a Descrição do Tamanho..."
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
    <b-table hover striped :items="tamanhos" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadTamanho(data.item)" class="mr-2">
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
  name: "Tamanho",
  data: function() {
    return {
      mode: "save",
      usuarioStorage: {},
      tamanho: {},
      tamanhos: [],
      fields: [
        { key: "tam_sigla", label: "Sigla", sortable: true },
        { key: "tam_descricao", label: "Descrição", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadTamanhos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/tamanhos/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.tamanhos = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.tamanho = {};
      this.loadTamanhos();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.tamanho.empresa
        ? `/${this.tamanho.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.tamanho.id ? "put" : "post";
      const id = this.tamanho.id ? `/${this.tamanho.id}` : "";
      axios[method](`${baseApiUrl}/tamanhos${id}${empresa}`, this.tamanho)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(tamanho) {
      const id = tamanho.tam_id;
      axios
        .delete(`${baseApiUrl}/tamanhos/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadTamanho(tamanho, mode = "save") {
      this.mode = mode;
      const dados = {
        id: tamanho.tam_id,
        sigla: tamanho.tam_sigla,
        descricao: tamanho.tam_descricao,
        empresa: tamanho.emp_id
      };
      this.tamanho = { ...dados };
    }
  },
  mounted() {
    this.loadTamanhos();
  }
};
</script>

<style>
</style>