<script setup>
import PrimaryLayout from '../../Layout/PrimaryLayout.vue';

const currentPage = 'chat';
</script>

<template>
  <f7-page>
    <PrimaryLayout :currentPage="currentPage">
      Chat Centre
    </PrimaryLayout>
  </f7-page>
</template>