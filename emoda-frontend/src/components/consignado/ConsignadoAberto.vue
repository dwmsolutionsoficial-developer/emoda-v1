<template id="consignadoAberto">
  <div class="consignado-aberto">
    <b-button variant="success" @click="atualizaLista"
      >Atualizar Lista</b-button
    >
    <br />
    <br />
    <b-table hover striped :items="consignados" :fields="fields">
      <template slot="actions" slot-scope="data">
        <!--
        <b-button variant="warning" @click.stop.prevent="editar(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        -->
        <b-button
          variant="info"
          @click="showModalConferencia(data)"
          class="mr-2"
          :disabled="buttonConferencia"
        >
          <i class="fa fa-file-text-o"></i>
        </b-button>
        <b-button variant="success" @click="showModal(data.item)" class="mr-2">
          <i class="fa fa-check"></i>
        </b-button>
        <b-button
          variant="danger"
          @click="showModalExcluirConsignado(data.item)"
          :disabled="buttonRemover"
        >
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
    <b-modal ref="my-modal" hide-footer title="Fechamento do Consignado">
      <div class="d-block text-center">
        <b-form-group
          v-if="mode === 'save'"
          label="Pagamento:"
          label-for="consignado-pagamento"
        >
          <b-form-select
            id="consignado-pagamento"
            :options="pagamento"
            v-model="consignado.pagamento"
          />
        </b-form-group>
        <b-form-group
          v-if="mode === 'save'"
          label="Tipo de Pagamento:"
          label-for="consignado-tipo-pagamento"
        >
          <b-form-select
            id="consignado-pagamento"
            :options="tipo"
            v-model="consignado.tipoPagamento"
          />
        </b-form-group>
      </div>
      <b-button @click="hideModal">Cancelar</b-button>
      <b-button
        class="ml-2"
        variant="primary"
        @click="fecharConsignado"
        :disabled="buttonFinalizar"
        >Finalizar</b-button
      >
    </b-modal>

    <b-modal
      ref="conferencia"
      title="Conferência de Produtos"
      hide-footer
      size="lg"
    >
      <div class="d-block text-center">
        <b-row>
          <input id="pro_id" type="hidden" v-model="consignadoDevolucao.id" />
          <b-col md="6" sm="12">
            <b-form-group label="Produto:" label-for="consignado-produto">
              <input
                type="text"
                class="form-control"
                v-model="consignadoDevolucao.produto"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col md="4" sm="12">
            <b-form-group
              label="Qtde. Devolvida:"
              label-for="consignado-quantidade"
            >
              <money
                id="consignado-quantidade"
                class="form-control"
                v-bind="money"
                v-model="consignadoDevolucao.quantidadeDevolvida"
              ></money>
            </b-form-group>
          </b-col>
          <b-col md="2" sm="12">
            <b-form-group label="  " label-for="consignado-adicionar">
              <b-button
                variant="success"
                @click="atualizaRegistro(consignadoDevolucao)"
                >Atualizar</b-button
              >
            </b-form-group>
          </b-col>
        </b-row>
        <hr />
        <b-table
          ref="tabelaConferencia"
          hover
          striped
          :items="itensConferencia"
          :fields="fieldsConferencia"
        >
          <template slot="actions" slot-scope="data">
            <b-button
              variant="warning"
              @click="loadItem(data.item)"
              class="mr-2"
            >
              <i class="fa fa-pencil"></i>
            </b-button>
          </template>
        </b-table>
        <b-pagination
          size="md"
          v-model="pageItem"
          :total-rows="countItem"
          :per-page="limitItem"
        />
      </div>
      <hr />
      <b-button
        variant="danger"
        class="ml-2 float-right"
        @click="hideModalConferencia"
        >Cancelar</b-button
      >
      <b-button
        variant="primary"
        class="float-right"
        @click="finalizaConferencia()"
        >Finalizar</b-button
      >
    </b-modal>

    <b-modal
      ref="imprimeComprovante"
      title="Impressão de Consignado"
      hide-footer
    >
      <div class="d-block text-center">
        <p>Deseja imprimir este documento?</p>
      </div>
      <b-button
        variant="danger"
        class="ml-2 float-right"
        @click="hideModalImprimeComprovante"
        >Não</b-button
      >
      <b-button variant="primary" class="float-right" @click="CriaPDF"
        >Sim</b-button
      >
    </b-modal>

    <div id="tabelaComprovante" class="cupom-fiscal" style="display: none">
      <div class="cabecario">
        <h2>{{ usuarioStorage.nome_empresa }}</h2>
        <hr />
        <div class="espaco">
          <span class="fonte">
            <b>NÚMERO DE VENDA:</b>
            &nbsp;{{ comprovante.con_documento }}
          </span>
          <br />
          <span class="fonte">
            <b>DATA:</b>
            &nbsp;{{ comprovante.con_data }}
          </span>
        </div>
        <div class="titulo espaco">
          <span class="fonte">
            <b>CLIENTE:</b>
            {{ comprovante.cli_nome }} </span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span v-if="this.comprovante.cli_exibe_limite === 1" class="fonte">
            <b>LIMITE DE CRÉDITO:</b>
            {{ comprovante.cli_limite }}
          </span>
          <br />
          <span class="fonte">
            <b>REFERÊNCIA:</b>
            {{ comprovante.cli_referencia }}
          </span>
          <br />
          <span class="fonte">
            <b>TOTAL:</b>
            {{ comprovante.con_total }}
          </span>
        </div>
      </div>
      <hr />
      <div class="cupom">
        <b-table
          hover
          striped
          :items="itensComprovante"
          :fields="fieldsComprovante"
          class="fonte"
        >
          <template slot="actions"></template>
        </b-table>
      </div>
    </div>
    <div v-show="showLoad" class="load">
      <div class="spin"></div>
      <div class="loading">CARREGANDO...</div>
    </div>
    <b-modal ref="excluirConsignado" title="Excluir Consignado" hide-footer>
      <div class="d-block text-center">
        <p>Deseja excluir esse consignado?</p>
      </div>
      <b-button
        variant="danger"
        class="ml-2 float-right"
        @click="hideModalExcluirConsignado"
        >Não</b-button
      >
      <b-button variant="primary" class="float-right" @click="excluiConsignado"
        >Sim</b-button
      >
    </b-modal>
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
import Bus from "../../config/bus";

Vue.use(money, { precision: 4 });
Vue.use(VueRouter);

export default {
  name: "ConsignadoAberto",
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
      consignado: {},
      consignadoDevolucao: {},
      consignados: [],
      excluirConsignado: {},
      produtos: [],
      produto: [],
      itens: [],
      itensConferencia: [],
      page: 1,
      limit: 0,
      count: 0,
      pageItem: 1,
      limitItem: 0,
      countItem: 0,
      numeroConsignado: 0,
      id_consignado: 0,
      diaPagamentoCliente: 0,
      fields: [
        { key: "con_data", label: "Data", sortable: true },
        { key: "con_documento", label: "Nº Documento", sortable: true },
        { key: "cli_nome", label: "Cliente", sortable: true },
        { key: "con_total", label: "Valor Total", sortable: true },
        { key: "cli_referencia", label: "Loja", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      fieldsItens: [
        { key: "pro_id", label: "Código", sortable: true },
        { key: "pro_nome", label: "Nome", sortable: true },
        { key: "conit_quantidade", label: "Qtde.", sortable: true },
        { key: "conit_preco_venda", label: "Valor Unitário", sortable: true },
        { key: "conit_desconto", label: "Desconto", sortable: true },
        { key: "conit_total", label: "Total", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      fieldsConferencia: [
        { key: "conit_produto", label: "Produto", sortable: true },
        { key: "conit_quantidade", label: "Qtde. Vendida", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      usuarioStorage: {},
      pagamento: [
        { value: 1, text: "A Vista" },
        { value: 2, text: "Crediário" },
      ],
      tipo: [
        { value: 1, text: "Dinheiro" },
        { value: 2, text: "Cartão" },
        { value: 3, text: "Cheque" },
        { value: 5, text: "Pix" },
      ],
      comprovante: {},
      itensComprovante: [],
      fieldsComprovante: [
        { key: "nome", label: "Produto", sortable: true },
        { key: "quantidade", label: "Qtde.", sortable: true },
        { key: "total", label: "Total", sortable: true },
      ],
      showLoad: false,
      buttonConferencia: false,
      buttonRemover: false,
      buttonFinalizar: false,
    };
  },
  methods: {
    loadConsignados() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/consignados/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then((res) => {
        this.consignados = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    loadItem(item, mode = "save") {
      this.mode = mode;
      const dados = {
        conit_id: item.conit_id,
        con_documento: item.con_documento,
        con_id: item.con_id,
        id: item.pro_id,
        produto: item.conit_produto,
        quantidade: item.conit_quantidade,
        quantidadeDevolvida: item.conit_quantidade,
        conit_preco_venda: item.conit_preco_venda,
        conit_desconto: item.conit_desconto,
        conit_total: item.conit_total,
        empresa: item.emp_id,
      };
      this.consignadoDevolucao = { ...dados };
    },
    async atualizaRegistro(item) {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const method = "put";
      const empresa = `/${this.usuarioStorage.empresa}`;
      const id = `/${item.id}`;
      const documento = item.con_documento;
      const id_documento = item.con_id;

      axios[method](`${baseApiUrl}/atualizaItemConsignado${id}${empresa}`, item)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.resetConferencia();
          this.getItensConferencia(documento, id_documento);
        })
        .catch(showError);
    },
    async finalizaConferencia() {
      let total = 0;

      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const method = "put";
      const empresa = `/${this.usuarioStorage.empresa}`;
      const id = `/${this.itensConferencia[0].con_documento}`;

      axios[method](`${baseApiUrl}/atualizaTotalConsignado${id}${empresa}`, {
        total,
      })
        .then(() => {
          this.hideModalConferencia();
          this.loadConsignados();
        })
        .catch(showError);
    },
    async editar(consignado) {
      const id = consignado.con_documento;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/consignadoItens/${id}/${this.usuarioStorage.empresa}?page=${this.pageItem}`;
      await axios.get(url).then((res) => {
        this.itens = res.data.data;
      });

      Bus.$emit("editar", { data: consignado, itens: this.itens });
      Bus.$emit("pagina", 1);
    },
    getItens(consignado) {
      const id = consignado.con_documento;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/consignadoItens/${id}/${this.usuarioStorage.empresa}?page=${this.pageItem}`;
      axios.get(url).then((res) => {
        this.itens = res.data.data;
        this.countItem = res.data.count;
        this.limitItem = res.data.limit;
      });
    },
    getItensConferencia(documento, id) {
      this.showLoad = true;
      this.buttonConferencia = true;

      this.numeroConsignado = documento;
      this.id_consignado = id;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/consignadoItens/${documento}/${id}/${this.usuarioStorage.empresa}?page=${this.pageItem}`;
      axios
        .get(url)
        .then((res) => {
          this.itensConferencia = res.data.data;
          this.countItem = res.data.count;
          this.limitItem = res.data.limit;
        })
        .finally(
          () => ((this.showLoad = false), (this.buttonConferencia = false))
        );
    },
    reset() {
      this.mode = "save";
      this.consignado = {};
      this.consignados = [];
      this.excluirConsignado = {};
      this.numeroConsignado = 0;
      this.id_consignado = 0;
      this.diaPagamentoCliente = 0;
      this.loadConsignados();
    },
    resetConferencia() {
      this.mode = "save";
      this.consignadoDevolucao = {};
      this.loadConsignados();
    },
    /*
    save() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const date = new Date();
      let hora = date.getHours() + ":" + date.getMinutes();
      this.caixa.hora = hora;
      this.caixa.status = 0;
      const empresa = this.caixa.empresa
        ? `/${this.caixa.empresa}`
        : `/${this.usuarioStorage.empresa}`;
      const method = this.caixa.id ? "put" : "post";
      const id = this.caixa.id ? `/${this.caixa.id}` : "";
      axios[method](`${baseApiUrl}/caixasAbertos${id}${empresa}`, this.caixa)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    */
    remove(consignado) {
      this.showLoad = true;
      this.buttonRemover = true;
      const id = consignado.con_documento;
      axios
        .delete(
          `${baseApiUrl}/consignados/${id}/${this.usuarioStorage.empresa}`
        )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadConsignados();
          this.excluirConsignado = {};
        })
        .catch(showError)
        .finally(() => ((this.showLoad = false), (this.buttonRemover = false)));
    },
    stringToDate(value) {
      if (value.length >= 9) {
        let parts = value.split("/");
        let date = parts[2] + "-" + parts[1] + "-" + parts[0];
        return date;
      }
    },
    atualizaLista() {
      this.loadConsignados();
    },
    showModal(con) {
      if (parseInt(con.con_total) === 0) {
        alert(
          "Não é possível fechar consignado com o valor zerado! \n Neste caso cancele o consignado."
        );
      } else {
        this.numeroConsignado =
          con.con_documento === undefined ? 0 : con.con_documento;
        this.id_consignado = con.con_id;
        this.diaPagamentoCliente = con.cli_dia_pagamento;
        this.comprovante = con;
        this.$refs["my-modal"].show();
      }
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    showModalConferencia(con) {
      this.getItensConferencia(con.item.con_documento, con.item.con_id);
      //this.loadProdutos();
      this.$refs["conferencia"].show();
    },
    hideModalConferencia() {
      this.$refs["conferencia"].hide();
    },
    fecharConsignado() {
      this.showLoad = true;
      this.buttonFinalizar = true;
      if (
        this.consignado.pagamento === undefined ||
        this.consignado.tipoPagamento === undefined
      ) {
        this.hideModal();
      } else {
        const date = new Date();
        let dataFechamento =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        let horaFechamento = date.getHours() + ":" + date.getMinutes();
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        var dVencimento = new Date();
        dVencimento.setDate(date.getDate() + 30);
        const dados = {
          pagamento: this.consignado.pagamento,
          tipo_pagamento: this.consignado.tipoPagamento,
          dataFechamento: dataFechamento,
          horaFechamento: horaFechamento,
          usuario: this.usuarioStorage.id,
          dataVencimento: dVencimento.toISOString().split("T")[0],
          id_consignado: this.id_consignado,
          diaPagamentoCliente: this.diaPagamentoCliente,
        };

        const method = "post";
        axios[method](
          `${baseApiUrl}/fechaconsignado/${this.numeroConsignado}/${this.usuarioStorage.empresa}`,
          dados
        )
          .then(() => {
            this.hideModal();
            this.impressaoConsignado();
          })
          .catch(showError)
          .finally(
            () => ((this.showLoad = false), (this.buttonFinalizar = false))
          );
      }
    },
    buscaProdutoCodigoBarras() {
      let codigo = this.consignado.codigoBarras;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/buscaProdutoCodigoBarras/${codigo}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.consignado.produto = res.data.pro_id;
        this.consignado.valorUnitario = res.data.pro_venda;
        this.consignado.subtotal =
          res.data.pro_venda * this.consignado.quantidade -
          this.consignado.desconto;
      });
    },
    loadProdutos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/produtos/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.produtos = res.data.data.map((produto) => {
          return { value: produto.pro_id, text: produto.pro_nome };
        });
      });
    },
    addRegistro() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = this.consignado.empresa
        ? this.consignado.empresa
        : this.usuarioStorage.empresa;

      const dados = {
        pro_id: this.consignado.produto,
        conit_produto: this.produto.pro_nome,
        conit_quantidade: this.consignado.quantidade,
        emp_id: empresa,
      };

      this.itensConferencia.push(dados);
      this.consignado.codigoBarras = "";
      this.consignado.quantidade = 0.0;
      this.loadProdutos();
    },
    showModalImprimeComprovante() {
      this.$refs["imprimeComprovante"].show();
    },
    hideModalImprimeComprovante() {
      this.$refs["imprimeComprovante"].hide();
      this.$toasted.global.defaultSuccess();
      this.reset();
    },
    impressaoConsignado() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/itensDocumento/${this.comprovante.con_documento}/${this.comprovante.cli_id}/${this.id_consignado}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.itensComprovante = res.data;
      });
      this.showModalImprimeComprovante();
    },
    CriaPDF() {
      var minhaTabela = document.getElementById("tabelaComprovante").innerHTML;

      var style = "<style>";
      style = style + "body * {font: 10px Arial;}";
      style = style + "body b {font-weight: bold}";
      style = style + "table {width: 100%;font: 10px Arial;}";
      style =
        style +
        "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
      style = style + "padding: 2px 3px;text-align: center;}";
      style = style + "</style>";

      // CRIA UM OBJETO WINDOW
      var win = window.open("", "", "height=700,width=700");

      win.document.write("<html><head>");
      win.document.write("<title>Comprovante de Venda</title>"); // <title> CABEÇALHO DO PDF.
      win.document.write(style); // INCLUI UM ESTILO NA TAB HEAD
      win.document.write("</head>");
      win.document.write("<body>");
      win.document.write(minhaTabela); // O CONTEUDO DA TABELA DENTRO DA TAG BODY
      win.document.write("</body></html>");

      win.document.close(); // FECHA A JANELA

      win.print(); // IMPRIME O CONTEUDO

      this.comprovante = {};
      this.itensComprovante = [];
      this.hideModalImprimeComprovante();
    },
    hideModalExcluirConsignado() {
      this.$refs["excluirConsignado"].hide();
    },
    showModalExcluirConsignado(consignado) {
      this.excluirConsignado = consignado;
      this.$refs["excluirConsignado"].show();
    },
    excluiConsignado() {
      this.hideModalExcluirConsignado();
      this.remove(this.excluirConsignado);
    },
  },
  watch: {
    page() {
      this.loadConsignados();
    },
    pageItem() {
      this.getItensConferencia(this.numeroConsignado, this.id_consignado);
    },
  },
  mounted() {
    this.loadProdutos();
    this.loadConsignados();
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

.cupom-fiscal body {
  width: 400px;
  font-family: Arial;
  font-size: 10px !important;
  text-transform: uppercase;
}

.fonte {
  font-size: 10px !important;
}

.cupom-fiscal hr {
  border: 0;
  border-bottom: 1px solid #000;
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
  font-family: Arial;
  font-size: 10px !important;
}

.cnpj {
  font-weight: bold;
  text-align: left;
}
.cupom td:last-child {
  text-align: right;
}

.load {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spin {
  background: #00000020;
  height: 150px;
  width: 150px;
  border-radius: 50vh;
  border: 5px solid #00000000;
  border-top: 5px solid #000;
  animation: loading 3s linear infinite;
}
.loading {
  position: absolute;
  color: #000;
}
@keyframes loading {
  100% {
    transform: rotate(360deg);
  }
}
</style>
