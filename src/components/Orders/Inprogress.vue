<script setup>
import { ref } from 'vue';
import SampleProduct from '../../assets/products/sample2.jpg';

const list = ref([1, 2, 3]);
</script>


<template>
    <div class="mt-4">
        <!-- Refresh Button -->
        <div class="mb-2 flex gap-2 cursor-pointer">
            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
            </svg>
            <span class="text-clr-primary">Refresh List</span>
        </div>
        <!-- List -->
        <div class="flex flex-col gap-2">
            <div v-for="data in list" class="bg-white p-6 rounded border border-gray-200">
                <!-- Header -->
                <div class="flex flex-row justify-between items-start gap-2 border-b border-gray-200 pb-4">
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-1">
                            <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M3.308 9a2.257 2.257 0 0 0 2.25-2.264 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 1 0 4.5 0C19.058 5.471 16.956 1 16.956 1H3.045S1.058 5.654 1.058 6.736A2.373 2.373 0 0 0 3.308 9Zm0 0a2.243 2.243 0 0 0 1.866-1h.767a2.242 2.242 0 0 0 3.733 0h.767a2.242 2.242 0 0 0 3.733 0h.767a2.247 2.247 0 0 0 1.867 1A2.22 2.22 0 0 0 18 8.649V19H9v-7H5v7H2V8.524c.37.301.83.469 1.308.476ZM12 12h3v3h-3v-3Z" />
                            </svg>
                            <span class="text-base font-medium">Ariel Batoon</span>
                        </div>
                        <!-- View Store CTA -->
                        <div class="cursor-pointer bg-clr-primary flex justify-center items-center gap-2 py-1 px-2 rounded">
                            <svg class="w-[14px] h-[14px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                            </svg>
                            <span class="text-white">View Chat</span>
                        </div>
                    </div>
                    <span class="text-clr-primary text-base">In Progress</span>
                </div>
                <!-- Body -->
                <div class="mt-4 flex items-center gap-4 pb-6">
                    <div class="w-24 h-24 overflow-hidden rounded bg-gray-100 border border-gray-200">
                        <img class="h-full w-full object-cover object-center" :src="SampleProduct">
                    </div>
                    <div class="space-y-1">
                        <h2 class="text-base font-semibold">SUPER MEGA ART SET 168pcs.</h2>
                        <p><span class="font-medium">Category:</span> Electronics</p>
                        <p><span class="font-medium">Price:</span> ₱185.00</p>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex justify-end border-t py-4">
                    <div class="flex flex-row-reverse lg:flex-row gap-2 w-full lg:w-1/4">
                        <f7-button class="secondary-button" fill>Cancel</f7-button>
                        <f7-button class="primary-button" fill>Proceed</f7-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Show More Button -->
        <div class="mt-6 flex justify-center items-center">
            <div class="sm:w-1/3 md:w-1/4 lg:w-1/6">
                <f7-button class="secondary-button" fill>
                    <svg class="w-[14px] h-[14px] mr-2 text-clr-primary" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 1v16M1 9h16" />
                    </svg>
                    <span>Show More</span>
                </f7-button>
            </div>
        </div>
    </div>
</template>