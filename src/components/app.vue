<template>
  <f7-app v-bind="f7params">

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/" ></f7-view>

  </f7-app>
</template>
<script>
import { onMounted } from 'vue';
import { f7, f7ready } from 'framework7-vue';

import routes from '../js/routes.js';
import store from '../js/store';

export default {
  setup() {

    // Framework7 Parameters
    const f7params = {
      name: 'Swapifine', // App name
      theme: 'auto', // Automatic theme detection
      colors: {
        primary: '#29abe2',
      },
      view: {
          // browserHistory: true,
          // browserHistorySeparator: '',
      },

      store: store,
      routes: routes,

      // Register service worker (only on production build)
      serviceWorker: process.env.NODE_ENV === 'production' ? {
        path: '/service-worker.js',
      } : {},
    };

    onMounted(() => {
      f7ready(() => {
      });
      // Code
    });

  return {
    f7params,
  }
}
  }
</script>