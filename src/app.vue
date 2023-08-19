<!-- app.vue -->
<template>
    <f7-app v-bind="f7params">
      <!-- Current View/Router, initial page will be loaded from home.vue component -->
      <f7-view main url="/"></f7-view>
    </f7-app>
  </template>
  
  <script>
    /* Import pages components */
    import WelcomePage from 'welcome.vue'
  
    /*
    Now we need to map components to routes.
    We need to pass them along with the F7 app parameters to <f7-app> component
    */
  
    export default {
      data() {
        return {
          // app params
          f7params: {
            name: 'Swapifine',
            // specify routes for app
            routes: [
              {
                path: '/welcome',
                component: WelcomePage,
              },
              // ...
            ],
            // ...
          }
        };
      },
    }
  </script>