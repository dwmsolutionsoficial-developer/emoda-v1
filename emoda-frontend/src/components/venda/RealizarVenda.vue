<template id="realizarVenda">
  <div class="realizar-venda">
    <b-form>
      <b-button
        variant="primary"
        v-if="mode === 'save'"
        @click="showModalFechamento"
        >Finalizar Venda</b-button
      >
      <b-button class="ml-2" @click="reset">Cancelar Venda</b-button>
      <hr />
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group label="Número:" label-for="venda-numero">
            <b-form-input
              id="venda-numero"
              type="number"
              v-model="venda.numero"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Data:" label-for="venda-data">
            <b-form-input
              id="venda-data"
              type="text"
              v-model="con_data"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="5" sm="12">
          <b-form-group label="Cliente:" label-for="venda-cliente">
            <model-select
              class="form-control"
              :options="clientes"
              v-model="venda.cliente"
              placeholder="Selecione"
              @input="changeItem($event)"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Vendedor:" label-for="venda-vendedor">
            <model-select
              class="form-control"
              :options="vendedores"
              v-model="venda.vendedor"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Cód. de Barras:" label-for="venda-codigo-barras">
            <input
              ref="venda_codigo_barras"
              class="form-control"
              id="venda-codigo-barras"
              v-model="venda.codigoBarras"
              type="text"
              placeholder="Informe o Código de Barras."
              v-on:keyup.enter="buscaProdutoCodigoBarras()"
            />
          </b-form-group>
        </b-col>
        <b-col md="5" sm="12">
          <b-form-group label="Produto:" label-for="venda-produto">
            <model-select
              class="form-control"
              :options="produtos"
              v-model="venda.produto"
              placeholder="Selecione"
              v-bind:class="preencheValores"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Qtde.:" label-for="venda-quantidade">
            <input
              ref="venda_quantidade"
              type="number"
              class="form-control"
              v-model="venda.quantidade"
              v-on:keyup.enter="addRegistro(venda)"
            />
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group
            label="Valor Unitário:"
            label-for="venda-valor-unitario"
          >
            <money
              class="form-control"
              v-bind="money"
              v-model="venda.valorUnitario"
              disabled
            ></money>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group label=" " label-for="venda-adicionar">
            <b-button variant="success" @click="addRegistro(venda)"
              >Adicionar</b-button
            >
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <b-table hover striped :items="itens" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="danger" @click="removeRegistro(data.item)">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <hr />
    <b-row>
      <div class="totalizacao">
        <div class="totalizacao-titulo">
          <h2>Quantidade Total:</h2>
        </div>
        <div class="totalizacao-info">
          <span class="totalizacao-value-quantidade">{{
            quantidade === undefined ? 0.0 : quantidade.toFixed(2)
          }}</span>
        </div>
      </div>
      <div class="totalizacao">
        <div class="totalizacao-titulo">
          <h2>Total Geral:</h2>
        </div>
        <div class="totalizacao-info">
          <span class="totalizacao-value-total">{{
            total === undefined ? 0.0 : total.toFixed(2)
          }}</span>
        </div>
      </div>
    </b-row>

    <b-modal ref="comprovante" title="Impressão de venda" hide-footer>
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
      <div class="cabecario">
        <h2>{{ usuarioStorage.nome_empresa }}</h2>
        <hr />
        <div class="espaco">
          <span class="fonte">
            <b>NÚMERO DE VENDA:</b>
            &nbsp;{{ venda.numero }} </span
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="fonte">
            <b>DATA:</b>
            &nbsp;{{ con_data }}
          </span>
        </div>
        <div class="titulo espaco">
          <span class="fonte">
            <b>CLIENTE:</b>
            {{ clienteComprovante.cli_nome }} </span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span v-if="clienteComprovante.cli_exibe_limite === 1" class="fonte">
            <b>LIMITE DE CRÉDITO:</b>
            {{ clienteComprovante.cli_limite }}
          </span>
          <br />
          <span class="fonte">
            <b>REFERÊNCIA:</b>
            {{ clienteComprovante.cli_referencia }}
          </span>
        </div>
      </div>
      <hr />
      <div class="cupom">
        <b-table
          hover
          striped
          :items="itens"
          :fields="fieldsProdutos"
          class="fonte"
        >
          <template slot="actions"></template>
        </b-table>
      </div>
    </div>

    <b-modal ref="fechamento" title="Fechamento de venda" hide-footer>
      <div class="d-block">
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Pagamento:" label-for="venda-pagamento">
              <b-form-select
                id="venda-pagamento"
                :options="pagamento"
                v-model="venda.pagamento"
              />
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group
              label="Tipo de Pagamento:"
              label-for="venda-tipo-pagamento"
            >
              <b-form-select
                id="venda-pagamento"
                :options="tipo"
                v-model="venda.tipoPagamento"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Subtotal:" label-for="venda-subtotal">
          <money
            class="form-control"
            v-bind="money"
            v-model="total"
            disabled
          ></money>
        </b-form-group>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Desconto (R$):" label-for="venda-descontoReal">
              <money
                class="form-control"
                v-bind="money"
                v-model="venda.descontoReal"
                @keyup.native="calculaDesconto()"
              ></money>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group
              label="Desconto (%):"
              label-for="venda-descontoPorcentagem"
            >
              <money
                class="form-control"
                v-bind="money"
                v-model="venda.descontoPorcentagem"
                @keyup.native="calculaDesconto()"
              ></money>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group
              label="Acréscimo (R$):"
              label-for="venda-acrescimoReal"
            >
              <money
                class="form-control"
                v-bind="money"
                v-model="venda.acrescimoReal"
                @keyup.native="calculaAcrescimo()"
              ></money>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group
              label="Acréscimo (%):"
              label-for="venda-acrescimoPorcentagem"
            >
              <money
                class="form-control"
                v-bind="money"
                v-model="venda.acrescimoPorcentagem"
                @keyup.native="calculaAcrescimo()"
              ></money>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Valor Total:" label-for="venda-valorTotal">
          <money
            class="form-control"
            v-bind="money"
            v-model="venda.valorTotal"
            disabled
          ></money>
        </b-form-group>
      </div>
      <hr />
      <b-button
        variant="primary"
        class="ml-2 float-right"
        @click="save"
        :disabled="buttonFinalizar"
        >Finalizar</b-button
      >
      <b-button
        variant="danger"
        class="float-right"
        @click="hideModalFechamento"
        >Cancelar</b-button
      >
    </b-modal>
    <b-modal ref="saldo" title="Limite de Crédito" hide-footer>
      <h3 v-if="dadosLimiteCredito.bloqueado === 1" style="color: red">
        <b>CLIENTE BLOQUEADO</b>
      </h3>
      <br />
      <div class="d-block text-left">
        <p><b>Limite Mínimo:</b> R$ {{ dadosLimiteCredito.minimo }}</p>
        <p><b>Limite Máximo:</b> R$ {{ dadosLimiteCredito.maximo }}</p>
        <p><b>Saldo Devedor:</b> R$ {{ dadosLimiteCredito.saldo }}</p>
      </div>
      <hr />
      <b-button
        variant="primary"
        class="ml-2 float-right"
        @click="hideModalSaldo"
        >OK</b-button
      >
    </b-modal>
    <div v-show="showLoad" class="load">
      <div class="spin"></div>
      <div class="loading">CARREGANDO...</div>
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
import Bus from "../../config/bus";

Vue.use(money, { precision: 4 });

export default {
  name: "realizarVenda",
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
      venda: {},
      vendas: [],
      clientes: [],
      dadosCliente: [],
      dadosLimiteCredito: {},
      cliente: 0,
      clienteComprovante: {},
      vendedores: [],
      vendedor: 0,
      produtos: [],
      produto: [],
      itens: [],
      con_data: "",
      fields: [
        { key: "conit_produto", label: "Produto", sortable: true },
        { key: "conit_quantidade", label: "Qtde.", sortable: true },
        { key: "conit_preco_venda", label: "Valor Unitário", sortable: true },
        { key: "conit_desconto", label: "Desconto (R$)", sortable: true },
        { key: "conit_total", label: "Subtotal", sortable: true },
        { key: "actions", label: "Ações" },
      ],
      fieldsProdutos: [
        { key: "conit_produto", label: "Produto", sortable: true },
        { key: "conit_quantidade", label: "Qtde.", sortable: true },
        { key: "conit_preco_venda", label: "Valor Unitário", sortable: true },
      ],
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
      usuarioStorage: {},
      quantidade: 0.0,
      desconto: 0.0,
      total: 0.0,
      item: [],
      result: 0,
      showLoad: false,
      buttonFinalizar: false,
    };
  },
  methods: {
    loadNumeroVenda() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/configuracoes/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.venda.numero = res.data[0].conf_numero_venda;
      });
      document.getElementById("tabela").style.display = "none";
    },
    geraData: function () {
      var dataAtual = new Date();
      var dataFormatada =
        dataAtual.getDate() +
        "/" +
        (dataAtual.getMonth() + 1) +
        "/" +
        dataAtual.getFullYear();
      this.con_data = dataFormatada;
    },
    loadClientes() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosClientes/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.clientes = res.data.data.map((cliente) => {
          return { value: cliente.cli_id, text: cliente.cli_nome };
        });
      });
    },
    loadVendedores() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosUsuarios/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.vendedores = res.data.data.map((vendedor) => {
          return { value: vendedor.usu_id, text: vendedor.usu_nome };
        });
      });
    },
    buscaProdutoCodigoBarras() {
      let codigo = this.venda.codigoBarras;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/buscaProdutoCodigoBarras/${codigo}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.venda.produto = res.data.pro_id;
        this.produto.pro_id = res.data.pro_id;
        this.venda.nomeProduto = res.data.pro_nome;
        this.produto.pro_nome = res.data.pro_nome;
        this.venda.valorUnitario = res.data.pro_venda;
        this.venda.subtotal = 0;
      });
      this.$refs.venda_quantidade.focus();
      this.loadNumeroVenda();
    },
    loadProdutos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosProdutos/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.produtos = res.data.data.map((produto) => {
          return { value: produto.pro_id, text: produto.pro_nome };
        });
      });
      this.venda.quantidade = 1;
    },
    getProduto(id) {
      if (id !== undefined) {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const url = `${baseApiUrl}/produtos/${id}/${this.usuarioStorage.empresa}`;
        axios.get(url).then((res) => {
          this.produto = res.data;
        });
        this.venda.valorUnitario = this.produto.pro_venda;
        this.venda.subtotal = 0;
      }
    },
    getCliente(id) {
      if (id !== undefined) {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const url = `${baseApiUrl}/clientes/${id}/${this.usuarioStorage.empresa}`;
        axios.get(url).then((res) => {
          this.dadosCliente = res.data;
        });
      }
    },
    reset() {
      this.mode = "save";
      this.venda = {};
      this.clientes = [];
      this.dadosCliente = [];
      this.dadosLimiteCredito = {};
      this.vendedores = [];
      this.produto = [];
      this.produtos = [];
      this.itens = [];
      this.desconto = 0;
      this.quantidade = 0.0;
      this.total = 0.0;
      this.loadClientes();
      this.loadProdutos();
      this.loadNumeroVenda();
      this.loadVendedores();
    },
    async save() {
      this.showLoad = true;
      this.buttonFinalizar = true;
      const date = new Date();
      let hora = date.getHours() + ":" + date.getMinutes();
      var dVencimento = new Date();
      dVencimento.setDate(date.getDate() + 30);

      this.venda.diaPagamentoCliente = this.dadosCliente.cli_dia_pagamento;
      this.venda.data = this.con_data;
      this.venda.hora = hora;
      this.venda.dataVencimento = dVencimento;
      this.venda.status = 1;
      this.venda.usuario = this.usuarioStorage.id;
      this.venda.empresa = this.venda.empresa
        ? this.venda.empresa
        : this.usuarioStorage.empresa;
      this.venda.itens = this.itens;

      this.loadNumeroVenda();

      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const empresa = `/${this.usuarioStorage.empresa}`;
      const method = "post";

      const url = `${baseApiUrl}/verificaNumero/${this.venda.numero}/${this.usuarioStorage.empresa}`;
      await axios.get(url).then((res) => {
        this.result = res.data;
      });

      if (this.result === 0) {
        axios[method](`${baseApiUrl}/finalizaVenda${empresa}`, this.venda)
          .then(() => {
            this.showModal();
          })
          .catch(showError)
          .finally(
            () => ((this.showLoad = false), (this.buttonFinalizar = false))
          );
      } else {
        alert(
          "Este número de documento já existe!\nAltere o número em CONFIGURAÇÕES ou\nentre em contato com o suporte!"
        );
      }
    },
    addRegistro(venda) {
      if (venda.quantidade === undefined || venda.quantidade <= 0) {
        alert("A Quantidade do produto não foi informada ou está zerada!");
      } else if (
        this.produto.pro_nome === "" ||
        this.produto.pro_nome === null
      ) {
        alert("Erro ao adicionar o produto, tente novamente!");
      } else if (this.venda.valorUnitario === 0) {
        alert(
          "O valor do produto está zerado, corrija o cadastro ou tente novamente!"
        );
      } else {
        this.loadNumeroVenda();
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const empresa = this.venda.empresa
          ? this.venda.empresa
          : this.usuarioStorage.empresa;

        const dados = {
          con_id: this.venda.id,
          con_documento: this.venda.numero,
          pro_id: this.produto.pro_id,
          conit_produto: this.produto.pro_nome,
          conit_quantidade: this.venda.quantidade,
          conit_preco_venda: this.venda.valorUnitario.toFixed(2),
          conit_total:
            this.venda.quantidade * this.venda.valorUnitario.toFixed(2),
          emp_id: empresa,
        };
        dados.conit_total = dados.conit_total.toFixed(2);
        this.itens.push(dados);
        this.quantidade =
          Number(this.quantidade) + Number(this.venda.quantidade);
        this.total = Number(this.total) + Number(dados.conit_total);
        this.venda.codigoBarras = "";
        this.venda.quantidade = 0.0;
        this.venda.valorUnitario = 0.0;
        this.venda.descontoTotal = 0.0;
        this.venda.percentualDesconto = 0.0;
        this.venda.subtotal = 0.0;
        this.cliente = this.venda.cliente;
        this.vendedor = this.venda.vendedor;
        this.venda = {};
        this.produto = [];
        this.produtos = [];
        this.loadProdutos();
        if (venda.id === undefined) {
          this.loadNumeroVenda();
        } else {
          this.venda.id = dados.con_id;
          this.venda.numero = dados.con_documento;
        }
        this.venda.cliente = this.cliente;
        this.venda.vendedor = this.vendedor;
        this.venda.quantidade = 1;
        this.$refs.venda_codigo_barras.focus();
      }
    },
    removeRegistro(item) {
      this.loadNumeroVenda();
      var index = this.itens.indexOf(item);

      if (index > -1) {
        this.itens.splice(index, 1);
        this.quantidade =
          Number(this.quantidade) - Number(item.conit_quantidade);
        this.total = Number(this.total) - Number(item.conit_total);
        this.desconto = Number(this.desconto) - Number(item.conit_desconto);
      }
    },
    async changeItem(event) {
      await this.saldoCliente(event);
    },
    async saldoCliente(idCliente) {
      this.dadosLimiteCredito = {};
      const id = idCliente;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/limiteCreditoCliente/${id}/${this.usuarioStorage.empresa}`;
      await axios
        .get(url)
        .then((res) => {
          this.dadosLimiteCredito = res.data;
        })
        .catch(showError);

      if (
        this.dadosLimiteCredito.saldo >= this.dadosLimiteCredito.minimo ||
        this.dadosLimiteCredito.bloqueado === 1
      ) {
        this.showModalSaldo();
      }
    },
    showModalSaldo() {
      this.$refs["saldo"].show();
    },
    hideModalSaldo() {
      this.$refs["saldo"].hide();
    },
    showModal() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      var id = this.venda.cliente;
      const url = `${baseApiUrl}/clientes/${id}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.clienteComprovante = res.data;
      });
      this.$refs["comprovante"].show();
    },
    hideModal() {
      this.$refs["comprovante"].hide();
      this.$toasted.global.defaultSuccess();
      this.loadNumeroVenda();
      this.geraData();
      this.reset();
    },
    CriaPDF() {
      var minhaTabela = document.getElementById("tabela").innerHTML;

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

      this.hideModal();
    },
    showModalFechamento() {
      if (this.dadosLimiteCredito.bloqueado === 1) {
        alert("CLIENTE BLOQUEADO PARA VENDAS");
      } else {
        this.loadNumeroVenda();
        this.getCliente(this.venda.cliente);
        this.venda.valorTotal = this.total;
        this.$refs["fechamento"].show();
      }
    },
    hideModalFechamento() {
      this.$refs["fechamento"].hide();
    },
    calculaDesconto() {
      this.venda.valorTotal = this.total - this.venda.descontoReal;
      this.venda.valorTotal -=
        (this.venda.descontoPorcentagem / 100) * this.total;
    },
    calculaAcrescimo() {
      this.venda.valorTotal = this.total + this.venda.acrescimoReal;
      this.venda.valorTotal +=
        (this.venda.acrescimoPorcentagem / 100) * this.total;
    },
  },
  mounted() {
    Bus.$on("editar", (value) => {
      this.venda.id = value.data.con_id;
      this.venda.numero = value.data.con_documento;
      this.con_data = value.data.con_data;
      this.venda.cliente = value.data.cli_id;
      this.cliente = value.data.cli_id;
      this.venda.subtotal = 0.0;
      this.quantidade = Number(value.data.conit_quantidade);
      this.total = Number(value.data.con_total);
      this.desconto = Number(value.data.con_total_desconto);
      this.itens = value.itens;
    });
    this.loadNumeroVenda();
    this.loadClientes();
    this.loadProdutos();
    this.loadVendedores();
    this.geraData();
  },
  computed: {
    preencheValores() {
      return this.getProduto(this.venda.produto);
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
.totalizacao-value-quantidade {
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

.modal-active {
  display: block;
}

body {
  font-family: Arial;
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

thead td {
  border-bottom: 1px solid #000;
  font-weight: bold;
}

tfoot td {
  border-top: 1px solid #000;
  font-weight: bold;
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
