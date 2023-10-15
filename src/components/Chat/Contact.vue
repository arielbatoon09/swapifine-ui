<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, computed } from 'vue';
import SearchContact from './Search.vue';

defineProps({
    showContact: Boolean,
});

const goBack = () => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.back({ animate: animate });
};

</script>

<template>
    <div v-show="showContact" class="w-1/4 bg-white border-r border-gray-300">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
            <!-- Go To Home -->
            <svg @click="goBack" class="cursor-pointer w-6 h-6 text-white" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9" />
            </svg>
            <!-- Header -->
            <h1 class="text-2xl font-semibold text-center -ml-14">Inbox</h1>
            <span></span>
        </div>

        <!-- Contact List Desktop -->
        <div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
            <!-- Search Contact -->
            <SearchContact />

            <!-- Contact List -->
            <div class="flex items-center mb-4 cursor-pointer p-2 rounded-md bg-sky-50 relative">
                <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                        class="w-12 h-12 rounded-full">
                </div>
                <div class="flex-1 truncate">
                    <h2 class="text-lg font-semibold">Ariel Batoon</h2>
                    <p class="text-gray-600 truncate">Hoorayy!!</p>
                </div>
                <!-- Is Read Indicator -->
                <div class="absolute top-6 right-2">
                    <div class="w-3 h-3 bg-cyan-700 rounded-full"></div>
                </div>
            </div>

            <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md relative">
                <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                        class="w-12 h-12 rounded-full">
                </div>
                <div class="flex-1 truncate">
                    <h2 class="text-lg font-semibold">Ariel Batoon</h2>
                    <p class="text-gray-600 truncate">Hoorayy!!</p>
                </div>
            </div>
        </div>

        <!-- Contact List Mobile -->
        <f7-panel id="panel-nested" left cover container-el="#panel-page" class="">
            <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
                <!-- Close Side Panel -->
                <f7-link panel-close>
                    <svg class="cursor-pointer w-[24px] h-[24px] text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                </f7-link>
                <!-- Header -->
                <h1 class="text-xl font-semibold text-center -ml-8">Inbox</h1>
                <!-- Go Back Home -->
                <f7-link back panel-close>
                    <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9" />
                    </svg>
                </f7-link>
            </div>
            <div class="overflow-y-auto h-screen p-3 mb-9 pb-20">

                <!-- Search Contact -->
                <SearchContact />

                <!-- Contact List -->
                <div class="flex items-center my-2 cursor-pointer p-2 rounded-md bg-sky-50 relative">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                            class="w-12 h-12 rounded-full">
                    </div>
                    <div class="flex-1 truncate">
                        <h2 class="text-lg font-semibold">Ariel Batoon</h2>
                        <p class="text-gray-600 truncate">Hoorayy!!</p>
                    </div>
                    <!-- Is Read Indicator -->
                    <div class="absolute top-6 right-2">
                        <div class="w-3 h-3 bg-cyan-700 rounded-full"></div>
                    </div>
                </div>

                <div class="flex items-center my-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md relative">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                            class="w-12 h-12 rounded-full">
                    </div>
                    <div class="flex-1 truncate">
                        <h2 class="text-lg font-semibold">Ariel Batoon</h2>
                        <p class="text-gray-600 truncate">Hoorayy!!</p>
                    </div>
                </div>                
            </div>
        </f7-panel>
    </div>
</template>

<style scoped lang="scss"></style>