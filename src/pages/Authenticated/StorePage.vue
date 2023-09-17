<script setup>
import PrimaryLayout from '../../Layout/PrimaryLayout.vue';

const currentPage = 'store';
</script>

<template>
  <f7-page>
    <PrimaryLayout :currentPage="currentPage">
      Store Centre
    </PrimaryLayout>
  </f7-page>
</template>