<template>
  <div class="marca">
    <b-form>
      <input id="mar_id" type="hidden" v-model="marca.id" />
      <b-col md="6" sm="12">
        <b-form-group label="Nome:" label-for="marca-nome">
          <b-form-input
            id="marca-nome"
            type="text"
            v-model="marca.nome"
            required
            :readonly="mode === 'remove'"
            placeholder="Informe o Nome da Marca..."
          />
        </b-form-group>
      </b-col>
      <b-col xs="12">
        <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
        <b-button class="ml-2" @click="reset">Cancelar</b-button>
      </b-col>
    </b-form>
    <hr />
    <b-table hover striped :items="marcas" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadMarca(data.item)" class="mr-2">
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
  name: "Marca",
  data: function() {
    return {
      mode: "save",
      usuarioStorage: {},
      marca: {},
      marcas: [],
      fields: [
        { key: "mar_nome", label: "Nome", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadMarcas() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/marcas/${this.usuarioStorage.empresa}`;
      axios.get(url).then(res => {
        this.marcas = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.marca = {};
      this.loadMarcas();
    },
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.marca.empresa
        ? `/${this.marca.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.marca.id ? "put" : "post";
      const id = this.marca.id ? `/${this.marca.id}` : "";
      axios[method](`${baseApiUrl}/marcas${id}${empresa}`, this.marca)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove(marca) {
      const id = marca.mar_id;
      axios
        .delete(`${baseApiUrl}/marcas/${id}/${this.usuarioStorage.empresa}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadMarca(marca, mode = "save") {
      this.mode = mode;
      const dados = {
        id: marca.mar_id,
        nome: marca.mar_nome,
        empresa: marca.emp_id
      };
      this.marca = { ...dados };
    }
  },
  mounted() {
    this.loadMarcas();
  }
};
</script>

<style>
</style>