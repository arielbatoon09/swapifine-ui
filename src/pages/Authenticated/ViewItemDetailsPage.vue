<script setup>
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';

</script>

<template>
    <f7-page class="itemdetails-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Browse Items</h1>
            </template>
            <h1>Hello View</h1>
        </SecondaryLayout>
    </f7-page>
</template>