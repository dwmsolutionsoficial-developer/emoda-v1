import Vue from "vue";

export const userKey = "__emoda_usuario";
// Definida em tempo de build (Vue CLI): VUE_APP_API_URL.
// Sem a variável, cai no backend local de desenvolvimento.
export const baseApiUrl =
  process.env.VUE_APP_API_URL || "http://localhost:4000";

export function showError(e) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultError({ msg: e.response.data });
  } else if (typeof e === "string") {
    Vue.toasted.global.defaultError({ msg: e });
  } else {
    Vue.toasted.global.defaultError();
  }
}

export function stringToDate(value) {
  if (value.length >= 9) {
    let parts = value.split("/");
    let date = parts[2] + "-" + parts[1] + "-" + parts[0];
    return date;
  }
}

export default { baseApiUrl, showError, userKey, stringToDate };
