<script setup>
import Mainlayout from '../../Layout/AuthenticatedLayout.vue';

const currentPage = 'notification';
</script>

<template>
  <f7-page>
    <Mainlayout :currentPage="currentPage">
      Notification
    </Mainlayout>
  </f7-page>
</template>