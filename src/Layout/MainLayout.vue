<script setup>
import { onMounted, defineProps } from 'vue';
import { f7 } from 'framework7-vue';
import { useAuthStore } from '../stores/auth';
import SidebarComponent from '../components/Sidebar.vue';
import FooterComponent from '../components/Footer.vue';
import SwapifineLogo from '../assets/swapifine-logo.png';
import DefaultProfile from '../assets/profile/default-profile.png';

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
  } catch (error) {
    console.log("Error", error);
  }
})



const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.log("Error:", error);
  }
}
</script>

<template>
  <div class="flex">
    <!-- Sidebar-Menu-Desktop -->
    <SidebarComponent :currentPage="currentPage" />
    <!-- Main-Body -->
    <main class="flex-grow text-black lg:ml-8">
      <!-- Header -->
      <header
        class="bg-white shadow w-100 flex flex-row gap-4 justify-between items-center px-4 py-4 lg:pl-14 lg:pr-6 lg:py-4">
        <div class="flex flex-row items-center gap-2">
          <img :src="SwapifineLogo" width="48">
          <h2 class="text-xl font-medium text-gray-600">Swapifine</h2>
        </div>
        <!-- Profile-Display -->
        <div class="flex flex-row items-center gap-3">
          <!-- Sample Name Return -->
          <h1>{{ authStore.user?.fullname }}</h1>
          <f7-link href="/search" :ignore-cache="true" class="hover:bg-gray-100 p-2 rounded-full"><f7-icon
              material="search"></f7-icon></f7-link>
          <img :src="DefaultProfile" class="profile-avatar">
          <f7-list-button class="list-none" @click="handleLogout">Logout</f7-list-button>
        </div>
      </header>
      <!-- Main-Content -->
      <section class="px-4 py-4 lg:pl-14 lg:pr-6 lg:py-4">
        <slot />
      </section>
    </main>
    <!-- Add-Item-CTA -->
    <f7-fab position="right-bottom" text="Add Item" class="hidden lg:block px-2">
      <f7-icon ios="f7:plus" md="material:add"></f7-icon>
    </f7-fab>
    <!-- Footer-Menu-Mobile -->
    <FooterComponent :currentPage="currentPage" />
  </div>
</template>
