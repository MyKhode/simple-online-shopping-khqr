import App from "./App.vue";
import router from "./router";
import { pinia } from "@/stores";
import VWave from "v-wave";
import { isDarkKey } from "./symbols";
import "./main.css";
import "@purge-icons/generated";
import { EventBusEvents } from "@vueuse/core";
import { createHead } from "@vueuse/head";



const app = createApp(App);
const head = createHead();
app.use

const isDark = useDark();
app.provide(isDarkKey, isDark);

app.use(router).use(pinia).use(VWave,{
    color: "rgb(255, 255, 255)",
}).use(head);
app.mount("#app");
