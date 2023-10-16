<script setup>
import { ref, onMounted, computed } from 'vue';
import Pusher from 'pusher-js';

// Enable Pusher logging
Pusher.logToConsole = true;

// Create a ref to store messages
const messages = ref([]);
const arrangeMessages = computed(() => messages.value.slice().reverse());

// Create a Pusher instance
const pusher = new Pusher('c649434e9226714590b3', {
  cluster: 'ap1'
});

// Subscribe to the Pusher channel
const channel = pusher.subscribe('chat-channel');

// Bind to the event and update the messages ref
channel.bind('chat-event', (data) => {
  messages.value.push(data);
});

// On component mount, connect to Pusher
onMounted(() => {
  pusher.connect();
});
</script>

<template>
    <div class="h-screen flex flex-col-reverse overflow-y-auto p-4 pb-[13.5rem] sm:pb-[12rem] lg:pb-[12rem]">
        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4" v-for="message in arrangeMessages">
            <div class="flex flex-col max-w-96 bg-clr-primary text-white rounded-lg p-3 gap-3 w-full md:w-[600px] lg:w-[500px]">
                <p class="text-white break-all">{{ message }}</p>
                <div class="flex flex-row items-center gap-2">
                    <svg class="w-[14px] h-[14px] text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"
                            d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="text-gray-400">1 hr ago</span>
                </div>
            </div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar"
                    class="w-8 h-8 rounded-full">
            </div>
        </div>

        <!-- Incoming Message -->
        <div class="flex mb-4" v-for="message in arrangeMessages">
            <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                    class="w-8 h-8 rounded-full">
            </div>
            <div class="flex flex-col max-w-96 bg-gray-100 text-white rounded-lg p-3 gap-3 w-full md:w-[600px] lg:w-[500px]">
                <p class="text-gray-700 break-all">{{ message }}</p>
                <div class="flex flex-row items-center gap-2">
                    <svg class="w-[14px] h-[14px] text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"
                            d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="text-gray-400">1 min ago</span>
                </div>
            </div>
        </div>
    </div>
</template>