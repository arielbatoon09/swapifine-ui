<script setup>
import { onMounted, defineProps } from 'vue';
import { f7 } from 'framework7-vue';
import { useAuthStore } from '../js/auth.store';
import SidebarComponent from '../components/Sidebar.vue';
import FooterComponent from '../components/Footer.vue';
import SwapifineLogo from '../assets/swapifine-logo-text.png';

const authStore = useAuthStore();

const props = defineProps({
  currentPage: String
});

// Render Data
onMounted(async () => {
  try {
    await authStore.fetchUser();
    if(!authStore.isAuthenticated){
      f7.views.main.router.navigate('/');
    }

    if(authStore.user.email_verified_at == null) {
      f7.views.main.router.navigate('/verify-email');
    }

  } catch (error) {
    console.log("Error", error);
  }
});

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.log("Error:", error);
  }
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar-Menu-Desktop -->
    <SidebarComponent :currentPage="currentPage" />
    <!-- Main-Body -->
    <main class="w-full lg:w-5/6 ml-auto overflow-x-hidden">
      <!-- Header-For-Mobile -->
      <header class="flex lg:hidden bg-white shadow w-100 flex-row gap-4 justify-between items-center py-2 px-4">
        <img :src="SwapifineLogo" width="150" class="py-2">
        <div class="flex flex-row items-center gap-3">
          <!-- Sample Name Return -->
          <!-- <h1>{{ authStore.user?.fullname }}</h1> -->
          <f7-link href="/search" :ignore-cache="true" class="hover:bg-gray-100 rounded-full"><f7-icon
              material="search"></f7-icon>
            </f7-link>
        </div>
      </header>
      <!-- Main-Content -->
      <section class="py-2 px-4 lg:p-12">
        <slot />
      </section>
    </main>
    <!-- Footer-Menu-Mobile -->
    <FooterComponent :currentPage="currentPage" />
  </div>
</template>
