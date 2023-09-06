<script setup>
import Mainlayout from '../../Layout/MainLayout.vue';
const currentPage = 'home';

</script>

<template>
  <f7-page>
    <Mainlayout :currentPage="currentPage">
      <h1 class="font-bold ">Welcome to Swapifine</h1>
      <f7-searchbar></f7-searchbar>
      <h2>Recent View</h2>
    </Mainlayout>
  </f7-page>
</template>