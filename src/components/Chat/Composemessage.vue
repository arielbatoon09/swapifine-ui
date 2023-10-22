<script setup>
import { reactive, onMounted, computed, watchEffect } from 'vue';
import { useInboxStore } from '../../js/inbox.store';
import { useAuthStore } from '../../js/auth.store';
import { ref, push } from "firebase/database";
import firebasedb from '../../js/firebasedb.js';

const authStore = useAuthStore();
const inboxStore = useInboxStore();
const db = firebasedb;
defineProps({
    showContact: Boolean,
});

const msgForm = reactive({
    "message": null,
});

const handleSendMessage = async () => {
    const { message } = msgForm;
    const messagesRef = ref(db, 'messages');
    const currentDateTime = new Date().toISOString();

    // Get State Message Data
    const stateMessageData = inboxStore.stateMessageData;

    const newMessage = {
        msg_inbox_key: stateMessageData[0].msg_inbox_key,
        from_id: authStore.user?.id,
        to_id: stateMessageData[0].to_user_id,
        message,
        created_at: currentDateTime,
    };

    if (msgForm.message != null && msgForm.message != '') {
        // Push to Firebase Real-time DB
        push(messagesRef, newMessage)
            .then(() => {
                msgForm.message = '';
            })
            .catch(error => {
                console.error('Error sending the message:', error);
            });

        // Save to main DB
        await inboxStore.ComposeMessage(newMessage);
    }
};

</script>

<template>
    <div class="bg-white border-t border-gray-300 p-4 absolute bottom-0"
        :class="showContact ? 'w-full lg:w-3/4' : 'w-full'">
        <div class="flex items-center">
            <!-- Add Image Attachment -->
            <div class="mr-4">
                <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 20 18">
                    <path fill="currentColor"
                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                </svg>
            </div>
            <!-- Add Message -->
            <input v-model="msgForm.message" @keydown.enter="handleSendMessage" placeholder="Type a message..."
                class="w-full p-2 rounded-full border border-gray-400 bg-gray-100" />
            <!-- Send Message Event -->
            <div class="ml-4 flex gap-2">
                <button @click="handleSendMessage" class="bg-clr-primary text-white px-4 py-2 rounded-md">Send</button>
            </div>
        </div>
    </div>
</template>