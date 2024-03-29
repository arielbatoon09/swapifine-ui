<script setup>
import { reactive, onMounted, computed, watchEffect } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import { useInboxStore } from '../../js/inbox.store';
import { ref, push, onValue } from "firebase/database";
import firebasedb from '../../js/firebasedb.js';

const db = firebasedb;
const authStore = useAuthStore();
const inboxStore = useInboxStore();

const conversation = reactive({
    "message": null,
});

const initGetMsgData = async (stateMessageData) => {
    const messagesRef = ref(db, 'messages');
    const MsgInboxKey = stateMessageData.map(msg => msg.msg_inbox_key);

    const inboxResponse = await inboxStore.GetAllContacts();
    const origInboxData = inboxResponse.data;

    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            conversation.message = null;
            return;
        }

        const filteredMessages = Object.keys(data)
            .filter(key => data[key].msg_inbox_key === MsgInboxKey[0])
            .map(key => ({
                id: key,
                msg_inbox_key: data[key].msg_inbox_key,
                from_id: data[key].from_id,
                to_id: data[key].to_id,
                message: data[key].message,
                from_user_profile: data[key].from_user_profile,
                to_user_profile: data[key].to_user_profile,
                created_at: formatMsgCreatedAt(data[key].created_at),
            }));
        conversation.message = filteredMessages.reverse();
    });
};

// Calculate the created_at date to ago
const formatMsgCreatedAt = (created_at) => {
    const now = new Date();
    const messageTime = new Date(created_at);
    const timeDiffInSeconds = Math.floor((now - messageTime) / 1000);

    if (timeDiffInSeconds >= 86400) {
        const daysAgo = Math.floor(timeDiffInSeconds / 86400);
        return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    } else if (timeDiffInSeconds >= 3600) {
        const hoursAgo = Math.floor(timeDiffInSeconds / 3600);
        return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else if (timeDiffInSeconds >= 60) {
        const minutesAgo = Math.floor(timeDiffInSeconds / 60);
        return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        return `${timeDiffInSeconds} ${timeDiffInSeconds === 1 ? 'second' : 'seconds'} ago`;
    }
};

// On component mount, connect to Pusher
onMounted(() => {
    // 
});

watchEffect(() => {
    const stateMessageData = inboxStore.stateMessageData;

    if (stateMessageData && stateMessageData.length > 0) {
        initGetMsgData(stateMessageData);
    }
});
</script>

<template>
    <div class="h-screen flex flex-col-reverse overflow-y-auto p-4 pb-[13.5rem] sm:pb-[12rem] lg:pb-[12rem]">
        <!-- Conversation -->
        <div class="flex mb-4" :class="message.from_id == authStore.user?.id ? 'justify-end' : 'justify-start'"
            v-for="message in conversation.message" :key="message.key">
            <!-- <div v-show="message.from_id != authStore.user?.id"
                class="w-9 h-9 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <img :src="message.from_id !== authStore.user?.id ? message.to_user_profile : message.from_user_profile || 'fallback_image_url'" alt="User Avatar" class="w-8 h-8 rounded-full">
            </div> -->
            <div class="flex flex-col max-w-96 text-white rounded-lg p-3 gap-3 w-full md:w-[600px] lg:w-[500px]"
                :class="message.from_id == authStore.user?.id ? 'bg-clr-primary' : 'bg-gray-100'">
                <p class="break-all" :class="message.from_id == authStore.user?.id ? 'text-white' : 'text-gray-700'">{{
                    message.message }}</p>
                <div class="flex flex-row items-center gap-2">
                    <svg class="w-[14px] h-[14px] text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"
                            d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="text-gray-400">{{ message.created_at }}</span>
                </div>
            </div>
            <!-- <div v-show="message.from_id == authStore.user?.id"
                class="w-9 h-9 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                <img :src="message.from_id === authStore.user?.id ? message.from_user_profile : message.to_user_profile || 'fallback_image_url'" alt="My Avatar" class="w-8 h-8 rounded-full">
            </div> -->
        </div>
    </div>
</template>