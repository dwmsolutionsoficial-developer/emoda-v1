<template>
  <div class="receber-pagamento">
    <b-form>
      <b-row>
        <b-col md="5" sm="12">
          <b-form-group label="Cliente:" label-for="receber-cliente">
            <model-select
              class="form-control"
              :options="clientes"
              v-model="receber.cliente"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Data:" label-for="receber-data">
            <b-form-input
              id="receber-data"
              type="date"
              v-model="receber.data"
              placeholder="Informe a Data."
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Valor Pago:" label-for="receber-valor">
            <money
              class="form-control"
              v-bind="money"
              v-model="receber.valor"
              v-bind:class="calcula"
            ></money>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Desconto:" label-for="receber-desconto">
            <money
              class="form-control"
              v-bind="money"
              v-model="receber.desconto"
              v-bind:class="calcula"
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Total Pago:" label-for="receber-total-pago">
            <money
              class="form-control"
              v-bind="money"
              v-model="totalPago"
              disabled
            ></money>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group
            v-if="mode === 'save'"
            label="Tipo de Pagamento:"
            label-for="receber-pagamento"
          >
            <b-form-select
              id="receber-pagamento"
              :options="tipo"
              v-model="receber.pagamento"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-button pill variant="success" @click="preencheValores"
        >Buscar Saldo</b-button
      >
      <hr />
      <b-row>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Saldo Devedor:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-credito">{{
              saldo === undefined ? 0.0 : saldo
            }}</span>
          </div>
        </div>
        <div class="totalizacao">
          <div class="totalizacao-titulo">
            <h2>Limite de Crédito:</h2>
          </div>
          <div class="totalizacao-info">
            <span class="totalizacao-value-debito">{{
              limite === undefined ? 0.0 : limite
            }}</span>
          </div>
        </div>
      </b-row>
      <b-button
        variant="primary"
        v-if="mode === 'save'"
        @click="finalizarPagamento"
        >Finalizar</b-button
      >
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>

    <b-modal ref="comprovante" title="Comprovante de Recebimento" hide-footer>
      <div class="d-block text-center">
        <p>Deseja imprimir este documento?</p>
      </div>
      <b-button variant="danger" class="ml-2 float-right" @click="hideModal"
        >Não</b-button
      >
      <b-button variant="primary" class="float-right" @click="CriaPDF"
        >Sim</b-button
      >
    </b-modal>

    <div id="tabela" class="cupom-fiscal">
      <div>
        <div class="cabecario">
          <h2>{{ usuarioStorage.nome_empresa }}</h2>
          <hr />
          <span>
            <b>RECIBO</b>
          </span>
          <hr />
        </div>
        <div class="data">
          <span>
            <b>DATA:</b>
            {{ data }}&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            <b>HORA:</b>
            {{ hora }}
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
import axios from "axios";
import Vue from "vue";
import money from "v-money";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

Vue.use(money, { precision: 4 });

export default {
  name: "receberPagamento",
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
      receber: {},
      recebers: [],
      clientes: [],
      cliente: 0,
      usuarioStorage: {},
      totalizacao: {},
      valoresPagamento: {},
      nome: "",
      referencia: "",
      limite: 0.0,
      exibeLimite: 0,
      saldo: 0.0,
      valorPago: 0.0,
      totalPago: 0.0,
      data: "",
      hora: "",
      tipo: [
        { value: 1, text: "Dinheiro" },
        { value: 2, text: "Cartão" },
        { value: 3, text: "Cheque" },
        { value: 5, text: "Pix" },
      ],
    };
  },
  methods: {
    reset() {
      this.mode = "save";
      this.receber = {};
      this.valoresPagamento.saldo = 0.0;
      this.valoresPagamento.limite = 0.0;
      this.clientes = [];
      this.saldo = 0.0;
      this.valorPago = 0.0;
      this.limite = 0.0;
      this.exibeLimite = 0;
      this.nome = "";
      this.referencia = "";
      this.loadClientes();
    },
    finalizarPagamento() {
      this.valorPago = Number(this.receber.valor).toFixed(2);
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const date = new Date();
      this.receber.hora = date.getHours() + ":" + date.getMinutes();
      this.receber.totalPago = this.totalPago;

      const empresa = this.receber.empresa
        ? `/${this.receber.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = "post";
      axios[method](`${baseApiUrl}/finalizarPagamento${empresa}`, this.receber)
        .then(() => {
          this.showModal();
        })
        .catch(showError);
    },
    formataData(value) {
      if (value) {
        let dia = value.substr(8, 2);
        let mes = value.substr(5, 2);
        let ano = value.substr(0, 4);
        return dia + "/" + mes + "/" + ano;
      }
    },
    preencheValores() {
      const id = this.receber.cliente;
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
              : res.data.data.pago - res.data.data.total
          ).toFixed(2);
          this.limite =
            res.data.data.limite === null ? 0.0 : res.data.data.limite;
          this.exibeLimite =
            res.data.data.exibeLimite === null ? 0 : res.data.data.exibeLimite;
        })
        .catch(showError);
    },
    loadClientes() {
      document.getElementById("tabela").style.display = "none";
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosClientes/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.clientes = res.data.data.map((cliente) => {
          return {
            value: cliente.cli_id,
            text: cliente.cli_nome,
          };
        });
      });
    },
    CriaPDF() {
      var minhaTabela = document.getElementById("tabela").innerHTML;

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

      this.hideModal();
    },
    geraDataHora: function () {
      var dataAtual = new Date();
      var dataFormatada =
        dataAtual.getDate() +
        "/" +
        (dataAtual.getMonth() + 1) +
        "/" +
        dataAtual.getFullYear();
      this.data = dataFormatada;
      this.hora = dataAtual.getHours() + ":" + dataAtual.getUTCMinutes();
    },
    showModal() {
      this.$refs["comprovante"].show();
      this.preencheValores();
    },
    hideModal() {
      this.$refs["comprovante"].hide();
      this.$toasted.global.defaultSuccess();
      this.reset();
    },
    calculaTotalPago() {
      this.totalPago = this.receber.valor - this.receber.desconto;
    },
  },
  mounted() {
    this.loadClientes();
    this.geraDataHora();
  },
  computed: {
    calcula() {
      return this.calculaTotalPago();
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
  color: crimson;
}
.totalizacao-value-debito {
  font-size: 3rem;
  color: blue;
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
