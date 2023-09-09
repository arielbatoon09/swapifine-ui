<script setup>
import { f7 } from 'framework7-vue';
import { useAuthStore } from '../js/auth.store';
import { onMounted, defineProps } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const authStore = useAuthStore();

const props = defineProps({
  currentPage: String
});



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
    <Header />
    <!-- Main Container -->
    <main class="max-w-screen-2xl mx-auto px-2 mt-24 lg:mt-32">
      <!-- Main Content -->
      <slot />
    </main>
    <!-- Footer Container -->
    <Footer />
  </div>
</template>
