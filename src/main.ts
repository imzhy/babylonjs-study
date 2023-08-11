import {createApp} from "vue";
import "./style.css";
import App from "./App.vue";
import router from "@router/Index";
import pinia from "@store/Index";

const vueApp = createApp(App);

vueApp.use(router);
vueApp.use(pinia);

vueApp.mount('#app')
