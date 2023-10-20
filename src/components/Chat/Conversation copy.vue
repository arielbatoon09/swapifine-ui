<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import { useInboxStore } from '../../js/inbox.store';
import { push, onValue } from "firebase/database";
import firebasedb from '../../js/firebasedb.js';

const db = firebasedb;
const authStore = useAuthStore();
const conversation = ref([]);

const initRender = async () => {

    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const messages = [];

        Object.keys(data).forEach(key => {
            messages.push({
                id: key,
                msg_inbox_key: data[key].msg_inbox_key,
                from_id: data[key].from_id,
                to_id: data[key].tod_id,
                message: data[key].message,
            })
        });
        // Set the data
        // conversation.value = messages;
    });
};

// Get Messages
// const GetChatMessages = computed(() => {

//     messages.value = inboxStore.stateMessage;
//     console.log(messages.value);

//     // return formatMsgCreatedAt(messages.value);
// });

// Format Msg Created At Date
const formatMsgCreatedAt = (messages) => {
    const now = new Date();

    return messages.map((message) => {
        const messageTime = new Date(message.created_at);
        const timeDiffInSeconds = Math.floor((now - messageTime) / 1000);

        if (timeDiffInSeconds >= 86400) {
            const daysAgo = Math.floor(timeDiffInSeconds / 86400);
            return {
                ...message,
                created_at: `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`,
            };
        } else if (timeDiffInSeconds >= 3600) {
            const hoursAgo = Math.floor(timeDiffInSeconds / 3600);
            return {
                ...message,
                created_at: `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`,
            };
        } else if (timeDiffInSeconds >= 60) {
            const minutesAgo = Math.floor(timeDiffInSeconds / 60);
            return {
                ...message,
                created_at: `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`,
            };
        } else {
            return {
                ...message,
                created_at: `${timeDiffInSeconds} ${timeDiffInSeconds === 1 ? 'second' : 'seconds'} ago`,
            };
        }
    });
};

// On component mount, connect to Pusher
onMounted(() => {
    initRender();
});
</script>

<template>
    <div class="h-screen flex flex-col-reverse overflow-y-auto p-4 pb-[13.5rem] sm:pb-[12rem] lg:pb-[12rem]">
        <!-- Conversation -->
        <div class="flex mb-4"
            :class="message.from_id == authStore.user?.id ? 'justify-end' : 'justify-start'"
            v-for="message in conversation">
            <div v-show="message.from_id != authStore.user?.id"
                class="w-9 h-9 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                    class="w-8 h-8 rounded-full">
            </div>
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
            <div v-show="message.from_id == authStore.user?.id"
                class="w-9 h-9 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar"
                    class="w-8 h-8 rounded-full">
            </div>
        </div>
    </div>
</template>