<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, computed } from 'vue';
import { useInboxStore } from '../../js/inbox.store';
import SearchContact from './Search.vue';

defineProps({
    showContact: Boolean,
});

const inboxStore = useInboxStore();
const inboxData = ref([]);

const initRender = async () => {

    // Get All Inbox Contact List
    const inboxResponse = await inboxStore.GetAllContacts();
    inboxData.value = inboxResponse;
    console.log(inboxData.value);
};

const doHandleUpdateIsReadStatus = async (id, is_read) => {
    if (is_read == 0) {
        const response = await inboxStore.UpdateIsReadStatus(id);
        console.log(response);
        
    }
};

const isReadState = computed(() => {
  return inboxData.value.map((item) => {
    item.is_read = item.is_read === 0;
    return item;
  });
});


const goToPage = (route) => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

onMounted(async () => {
    initRender();
});
</script>

<template>
    <div v-show="showContact" class="w-1/4 bg-white border-r border-gray-300">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
            <!-- Go To Home -->
            <svg @click="goToPage('/')" class="cursor-pointer w-6 h-6 text-white" aria-hidden="true"
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
            <div @click="doHandleUpdateIsReadStatus(inbox.id, inbox.is_read)" v-for="inbox in inboxData"
                class="flex items-center mb-2 cursor-pointer p-2 rounded-md relative"
                :class="!inbox.is_read ? 'bg-sky-50 hover:bg-sky-100' : 'hover:bg-gray-100'">
                <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img :src="inbox.img_thumbnail" alt="User Avatar" class="w-12 h-12 rounded-full">
                </div>
                <div class="flex-1 truncate">
                    <h2 class="text-lg font-semibold truncate pr-8">{{ inbox.fullname }} • {{ inbox.item_name }}</h2>
                    <p class="text-gray-600 truncate">{{ inbox.latest_message }}</p>
                </div>
                <!-- Is Read Indicator -->
                <div v-show="!inbox.is_read" class="absolute top-6 right-2">
                    <div class="w-3 h-3 bg-cyan-700 rounded-full"></div>
                </div>
            </div>
        </div>

        <!-- Contact List Mobile -->
        <f7-panel id="panel-nested" left cover container-el="#panel-page" class="w-full">
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
                <f7-link @click="goToPage('/')" panel-close>
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
                <div v-for="inbox in inboxData" class="flex items-center mb-2 cursor-pointer p-2 rounded-md relative"
                    :class="inbox.is_read == 0 ? 'bg-sky-50 hover:bg-sky-100' : 'hover:bg-gray-100'">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img :src="inbox.img_thumbnail" alt="User Avatar" class="w-12 h-12 rounded-full">
                    </div>
                    <div class="flex-1 truncate">
                        <h2 class="text-lg font-semibold truncate pr-8">{{ inbox.item_name }}</h2>
                        <p class="text-gray-600 truncate">{{ inbox.latest_message }}</p>
                    </div>
                    <!-- Is Read Indicator -->
                    <div v-show="inbox.is_read == 0" class="absolute top-6 right-2">
                        <div class="w-3 h-3 bg-cyan-700 rounded-full"></div>
                    </div>
                </div>
            </div>
        </f7-panel>
    </div>
</template>

<style scoped lang="scss"></style>