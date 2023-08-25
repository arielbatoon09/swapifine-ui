<script setup>

</script>

<template>
  <div class="flex">
    <!-- Sidebar-menu -->
    <aside class="sidebar hidden lg:block w-24 bg-gray-200 fixed h-full">
      Sidebar
    </aside>
    <!-- Main-Body -->
    <main class="flex-grow bg-white lg:ml-28">
      <slot />
    </main>
    <!-- Footer-Menu -->
    <nav class="footer-menu lg:hidden w-full bg-gray-900 text-white fixed bottom-0 left-0">
      Footer Nav
    </nav>
  </div>
</template>