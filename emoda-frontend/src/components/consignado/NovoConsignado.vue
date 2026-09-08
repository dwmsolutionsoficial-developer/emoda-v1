<template id="consignadoNovo">
  <div class="consignado-novo">
    <b-form>
      <b-button
        variant="primary"
        v-if="mode === 'save'"
        @click="save"
        :disabled="buttonSalvar"
        >Salvar</b-button
      >
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
      <hr />
      <input id="con_id" type="hidden" v-model="consignado.id" />
      <b-row>
        <b-col md="2" sm="12">
          <b-form-group label="Número:" label-for="consignado-numero">
            <b-form-input
              id="consignado-numero"
              type="number"
              v-model="consignado.numero"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Data:" label-for="consignado-data">
            <b-form-input
              id="consignado-data"
              type="text"
              v-model="con_data"
              disabled
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Cliente:" label-for="consignado-cliente">
            <model-select
              ref="refCliente"
              class="form-control"
              :options="clientes"
              v-model="consignado.cliente"
              placeholder="Selecione"
              @input="changeItem($event)"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group label="Vendedor:" label-for="consignado-vendedor">
            <model-select
              class="form-control"
              :options="vendedores"
              v-model="consignado.vendedor"
              placeholder="Selecione"
            ></model-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group
            label="Cód. de Barras:"
            label-for="consignado-codigo-barras"
          >
            <input
              ref="consignado_codigo_barras"
              class="form-control"
              id="consignado-codigo-barras"
              v-model="consignado.codigoBarras"
              type="text"
              placeholder="Informe o Código de Barras."
              v-on:keyup.enter="buscaProdutoCodigoBarras()"
            />
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Produto:" label-for="consignado-produto">
            <model-select
              class="form-control"
              :options="produtos"
              v-model="consignado.produto"
              placeholder="Selecione"
              v-bind:class="preencheValores"
            ></model-select>
          </b-form-group>
        </b-col>
        <b-col md="2" sm="12">
          <b-form-group label="Qtde.:" label-for="consignado-quantidade">
            <input
              ref="consignado_quantidade"
              type="number"
              class="form-control"
              v-model="consignado.quantidade"
              v-on:keyup.enter="addRegistro(consignado)"
            />
          </b-form-group>
        </b-col>
        <b-col md="3" sm="12">
          <b-form-group
            label="Valor Unitário:"
            label-for="consignado-valor-unitario"
          >
            <money
              class="form-control"
              v-bind="money"
              v-model="consignado.valorUnitario"
              disabled
            ></money>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <b-form-group label="Desconto (R$):" label-for="consignado-desconto">
            <money
              class="form-control"
              v-bind="money"
              v-model="consignado.desconto"
              v-on:keyup.enter="addRegistro(consignado)"
            ></money>
          </b-form-group>
        </b-col>
        <!--
        <b-col md="4" sm="12">
          <b-form-group label="Subtotal:" label-for="consignado-subtotal">
            <money class="form-control" v-bind="money" v-model="consignado.subtotal" disabled></money>
          </b-form-group>
        </b-col>
        -->
        <b-col md="2" sm="12">
          <b-form-group label=" " label-for="consignado-adicionar">
            <b-button variant="success" @click="addRegistro(consignado)"
              >Adicionar</b-button
            >
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <b-table hover striped :items="itens" :fields="fields">
      <template slot="actions" slot-scope="data">
        <!--
        <b-button variant="warning" @click="loadconsignado(data.item)" class="mr-2">
          <i class="fa fa-pencil"></i>
        </b-button>
        -->
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
          <h2>Total de Descontos:</h2>
        </div>
        <div class="totalizacao-info">
          <span class="totalizacao-value-debito">{{
            desconto === undefined ? 0.0 : desconto.toFixed(2)
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

    <b-modal ref="comprovante" title="Impressão de Consignado" hide-footer>
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

    <b-modal ref="saldo" title="Limite de Crédito" hide-footer>
      <h3 v-if="dadosCliente.bloqueado === 1" style="color: red">
        <b>CLIENTE BLOQUEADO</b>
      </h3>
      <br />
      <div class="d-block text-left">
        <p><b>Limite Mínimo:</b> R$ {{ dadosCliente.minimo }}</p>
        <p><b>Limite Máximo:</b> R$ {{ dadosCliente.maximo }}</p>
        <p><b>Saldo Devedor:</b> R$ {{ dadosCliente.saldo }}</p>
      </div>
      <hr />
      <b-button
        variant="primary"
        class="ml-2 float-right"
        @click="hideModalSaldo"
        >OK</b-button
      >
    </b-modal>

    <div id="tabela" class="cupom-fiscal">
      <div class="cabecario">
        <h2>{{ usuarioStorage.nome_empresa }}</h2>
        <hr />
        <div class="espaco">
          <span class="fonte">
            <b>NÚMERO DE VENDA:</b>
            &nbsp;{{ consignado.numero }} </span
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
  name: "novoConsignado",
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
      consignados: [],
      clientes: [],
      dadosCliente: {},
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
      usuarioStorage: {},
      quantidade: 0.0,
      desconto: 0.0,
      total: 0.0,
      item: [],
      result: 0,
      showLoad: false,
      buttonSalvar: false,
    };
  },
  methods: {
    loadConsignados() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/consignadosAbertos/${this.usuarioStorage.empresa}?page=${this.page}`;
      axios.get(url).then((res) => {
        this.consignados = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    loadNumeroVenda() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/configuracoes/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.consignado.numero = res.data[0].conf_numero_venda;
      });
      document.getElementById("tabela").style.display = "none";
    },
    reset() {
      this.mode = "save";
      this.consignado = {};
      this.clientes = [];
      this.dadosCliente = {};
      this.vendedores = [];
      this.produto = [];
      this.produtos = [];
      this.itens = [];
      this.desconto = 0;
      this.quantidade = 0.0;
      this.total = 0.0;
      this.result = 0;
      this.loadClientes();
      this.loadProdutos();
      this.loadNumeroVenda();
      this.loadVendedores();
    },
    async save() {
      if (this.dadosCliente.bloqueado === 1) {
        alert("CLIENTE BLOQUEADO PARA VENDAS");
      } else {
        this.showLoad = true;
        this.buttonSalvar = true;
        const dados = {
          documento: "",
          data: "",
          cliente: 0,
          vendedor: 0,
          total: 0.0,
          totalDesconto: 0.0,
          status: 0.0,
          usuario: 0,
          empresa: 0,
          itens: [],
        };

        this.loadNumeroVenda();

        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const empresa = this.consignado.empresa
          ? `/${this.consignado.empresa}`
          : `/${this.usuarioStorage.empresa}`;
        const method = this.consignado.id ? "put" : "post";

        dados.documento = this.consignado.numero;
        dados.data = this.con_data;
        dados.cliente = this.cliente;
        dados.vendedor = this.vendedor;
        dados.total = this.total;
        dados.totalDesconto = this.desconto;
        dados.status = 0;
        dados.usuario = this.usuarioStorage.id;
        dados.empresa = this.consignado.empresa
          ? this.consignado.empresa
          : this.usuarioStorage.empresa;
        dados.itens = { ...this.itens };

        const id = this.consignado.id ? `/${this.consignado.id}` : "";

        const url = `${baseApiUrl}/verificaNumero/${this.consignado.numero}/${this.usuarioStorage.empresa}`;
        await axios.get(url).then((res) => {
          this.result = res.data;
        });

        if (this.result === 0) {
          axios[method](`${baseApiUrl}/consignados${id}${empresa}`, dados)
            .then(() => {
              this.showModal();
            })
            .catch(showError)
            .finally(
              () => ((this.showLoad = false), (this.buttonSalvar = false))
            );
          this.loadProdutos();
        } else {
          alert(
            "Este número de documento já existe!\nAltere o número em CONFIGURAÇÕES ou\nentre em contato com o suporte!"
          );
        }
      }
    },
    remove(consignado) {
      const id = consignado.con_id;
      axios
        .delete(
          `${baseApiUrl}/consignadosAbertos/${id}/${this.usuarioStorage.empresa}`
        )
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadConsignados();
          this.reset();
        })
        .catch(showError);
    },
    loadconsignado(consignado, mode = "save") {
      this.mode = mode;
      const dados = {
        id: consignado.con_id,
        data: this.stringToDate(consignado.con_data),
        credito_debito: consignado.con_cred_deb,
        descricao: consignado.con_descricao,
        valor: consignado.con_valor,
        empresa: consignado.emp_id,
      };
      this.consignado = { ...dados };
    },
    stringToDate(value) {
      if (value.length >= 9) {
        let parts = value.split("/");
        let date = parts[2] + "-" + parts[1] + "-" + parts[0];
        return date;
      }
    },
    getProduto(id) {
      if (id !== undefined) {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const url = `${baseApiUrl}/produtos/${id}/${this.usuarioStorage.empresa}`;
        axios.get(url).then((res) => {
          this.produto = res.data;
        });
        this.consignado.valorUnitario = this.produto.pro_venda;
        this.consignado.subtotal = 0;
      }
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
    buscaCliente(id) {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/clientes/${id}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.dadosCliente = res.data;
      });
    },
    loadProdutos() {
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/todosProdutos/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.produtos = res.data.data.map((produto) => {
          return { value: produto.pro_id, text: produto.pro_nome };
        });
      });
      this.consignado.quantidade = 1;
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
    addRegistro(consignado) {
      if (consignado.quantidade === undefined || consignado.quantidade <= 0) {
        alert("A Quantidade do produto não foi informada ou está zerada!");
      } else if (
        this.produto.pro_nome === "" ||
        this.produto.pro_nome === null
      ) {
        alert("Erro ao adicionar o produto, tente novamente!");
      } else if (this.consignado.valorUnitario === 0) {
        alert(
          "O valor do produto está zerado, corrija o cadastro ou tente novamente!"
        );
      } else {
        this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
        const empresa = this.consignado.empresa
          ? this.consignado.empresa
          : this.usuarioStorage.empresa;

        const dados = {
          con_id: this.consignado.id,
          con_documento: this.consignado.numero,
          pro_id: this.produto.pro_id,
          conit_produto: this.produto.pro_nome,
          conit_quantidade: this.consignado.quantidade,
          conit_preco_venda: this.consignado.valorUnitario.toFixed(2),
          conit_desconto: this.consignado.desconto.toFixed(2),
          conit_total:
            this.consignado.quantidade *
              this.consignado.valorUnitario.toFixed(2) -
            this.consignado.desconto.toFixed(2),
          emp_id: empresa,
        };
        dados.conit_total = dados.conit_total.toFixed(2);
        this.itens.push(dados);
        this.quantidade =
          Number(this.quantidade) + Number(this.consignado.quantidade);
        this.total = Number(this.total) + Number(dados.conit_total);
        this.desconto =
          Number(this.desconto) + Number(this.consignado.desconto.toFixed(2));
        this.consignado.codigoBarras = "";
        this.consignado.quantidade = 0.0;
        this.consignado.valorUnitario = 0.0;
        this.consignado.desconto = 0.0;
        this.consignado.subtotal = 0.0;
        this.cliente = this.consignado.cliente;
        this.vendedor = this.consignado.vendedor;
        this.consignado = {};
        this.produto = [];
        this.produtos = [];
        this.loadProdutos();
        if (consignado.id === undefined) {
          this.loadNumeroVenda();
        } else {
          this.consignado.id = dados.con_id;
          this.consignado.numero = dados.con_documento;
        }
        this.consignado.cliente = this.cliente;
        this.consignado.vendedor = this.vendedor;
        this.consignado.quantidade = 1;
        this.$refs.consignado_codigo_barras.focus();
      }
      this.loadNumeroVenda();
    },
    removeRegistro(item) {
      var index = this.itens.indexOf(item);

      if (index > -1) {
        this.itens.splice(index, 1);
        this.quantidade =
          Number(this.quantidade) - Number(item.conit_quantidade);
        this.total = Number(this.total) - Number(item.conit_total);
        this.desconto = Number(this.desconto) - Number(item.conit_desconto);
      }
      this.loadNumeroVenda();
    },
    buscaProdutoCodigoBarras() {
      let codigo = this.consignado.codigoBarras;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/buscaProdutoCodigoBarras/${codigo}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.consignado.produto = res.data.pro_id;
        this.produto.pro_id = res.data.pro_id;
        this.consignado.nomeProduto = res.data.pro_nome;
        this.produto.pro_nome = res.data.pro_nome;
        this.consignado.valorUnitario = res.data.pro_venda;
        this.consignado.subtotal = 0;
      });
      this.$refs.consignado_quantidade.focus();
    },
    async changeItem(event) {
      this.buscaCliente(event);
      await this.saldoCliente(event);
    },
    async saldoCliente(idCliente) {
      this.dadosCliente = {};
      const id = idCliente;
      this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
      const url = `${baseApiUrl}/limiteCreditoCliente/${id}/${this.usuarioStorage.empresa}`;
      await axios
        .get(url)
        .then((res) => {
          this.dadosCliente = res.data;
        })
        .catch(showError);

      if (
        this.dadosCliente.saldo >= this.dadosCliente.minimo ||
        this.dadosCliente.bloqueado === 1
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
      var id = this.consignado.cliente;
      const url = `${baseApiUrl}/clientes/${id}/${this.usuarioStorage.empresa}`;
      axios.get(url).then((res) => {
        this.clienteComprovante = res.data;
      });
      this.$refs["comprovante"].show();
    },
    hideModal() {
      this.$refs["comprovante"].hide();
      this.$toasted.global.defaultSuccess();
      this.reset();
      this.loadNumeroVenda();
      this.geraData();
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
  },
  mounted() {
    Bus.$on("editar", (value) => {
      this.consignado.id = value.data.con_id;
      this.consignado.numero = value.data.con_documento;
      this.con_data = value.data.con_data;
      this.consignado.cliente = value.data.cli_id;
      this.cliente = value.data.cli_id;
      this.consignado.subtotal = 0.0;
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
      return this.getProduto(this.consignado.produto);
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
