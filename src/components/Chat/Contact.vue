<script setup>
import { f7 } from 'framework7-vue';
import { reactive, onMounted, computed, watchEffect } from 'vue';
import { ref, onValue } from "firebase/database";
import { useAuthStore } from '../../js/auth.store';
import { useInboxStore } from '../../js/inbox.store';
import SearchContact from './Search.vue';
import firebasedb from '../../js/firebasedb.js';

defineProps({
    showContact: Boolean,
});

const authStore = useAuthStore();
const inboxStore = useInboxStore();
const db = firebasedb;
const inboxData = reactive({ "datas": null });
const hasMessages = reactive({ bool: false });

const conversation = reactive({
    "message": null,
});

const initGetMsgData = async () => {
    const inboxResponse = await inboxStore.GetAllContacts();
    inboxData.datas = inboxResponse.data;
    const origInboxData = inboxData.datas;

    const messagesRef = ref(db, 'messages');
    const messages = [];

    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            conversation.message = null;
            return;
        }

        Object.keys(data).forEach(key => {
            messages.push({
                id: key,
                msg_inbox_key: data[key].msg_inbox_key,
                from_id: data[key].from_id,
                to_id: data[key].to_id,
                message: data[key].message,
            });
        });

        if (origInboxData.length < 0) {
            messages.forEach(msg => {
                const matchingInbox = origInboxData.find(inbox => inbox.msg_inbox_key === msg.msg_inbox_key);

                if (matchingInbox) {
                    const latestMessage = msg.message;
                    matchingInbox.latest_message = latestMessage;
                }
            });
        }
    });
};

// const arrangeInbox = computed(() => inboxData.data.slice().reverse());
const arrangeInbox = computed(() => inboxData.datas);

const doHandleUpdateIsReadStatus = async (msg_inbox_key, id, auth_id, read_by_sender, read_by_receiver) => {
    // Set State for Inbox Key
    inboxStore.SetMsgInboxKey(msg_inbox_key);

    // Store state
    await inboxStore.GetChatDetails(id);

    if (read_by_sender == 0 || read_by_receiver == 0) {
        await inboxStore.UpdateIsReadStatus(id, auth_id);

        // Re-render the inbox data
        const inboxResponse = await inboxStore.GetAllContacts();
        inboxData.datas = inboxResponse.data;
    }
};

const goToPage = (route) => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

onMounted(async () => {
    initGetMsgData();
});

watchEffect(async () => {
    const inboxResponse = await inboxStore.GetAllContacts();
    if (inboxResponse.status != 'error') {
        inboxData.datas = inboxResponse.data;
        hasMessages.bool = true;
    } else {
        hasMessages.bool = 'empty';
    }
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
            <div v-if="hasMessages.bool && hasMessages.bool != 'empty'" v-for="inbox in arrangeInbox"
                @click="doHandleUpdateIsReadStatus(inbox.msg_inbox_key, inbox.id, authStore.user?.id, inbox.read_by_sender, inbox.read_by_receiver)"
                class="flex items-center mb-2 cursor-pointer p-2 rounded-md relative"
                :class="inbox.read_by_sender === 0 ? 'bg-sky-50 hover:bg-sky-100' : 'hover:bg-gray-100'">
                <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img :src="inbox.img_thumbnail" alt="User Avatar" class="w-12 h-12 rounded-full">
                </div>
                <div class="flex-1 truncate">
                    <h2 class="text-lg font-semibold truncate pr-8">{{ authStore.user?.fullname == inbox.from_user_fullname
                        ? inbox.to_user_fullname : inbox.from_user_fullname }} • {{ inbox.item_name }}</h2>
                    <p class="text-gray-600 truncate">{{ inbox.latest_message }}</p>
                </div>
                <!-- Is Read Indicator -->
                <div v-show="inbox.read_by_sender == 0" class="absolute top-6 right-2">
                    <div class="w-3 h-3 bg-cyan-700 rounded-full"></div>
                </div>
            </div>

            <div v-else v-show="hasMessages.bool != 'empty'" class="flex flex-col items-center justify-center">
                <f7-preloader />
                <p class="mt-2">Loading...</p>
            </div>

            <div class="flex justify-center" v-show="hasMessages.bool == 'empty'">
                <p>No Chat List Found.</p>
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
                <div @click="doHandleUpdateIsReadStatus(inbox.id, inbox.is_read)" v-for="inbox in arrangeInbox"
                    class="panel-close flex items-center mb-2 cursor-pointer p-2 rounded-md relative"
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