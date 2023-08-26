<script setup>
import Mainlayout from '../../Layout/MainLayout.vue';

const currentPage = 'chat';
</script>

<template>
  <f7-page>
    <Mainlayout :currentPage="currentPage">
      Chat Centre
    </Mainlayout>
  </f7-page>
</template>