<script setup>
import Mainlayout from '../../Layout/MainLayout.vue';

const currentPage = 'post-item';
</script>

<template>
  <f7-page>
    <Mainlayout :currentPage="currentPage">
      Add Item
    </Mainlayout>
  </f7-page>
</template>