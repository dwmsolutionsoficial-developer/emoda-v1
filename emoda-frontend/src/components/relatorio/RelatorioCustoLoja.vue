<template>
  <div class="stats">
    <div class="stat">
      <div class="stat-icon">
        <i :class="'fa fa-cart-plus'" :style="styleEstoque"></i>
      </div>
      <div class="stat-info">
        <span class="stat-title">QUANTIDADE EM ESTOQUE</span>
      </div>
      <div class="stat-info">
        <span class="stat-title">{{ estoque }}</span>
      </div>
    </div>
    <div class="stat">
      <div class="stat-icon">
        <i :class="'fa fa-money'" :style="styleCusto"></i>
      </div>
      <div class="stat-info">
        <span class="stat-title">VALOR DO ESTOQUE</span>
      </div>
      <div class="stat-info">
        <span class="stat-title">{{ numberToReal(custo) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "RelatorioCustoLoja",
  data: function () {
    return {
      estoque: 0,
      custo: 0,
      usuarioStorage: {},
    };
  },
  computed: {
    styleEstoque() {
      return "color: " + "#3282cd";
    },
    styleCusto() {
      return "color: " + "#228B22";
    },
  },
  created() {
    this.usuarioStorage = JSON.parse(localStorage.getItem(userKey));
    this.getCustoLoja();
  },
  methods: {
    getCustoLoja() {
      const url = `${baseApiUrl}/valorEstoque/${this.usuarioStorage.empresa}`;
      axios
        .get(url)
        .then((res) => {
          this.estoque = res.data.totalEstoque;
          this.custo = res.data.valorTotalEstoque;
        })
        .catch(showError);
    },
    numberToReal(numero) {
      var num = numero.toFixed(2).split(".");
      num[0] = "R$ " + num[0].split(/(?=(?:...)*$)/).join(".");
      return num.join(",");
    },
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

.stat {
  flex: 1;
  display: flex;
  border-radius: 8px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  display: flex;
  align-items: center;
}

.stat-icon i {
  font-size: 3rem;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-title {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 3rem;
}
</style>
