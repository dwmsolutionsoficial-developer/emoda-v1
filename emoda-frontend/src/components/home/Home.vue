<template>
  <div class="home">
    <PageTitle icon="fa fa-home" main="Menu Rápido" sub="E-Moda" />
    <div class="stats">
      <Stat title="Clientes" :value="cliente" icon="fa fa-user" color="#3282cd" />
      <Stat title="Consiginados" :value="consignado" icon="fa fa-shopping-bag" color="#D8BFD8" />
      <Stat title="Vendas" :value="venda" icon="fa fa-cart-plus" color="#66CDAA" />
    </div>
    <div class="stats">
      <Stat title="Contas à Receber" :value="receber" icon="fa fa-money" color="#228B22" />
      <Stat
        title="Documentos à Vencer"
        :value="clientesAVencer"
        icon="fa fa-vcard"
        color="#FF0000"
      />
      <Stat title="Caixa" :value="caixa" icon="fa fa-usd" color="#2E8B57" />
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Stat from "./Stat";
//import axios from "axios";
//import { baseApiUrl, userKey } from "@/global";

export default {
  name: "Home",
  components: { PageTitle, Stat },
  data: function () {
    return {
      stat: {},
      usuario: {},
      cliente: "/cliente",
      venda: "/realizarVenda",
      consignado: "/consignado",
      receber: "/receber",
      clientesAVencer: "/clientesAVencer",
      caixa: "/caixa",
    };
  },
};
</script>

<style>
.stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
}
</style>
