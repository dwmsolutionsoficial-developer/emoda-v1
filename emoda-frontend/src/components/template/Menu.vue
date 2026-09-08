<template>
  <aside class="menu" v-show="isMenuVisible">
    <div class="sidebar">
      <router-link to="/"> <i class="fa fa-fw fa-home"></i> Home </router-link>
      <button class="dropdown-btn">
        <i class="fa fa-fw fa-folder-open"></i> Cadastros
        <i class="fa fa-fw fa-caret-down"></i>
      </button>
      <div class="dropdown-container">
        <router-link to="/banco" id="bancoId">
          <i class="fa fa-fw fa-bank"></i> Bancos
        </router-link>
        <router-link to="/grupo" id="grupoId">
          <i class="fa fa-fw fa-cubes"></i> Grupos
        </router-link>
        <router-link to="/marca" id="marcaId">
          <i class="fa fa-fw fa-tag"></i> Marcas
        </router-link>
        <router-link to="/cor" id="corId">
          <i class="fa fa-fw fa-paint-brush"></i> Cores
        </router-link>
        <router-link to="/tamanho" id="tamanhoId">
          <i class="fa fa-fw fa-sort-numeric-asc"></i> Tamanhos
        </router-link>
        <router-link to="/unidade" id="unidadeId">
          <i class="fa fa-fw fa-underline"></i> Unidades
        </router-link>
        <router-link to="/cliente" id="clienteId">
          <i class="fa fa-fw fa-user"></i> Clientes
        </router-link>
        <router-link to="/fornecedor" id="fornecedorId">
          <i class="fa fa-fw fa-truck"></i> Fornecedores
        </router-link>
        <router-link to="/produto" id="produtoId">
          <i class="fa fa-fw fa-product-hunt"></i> Produtos
        </router-link>
      </div>
      <button class="dropdown-btn">
        <i class="fa fa-usd fa-money"></i> Financeiro
        <i class="fa fa-fw fa-caret-down"></i>
      </button>
      <div class="dropdown-container">
        <router-link to="/caixa" id="caixaId">
          <i class="fa fa-fw fa-usd"></i> Controle de Caixa
        </router-link>
        <router-link to="/clientesAVencer" id="clientesVencerId">
          <i class="fa fa-fw fa-address-card-o"></i> Documentos à Vencer
        </router-link>
      </div>
      <button class="dropdown-btn">
        <i class="fa fa-folder-open"></i> Crediário
        <i class="fa fa-fw fa-caret-down"></i>
      </button>
      <div class="dropdown-container">
        <!--
        <router-link to="/grupo">
          <i class="fa fa-fw fa-minus-circle"></i>Contas a Pagar
        </router-link>
        -->
        <router-link to="/receber" id="receberId">
          <i class="fa fa-fw fa-plus-circle"></i> Contas a Receber
        </router-link>
      </div>
      <router-link to="/consignado" id="consignadoId">
        <i class="fa fa-fw fa-shopping-bag"></i> Consignado
      </router-link>
      <!--
      <button class="dropdown-btn">
        <i class="fa fa-shopping-cart"></i> Compras
        <i class="fa fa-fw fa-caret-down"></i>
      </button>
      <div class="dropdown-container">
        <router-link to="/realizarCompra" id="compraId">
          <i class="fa fa-fw fa-cubes"></i> Entrada de Mercadorias
        </router-link>
        <router-link to="/listarCompras" id="listarComprasId">
          <i class="fa fa-fw fa-list-alt"></i> Listar Entradas
        </router-link>
      </div>
      -->
      <button class="dropdown-btn">
        <i class="fa fa-usd fa-cart-arrow-down"></i> Vendas
        <i class="fa fa-fw fa-caret-down"></i>
      </button>
      <div class="dropdown-container">
        <router-link to="/realizarVenda" id="vendasId">
          <i class="fa fa-fw fa-usd"></i> Realizar Venda
        </router-link>
        <router-link to="/listarVendas" id="listarVendasId">
          <i class="fa fa-fw fa-list-alt"></i> Listar de Vendas
        </router-link>
      </div>
      <router-link to="/devolucao" id="devolucoesId">
        <i class="fa fa-fw fa-undo"></i> Devoluções
      </router-link>
      <router-link to="/relatorio" id="relatoriosId">
        <i class="fa fa-fw fa-list-alt"></i> Relatórios
      </router-link>
    </div>
  </aside>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";

export default {
  name: "Menu",
  computed: mapState(["isMenuVisible"]),
  methods: {
    carregaDropDown() {
      var dropdown = document.getElementsByClassName("dropdown-btn");
      var i;

      for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function () {
          this.classList.toggle("active");
          var dropdownContent = this.nextElementSibling;
          if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
          } else {
            dropdownContent.style.display = "block";
          }
        });
      }
    },
    carregaAcessosUsuario() {
      var usuarioStorage = JSON.parse(localStorage.getItem(userKey));

      if (usuarioStorage.exibeBanco === 0) {
        document.getElementById("bancoId").style.display = "none";
      }
      if (usuarioStorage.exibeGrupo === 0) {
        document.getElementById("grupoId").style.display = "none";
      }
      if (usuarioStorage.exibeCaixa === 0) {
        document.getElementById("caixaId").style.display = "none";
      }
      if (usuarioStorage.exibeCliente === 0) {
        document.getElementById("clienteId").style.display = "none";
      }
      if (usuarioStorage.exibeClientesVencer === 0) {
        document.getElementById("clientesVencerId").style.display = "none";
      }
      if (usuarioStorage.exibeConsignado === 0) {
        document.getElementById("consignadoId").style.display = "none";
      }
      if (usuarioStorage.exibeCor === 0) {
        document.getElementById("corId").style.display = "none";
      }
      if (usuarioStorage.exibeFornecedor === 0) {
        document.getElementById("fornecedorId").style.display = "none";
      }
      if (usuarioStorage.exibeMarca === 0) {
        document.getElementById("marcaId").style.display = "none";
      }
      if (usuarioStorage.exibeProduto === 0) {
        document.getElementById("produtoId").style.display = "none";
      }
      if (usuarioStorage.exibeReceber === 0) {
        document.getElementById("receberId").style.display = "none";
      }
      if (usuarioStorage.exibeRelatorios === 0) {
        document.getElementById("relatoriosId").style.display = "none";
      }
      if (usuarioStorage.exibeTamanho === 0) {
        document.getElementById("tamanhoId").style.display = "none";
      }
      if (usuarioStorage.exibeUnidade === 0) {
        document.getElementById("unidadeId").style.display = "none";
      }
      if (usuarioStorage.exibeVendas === 0) {
        document.getElementById("vendasId").style.display = "none";
        document.getElementById("listarVendasId").style.display = "none";
      }
      if (usuarioStorage.exibeDevolucoes === 0) {
        document.getElementById("devolucoesId").style.display = "none";
      }
    },
  },
  mounted() {
    if (this.$mq === "xs" || this.$mq === "sm") {
      this.$store.commit("toggleMenu", false);
    }
    this.carregaDropDown();
    this.carregaAcessosUsuario();
  },
};
</script>

<style>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, #232526, #414345);

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.sidebar {
  margin: 0;
  padding: 0;
  width: 295px;
  text-decoration: none;
  position: fixed;
  height: 100%;
  overflow: auto;
}

/* Sidebar links */
.sidebar a {
  display: block;
  color: #ffffff;
  padding: 16px;
  text-decoration: none;
}

/* Links on mouse-over */
.sidebar a:hover {
  background-color: #ffffff;
  color: #1e396e;
  text-decoration: none;
}

.sidebar .dropdown-btn {
  padding: 16px;
  text-decoration: none;
  color: #ffffff;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
}

.dropdown-btn:hover {
  padding: 16px;
  background-color: #ffffff;
  color: #1e396e;
  text-decoration: none;
}

.dropdown-container {
  display: none;
  padding-left: 10px;
}

@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar a {
    float: left;
  }
  div.content {
    margin-left: 0;
  }
}

/* On screens that are less than 400px, display the bar vertically, instead of horizontally */
@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: left;
    float: none;
  }
}
</style>
