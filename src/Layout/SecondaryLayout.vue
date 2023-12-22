<script setup>
import { f7 } from 'framework7-vue';
import { useAuthStore } from '../js/auth.store';
import { onMounted } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const authStore = useAuthStore();


// Render Data
onMounted(async () => {
  try {
    await authStore.fetchUser();

    if (!authStore.isAuthenticated) {
      f7.views.main.router.navigate('/');
    }

    if (authStore.user.email_verified_at == null) {
      f7.views.main.router.navigate('/verify-email');
    }


  } catch (error) {
    console.log("Error", error);
  }
});
</script>

<template>
  <div class="wrapper-layout">
    <!-- Header Container -->
    <div class="hidden lg:block">
      <Header />
    </div>
    <!-- Back Header for Mobile -->
    <div class="flex lg:hidden bg-white z-10 fixed w-full top-0 border-b border-gray-200 px-2">
      <div class="max-w-screen-2xl flex items-center w-full py-2">
        <f7-link back class="border border-gray-200 rounded-md hover:bg-gray-10 p-2">
          <svg class="w-[16px] h-[16px] text-gray-700" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </f7-link>
        <!-- Dynamic Header Title -->
        <div class="flex-1 flex justify-center relative -left-5">
          <slot name="header-title"></slot>
        </div>
      </div>
    </div>
    <!-- Main Container -->
    <main class="max-w-screen-2xl mx-auto px-2 mt-24 lg:mt-32">
      <!-- Main Content -->
      <slot />
    </main>
    <!-- Footer Container -->
    <Footer />
  </div>
</template>
