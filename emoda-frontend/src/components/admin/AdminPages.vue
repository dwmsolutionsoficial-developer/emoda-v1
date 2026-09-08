<template>
  <div class="admin-pages">
    <PageTitle icon="fa fa-cogs" main="Administração do Sistema" sub="Cadastros & Cia" />
    <div class="admin-pages-tabs">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Configurações" active>
            <Configuracao />
          </b-tab>
          <b-tab title="Usuários">
            <UserAdmin />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Configuracao from "./Configuracao";
import UserAdmin from "./UserAdmin";

export default {
  name: "AdminPages",
  components: { PageTitle, Configuracao, UserAdmin }
};
</script>

<style>
</style>
