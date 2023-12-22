// Import Vue
import { createApp } from 'vue';
import { createPinia } from 'pinia';
// Import Framework7
import Framework7 from 'framework7/lite-bundle';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Axios
import './axios';

// Styling
import '../css/main.scss';

// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.use(pinia);

// Register Framework7 Vue components
registerComponents(app);

// Disable strict mode
// app.config.productionTip = true;

// Mount the app
app.mount('#app');