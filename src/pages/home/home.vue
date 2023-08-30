<script setup>
import Mainlayout from '../../Layout/MainLayout.vue';
const currentPage = 'home';

</script>

<template>
  <f7-page>
    <Mainlayout :currentPage="currentPage">
      Home Page
    </Mainlayout>
  </f7-page>
</template>