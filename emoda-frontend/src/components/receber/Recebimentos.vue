<template id="recebimentos">
  <div class="recebimentos">
    <b-button variant="success" @click="atualizaLista"
      >Atualizar Lista</b-button
    >
    <br />
    <br />
    <b-row>
      <b-col md="6" sm="12">
        <b-form-group label="Pesquisar" label-for="recebimentos-pesquisa">
          <b-form-input
            id="recebimentos-pesquisa"
            type="text"
            v-model="busca"
            placeholder="Digite o nome"
          />
        </b-form-group>
      </b-col>
      <b-col md="6" sm="12">
        <b-form-group
          label="Data de Pagamento:"
          label-for="recebimentos-pesquisa-data"
        >
          <b-form-input
            id="recebimentos-pesquisa-data"
            type="date"
            v-model="buscaData"
            placeholder="Informe a data."
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-table hover striped :items="filteredItems" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button
          variant="primary"
          class="mr-2"
          @click="imprimeComprovante(data.item)"
        >
          <i class="fa fa-print"></i>
        </b-button>
        <b-button variant="danger" class="mr-2" @click="remove(data.item)">
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

    <b-modal ref="confirmacao" title="Comprovante de Recebimento" hide-footer>
      <div class="d-block text-center">
        <p>Deseja imprimir este documento?</p>
      </div>
      <b-button variant="danger" class="ml-2 float-right" @click="hideModal()"
        >Não</b-button
      >
      <b-button variant="primary" class="float-right" @click="CriaPDF()"
        >Sim</b-button
      >
    </b-modal>

    <div id="comprovanteRecebimento" class="cupom-fiscal" style="display: none">
      <div>
        <div class="cabecario">
          <h2>{{ usuarioStorage.nome_empresa }}</h2>
          <hr />
          <span>
            <b>2ª VIA DO RECIBO</b>
          </span>
          <hr />
        </div>
        <div class="data">
          <span>
            <b>DATA:</b>
            {{ data }}&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
        <hr />
        <div>
          <span>
            <b>CLIENTE:</b>
            {{ nome }}
          </span>
          <br v-if="exibeLimite === 1" />
          <span v-if="exibeLimite === 1">
            <b>LIMITE DE CRÉDITO:</b>
            {{ limite }}
          </span>
          <br />
          <span>
            <b>REFERÊNCIA:</b>
            {{ referencia }}
          </span>
          <br />
          <span>
            <b>TOTAL PAGO:</b>
            {{ valorPago }}
          </span>
          <br />
          <span>
            <b>TOTAL EM ABERTO:</b>
            {{ saldo }}
          </span>
        </div>
        <hr />
        <div class="rodape">
          <span>Obrigado pela preferência. Volte sempre!</span>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import VueRouter from "vue-router";
import axios from "axios";
import Vue from "vue";
import money from "v-money";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

Vue.use(money, { precision: 4 });
Vue.use(VueRouter);

export default {
  name: "Recebimentos",
  components: {
    ModelSelect,
  },
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
      recebimento: {},
      recebimentos: [],
      busca: "",
      pesquisa: "",
      buscaData: "",
      page: 1,
      limit: 0,
      count: 0,
      usuarioStorage: {},
      nome: "",
      referencia: "",
      limite: 0.0,
      exibeLimite: 0,
      saldo: 0.0,
      valorPago: 0.0,
      data: "",
      hora: "",
      fields: [
        { key: "cli_nome", label: "Cliente", sortable: true },
        { key: "pag_data", label: "Data", sortable: true },
        { key: "pag_valor", label: "Valor", sortable: true },
        { key: "tipo", label: "Tipo", sortable: true },
        { key: "actions", label: "Opções" },
      ],
    };
  },
  methods: {
    loadRecebimentos() {
      const nome = this.busca === "" ? null : this.busca;
      const data = this.buscaData === "" ? null : this.buscaData;

      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/recebimentos/${nome}/${data}/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios
        .get(url)
        .then((res) => {
          this.recebimentos = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        })
        .catch(showError);
    },
    remove(item) {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      axios
        .delete(
          `${baseApiUrl}/removePagamento/${item.pag_id}/${this.usuarioStorage.empresa}`
        )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadRecebimentos();
        })
        .catch(showError);
    },
    reset() {
      this.mode = "save";
      this.recebimento = {};
      this.recebimentos = [];
      this.nome = "";
      this.referencia = "";
      this.limite = 0.0;
      this.exibeLimite = 0;
      this.saldo = 0.0;
      this.valorPago = 0.0;
      this.data = "";
      this.hora = "";
      this.busca = "";
      this.buscaData = "";
      this.loadRecebimentos();
    },
    stringToDate(value) {
      if (value.length >= 9) {
        let parts = value.split("/");
        let date = parts[2] + "-" + parts[1] + "-" + parts[0];
        return date;
      }
    },
    atualizaLista() {
      this.loadRecebimentos();
    },
    showModal() {
      this.$refs["confirmacao"].show();
    },
    hideModal() {
      this.$refs["confirmacao"].hide();
    },
    imprimeComprovante(dados) {
      const id = dados.cli_id;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/receberValoresCliente/${id}/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then((res) => {
          this.nome = res.data.data.nome;
          this.referencia = res.data.data.referencia;
          this.saldo = Number(
            res.data.data.total === null
              ? 0.0
              : res.data.data.total - res.data.data.pago
          ).toFixed(2);
          this.limite =
            res.data.data.limite === null ? 0.0 : res.data.data.limite;
          this.exibeLimite =
            res.data.data.exibeLimite === null ? 0 : res.data.data.exibeLimite;
          this.valorPago = dados.pag_valor;
          this.data = dados.pag_data;
        })
        .catch(showError);

      this.showModal();
    },
    CriaPDF() {
      var minhaTabela = document.getElementById("comprovanteRecebimento")
        .innerHTML;

      var style = "<style>";
      style = style + "body * {font: 10px Arial;}";
      style = style + "body b {font-weight: bold}";
      style = style + "table {width: 100%;font: 20px Calibri;}";
      style =
        style +
        "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
      style = style + "padding: 2px 3px;text-align: center;}";
      style = style + "</style>";

      // CRIA UM OBJETO WINDOW
      var win = window.open("", "", "height=700,width=700");

      win.document.write("<html><head>");
      win.document.write("<title>Comprovante de Pagamento</title>"); // <title> CABEÇALHO DO PDF.
      win.document.write(style); // INCLUI UM ESTILO NA TAB HEAD
      win.document.write("</head>");
      win.document.write("<body>");
      win.document.write(minhaTabela); // O CONTEUDO DA TABELA DENTRO DA TAG BODY
      win.document.write("</body></html>");

      win.document.close(); // FECHA A JANELA

      win.print(); // IMPRIME O CONTEUDO
      this.reset();
      this.hideModal();
    },
  },
  watch: {
    page() {
      this.loadRecebimentos();
    },
    busca: function () {
      this.loadRecebimentos();
      /*
      if (val === "") {
        this.loadRecebimentos();
      } else {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const method = "get";
        axios[method](
          `${baseApiUrl}/buscaClientesRecebimentos/${val}/${this.usuarioStorage.empresa}?page=${this.page}`
        ).then(res => {
          this.recebimentos = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        });
      }
      */
    },
    buscaData: function () {
      this.loadRecebimentos();
      /*
      if (val === "") {
        this.loadRecebimentos();
      } else {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const method = "get";
        axios[method](
          `${baseApiUrl}/buscaRecebimentosPorData/${val}/${this.usuarioStorage.empresa}?page=${this.page}`
        ).then(res => {
          this.recebimentos = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        });
      }
      */
    },
  },
  mounted() {
    this.loadRecebimentos();
  },
  computed: {
    filteredItems() {
      return !this.pesquisa.length
        ? this.recebimentos
        : this.recebimentos.filter((item) =>
            item.cli_nome.includes(this.pesquisa)
          );
    },
  },
};
</script>

<style>
.totalizacao {
  flex: 1;
  display: flex;
  border-radius: 8px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}
.totalizacao-value-credito {
  font-size: 3rem;
  color: blue;
}
.totalizacao-value-debito {
  font-size: 3rem;
  color: crimson;
}
.totalizacao-value-total {
  font-size: 3rem;
  color: green;
}
.totalizacao-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.totalizacao-titulo {
  display: flex;
  align-items: center;
}

.totalizacao-titulo h2 {
  font-size: 2rem;
}

.cupom-fiscal {
  width: 400px;
  font-size: 12px;
  text-align: left;
}

.cupom-fiscal hr {
  border: 0;
  border-bottom: 1px solid #000;
}

.data {
  size: 12px;
  text-align: center;
}

.titulo {
  font-size: 12px;
  text-align: center;
}

.espaco {
  margin: 10px 0;
}

.cabecario {
  text-align: center;
}

.rodape {
  text-align: center;
  font-size: 10px;
}
</style>