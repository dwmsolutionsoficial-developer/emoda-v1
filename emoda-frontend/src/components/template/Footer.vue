<template>
  <footer class="footer">
    <span style="padding-right: 20px"> <b>Versão:</b> 1.1.0 </span>
    <span>
      Copyright
      <strong>DWM Tecnologia</strong> © 2020/2021
    </span>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
.footer {
  grid-area: footer;
  background-color: #ddd;
  color: #333;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>
