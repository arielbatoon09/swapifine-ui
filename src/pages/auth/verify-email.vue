<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import SwapifineLogo from '../../assets/swapifine-logo.png';
import MailIllustration from '../../assets/mail_illustration.svg';

const authStore = useAuthStore();
const isRequest = ref(false);
const isLogoutRequest = ref(false);
const showSentMessage = ref(false);

const handleEmailVerification = async () => {
    try {
        // Init Loading Request
        isRequest.value = true;
        const response = await axios.post('api/email/verification-notification');
        console.log(response.data);
        // Cancel loading state if the response is true
        if (response.data.status == 'success') {
            isRequest.value = false;
            showSentMessage.value = true;
        }

    } catch (error) {
        console.error("Error", error);
    }

}

const handleLogout = async () => {
    try {
        // Init Loading Request
        isLogoutRequest.value = true;
        // Request Logout
        await authStore.logout();
        // Cancel loading state
        isLogoutRequest.value = false;
    } catch (error) {
        console.log("Error:", error);
    }
}

</script>

<template>
    <f7-page name="verify-email" class="auth-container">
        <div class="bg-gray-100 flex flex-col justify-center items-center min-h-screen">
            <img :src="SwapifineLogo" alt="Swapifine Logo" width="82" class="mb-6">
            <div
                class="bg-white rounded-lg shadow-md p-8 w-full w-full md:w-1/2 lg:w-1/4 flex flex-col justify-center items-center">
                <img :src="MailIllustration" class="mb-6" width="72">
                <div class="text-center">
                    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Verify Your Email Address</h1>
                    <hr class="my-4">
                    <p class="text-gray-600">To get started with Swapifine, please verify your email address by clicking the
                        link we just
                        emailed to you. If you didn't receive the email, we will gladly send you another.</p>
                </div>
                <f7-button preloader :loading="isRequest" @click="handleEmailVerification" large fill class="primary-button mt-6">
                    Resend Verification Email
                </f7-button>
                <f7-button preloader :loading="isLogoutRequest" @click="handleLogout" large class="mt-1 text-gray-700 hover:text-gray-600 hover:underline">Logout</f7-button>
                <p v-show="showSentMessage" class="mt-3 text-green-600">Sent another email verification link.</p>
                <p class="text-gray-600 text-center mt-4">Please note that <b class="text-clr-primary">unverified
                        accounts</b> will be deleted within 30
                    days.</p>
            </div>
        </div>
    </f7-page>
</template>