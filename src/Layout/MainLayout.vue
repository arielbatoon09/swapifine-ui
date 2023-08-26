<script setup>
import SidebarComponent from '../components/Sidebar.vue';
import { defineProps } from 'vue';
import SwapifineLogo from '../assets/swapifine-logo.png';
import DefaultProfile from '../assets/profile/default-profile.png';

const props = defineProps({
  currentPage: String
});
</script>

<template>
  <div class="flex">
    <!-- Sidebar-Menu-Desktop -->
    <SidebarComponent :currentPage="currentPage" />
    <!-- Main-Body -->
    <main class="flex-grow text-black lg:ml-8">
      <!-- Header -->
      <header class="bg-white shadow w-100 flex flex-row gap-4 justify-between items-center px-4 py-4 lg:pl-24 lg:pr-16 lg:py-4">
        <div class="flex flex-row items-center gap-2">
          <img :src="SwapifineLogo" width="48">
          <h2 class="text-xl font-medium text-gray-600">Swapifine</h2>
        </div>
        <!-- Profile-Display -->
        <div class="flex flex-row items-center gap-3">
          <f7-link href="/search" :ignore-cache="true"><f7-icon material="search"></f7-icon></f7-link>
          <img :src="DefaultProfile" class="profile-avatar">
        </div>
      </header>
      <!-- Main-Content -->
      <section class="px-4 py-4 lg:pl-24 lg:pr-16 lg:py-4">
        <slot />
      </section>
    </main>
    <!-- Add-Item-CTA -->
    <f7-fab position="right-bottom" text="Create" class="hidden lg:block px-12">
      <f7-icon ios="f7:plus" md="material:add"></f7-icon>
    </f7-fab>
    <!-- Footer-Menu-Mobile -->
    <nav class="footer-menu lg:hidden w-full bg-gray-900 text-white fixed bottom-0 left-0 p-4">
      Footer Menu for Mobile
    </nav>
  </div>
</template>
