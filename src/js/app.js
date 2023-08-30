// Import Vue
import { createApp } from 'vue';
import { createPinia } from 'pinia';
// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Axios
import './axios';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.scss';
import '../css/welcome.scss';
import '../css/auth.scss';

// Styling for User Homepage
import '../css/sidebar.scss';
import '../css/footer.scss';
import '../css/homepage.scss';

// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);


// Register Framework7 Vue components
registerComponents(app);

// Disable strict mode
// app.config.productionTip = true;

// Mount the app
app.mount('#app');