<script setup>
import PrimaryLayout from '../../Layout/PrimaryLayout.vue';

const currentPage = 'notification';
</script>

<template>
  <f7-page>
    <PrimaryLayout :currentPage="currentPage">
      Notification
    </PrimaryLayout>
  </f7-page>
</template>