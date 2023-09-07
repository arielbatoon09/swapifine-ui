<script setup>
import Mainlayout from '../../Layout/AuthenticatedLayout.vue';

const currentPage = 'post';
</script>

<template>
  <f7-page>
    <Mainlayout :currentPage="currentPage">
      Add Item
    </Mainlayout>
  </f7-page>
</template>