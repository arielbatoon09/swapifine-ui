<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../js/auth.store';
import SwapifineLogo from '../assets/swapifine-logo-text.png';
import DefaultProfile from '../assets/profile/default-profile.png';

const authStore = useAuthStore();
const dropdownProfile = ref(false);

const toggleDropdown = () => {
    dropdownProfile.value = !dropdownProfile.value;
};

// Redirection to other Page
const goToPage = (route) => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });

    dropdownProfile.value = false;
};

// Logout Trigger
const handleLogout = async () => {
    try {
        await authStore.logout();
    } catch (error) {
        console.log("Error:", error);
    }
};

</script>
<template>
    <!-- Desktop Header -->
    <header class="hidden lg:block bg-white z-10 fixed w-full top-0 border-b border-gray-200 px-4 py-3">
        <div class="max-w-screen-2xl mx-auto flex flex-row justify-between items-center">
            <!-- Logo -->
            <div>
                <div @click="goToPage('/home')" class="cursor-pointer"><img :src="SwapifineLogo" alt="..."></div>
            </div>
            <!-- Global Search -->
            <div class="w-1/2 mx-8 relative flex">
                <input placeholder="What items are you looking for?" class="border rounded-l-md px-4 py-3 flex-1" />
                <div
                    class="absolute bg-gray-800 hover:bg-gray-700 cursor-pointer text-white rounded-r-md px-4 py-3 top-0 right-0 flex items-center h-full">
                    <svg class="text-white w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
            </div>
            <!-- Navbar -->
            <nav class="flex flex-row items-center gap-6 relative">
                <!-- Orders Tracker & Post Item CTA -->
                <div class="flex gap-4">
                    <!-- Orders Tracker -->
                    <f7-button @click="goToPage('/order')" tooltip="Track your orders"
                        class="cursor-pointer flex flex-row whitespace-nowrap items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                        <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                        </svg>
                    </f7-button>
                    <!-- Checkout Tracker -->
                    <f7-button @click="goToPage('/checkout')" tooltip="Checkout"
                        class="cursor-pointer flex flex-row whitespace-nowrap items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                        <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                        </svg>
                    </f7-button>
                    <!-- Post Item -->
                    <f7-button tooltip="Post new item" @click="goToPage('/post/item')"
                        class="cursor-pointer flex flex-row whitespace-nowrap items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                        <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </f7-button>
                </div>
                <!-- Icons Menu -->
                <div class="nav-menu-icons flex flex-row items-center gap-2">
                    <!-- Notification -->
                    <f7-button tooltip="Notification"
                        class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full relative">
                        <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 16 21">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z" />
                        </svg>
                        <!-- Alert Indication -->
                        <div class="absolute top-0 right-2">
                            <div class="w-3 h-3 bg-red-400 border-2 border-white rounded-full"></div>
                        </div>
                    </f7-button>
                    <!-- Inbox Chat -->
                    <f7-button tooltip="Messages" @click="goToPage('/inbox')"
                        class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full relative">
                        <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 20 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                        </svg>
                        <!-- Alert Indication -->
                        <div class="absolute top-0 right-2">
                            <div class="w-3 h-3 bg-red-400 border-2 border-white rounded-full"></div>
                        </div>
                    </f7-button>
                    <!-- My Store -->
                    <f7-button tooltip="View Store" @click="goToPage('/store')"
                        class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full">
                        <svg class="w-[24px] h-[24px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            width="21" height="20" fill="none" viewBox="0 0 21 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M3.308 9a2.257 2.257 0 0 0 2.25-2.264 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 1 0 4.5 0C19.058 5.471 16.956 1 16.956 1H3.045S1.058 5.654 1.058 6.736A2.373 2.373 0 0 0 3.308 9Zm0 0a2.243 2.243 0 0 0 1.866-1h.767a2.242 2.242 0 0 0 3.733 0h.767a2.242 2.242 0 0 0 3.733 0h.767a2.247 2.247 0 0 0 1.867 1A2.22 2.22 0 0 0 18 8.649V19H9v-7H5v7H2V8.524c.37.301.83.469 1.308.476ZM12 12h3v3h-3v-3Z" />
                        </svg>
                    </f7-button>
                </div>

                <!-- Profile Dropdown -->
                <div class="relative">
                    <div @click="toggleDropdown"
                        class="cursor-pointer hover:contrast-75 w-10 h-10 rounded-full overflow-hidden">
                        <img class="w-full h-full object-cover" :src="authStore.user?.profile_img ? authStore.user?.profile_img : DefaultProfile" />
                    </div>
                    <!-- Online-Indicator -->
                    <div class="absolute bottom-0 right-0">
                        <div class="w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </div>
                <!-- Profile Dropdown menu -->
                <div v-if="dropdownProfile"
                    class="dropdown bg-white text-base z-50 list-none divide-gray-100 rounded shadow absolute right-0 top-14 w-[300px]">
                    <!-- Profile -->
                    <div class="flex flex-row items-center gap-3 border-b border-gray-200 py-6 px-5">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-full overflow-hidden">
                                <img class="w-full h-full object-cover" :src="authStore.user?.profile_img ? authStore.user?.profile_img : DefaultProfile" />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-base text-gray-700">{{ authStore.user?.fullname }}</span>
                            <span class="text-sm font-normal text-gray-600 break-all">{{ authStore.user?.email }}</span>
                        </div>
                    </div>
                    <ul class="flex flex-col gap-2 my-4 px-2">
                        <li @click="goToPage('/store')"
                            class="cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded px-4 py-2">
                            <svg class="w-[20px] h-[20px] text-gray-800" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M3.308 9a2.257 2.257 0 0 0 2.25-2.264 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 1 0 4.5 0C19.058 5.471 16.956 1 16.956 1H3.045S1.058 5.654 1.058 6.736A2.373 2.373 0 0 0 3.308 9Zm0 0a2.243 2.243 0 0 0 1.866-1h.767a2.242 2.242 0 0 0 3.733 0h.767a2.242 2.242 0 0 0 3.733 0h.767a2.247 2.247 0 0 0 1.867 1A2.22 2.22 0 0 0 18 8.649V19H9v-7H5v7H2V8.524c.37.301.83.469 1.308.476ZM12 12h3v3h-3v-3Z" />
                            </svg>
                            <span class="text-sm text-gray-700">My Store</span>
                        </li>
                        <li @click="goToPage('/buy-credits')"
                            class="cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded px-4 py-2">
                            <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M11.905 1.316 15.633 6M18 10h-5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5m0-5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3m-6.367-9L7.905 1.316 2.352 6h9.281Z" />
                            </svg>
                            <span class="text-sm text-gray-700">Buy Credits</span>
                        </li>
                        <li @click="goToPage('/settings')"
                            class="cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded px-4 py-2">
                            <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true" viewBox="0 0 20 18" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.5 8C5.80777 8 5.13108 7.79473 4.55551 7.41015C3.97993 7.02556 3.53133 6.47893 3.26642 5.83939C3.00152 5.19985 2.9322 4.49612 3.06725 3.81719C3.2023 3.13825 3.53564 2.51461 4.02513 2.02513C4.51461 1.53564 5.13825 1.2023 5.81719 1.06725C6.49612 0.932205 7.19985 1.00152 7.83939 1.26642C8.47893 1.53133 9.02556 1.97993 9.41015 2.55551C9.79473 3.13108 10 3.80777 10 4.5"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M6.5 17H1V15C1 13.9391 1.42143 12.9217 2.17157 12.1716C2.92172 11.4214 3.93913 11 5 11"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M19.5 11H18.38C18.2672 10.5081 18.0714 10.0391 17.801 9.613L18.601 8.818C18.6947 8.72424 18.7474 8.59708 18.7474 8.4645C18.7474 8.33192 18.6947 8.20476 18.601 8.111L17.894 7.404C17.8002 7.31026 17.6731 7.25761 17.5405 7.25761C17.4079 7.25761 17.2808 7.31026 17.187 7.404L16.392 8.204C15.9647 7.93136 15.4939 7.73384 15 7.62V6.5C15 6.36739 14.9473 6.24021 14.8536 6.14645C14.7598 6.05268 14.6326 6 14.5 6H13.5C13.3674 6 13.2402 6.05268 13.1464 6.14645C13.0527 6.24021 13 6.36739 13 6.5V7.62C12.5081 7.73283 12.0391 7.92863 11.613 8.199L10.818 7.404C10.7242 7.31026 10.5971 7.25761 10.4645 7.25761C10.3319 7.25761 10.2048 7.31026 10.111 7.404L9.404 8.111C9.31026 8.20476 9.25761 8.33192 9.25761 8.4645C9.25761 8.59708 9.31026 8.72424 9.404 8.818L10.204 9.618C9.9324 10.0422 9.73492 10.5096 9.62 11H8.5C8.36739 11 8.24021 11.0527 8.14645 11.1464C8.05268 11.2402 8 11.3674 8 11.5V12.5C8 12.6326 8.05268 12.7598 8.14645 12.8536C8.24021 12.9473 8.36739 13 8.5 13H9.62C9.73283 13.4919 9.92863 13.9609 10.199 14.387L9.404 15.182C9.31026 15.2758 9.25761 15.4029 9.25761 15.5355C9.25761 15.6681 9.31026 15.7952 9.404 15.889L10.111 16.596C10.2048 16.6897 10.3319 16.7424 10.4645 16.7424C10.5971 16.7424 10.7242 16.6897 10.818 16.596L11.618 15.796C12.0422 16.0676 12.5096 16.2651 13 16.38V17.5C13 17.6326 13.0527 17.7598 13.1464 17.8536C13.2402 17.9473 13.3674 18 13.5 18H14.5C14.6326 18 14.7598 17.9473 14.8536 17.8536C14.9473 17.7598 15 17.6326 15 17.5V16.38C15.4919 16.2672 15.9609 16.0714 16.387 15.801L17.182 16.601C17.2758 16.6947 17.4029 16.7474 17.5355 16.7474C17.6681 16.7474 17.7952 16.6947 17.889 16.601L18.596 15.894C18.6897 15.8002 18.7424 15.6731 18.7424 15.5405C18.7424 15.4079 18.6897 15.2808 18.596 15.187L17.796 14.392C18.0686 13.9647 18.2662 13.4939 18.38 13H19.5C19.6326 13 19.7598 12.9473 19.8536 12.8536C19.9473 12.7598 20 12.6326 20 12.5V11.5C20 11.3674 19.9473 11.2402 19.8536 11.1464C19.7598 11.0527 19.6326 11 19.5 11ZM14 14.5C13.5055 14.5 13.0222 14.3534 12.6111 14.0787C12.2 13.804 11.8795 13.4135 11.6903 12.9567C11.5011 12.4999 11.4516 11.9972 11.548 11.5123C11.6445 11.0273 11.8826 10.5819 12.2322 10.2322C12.5819 9.8826 13.0273 9.6445 13.5123 9.54804C13.9972 9.45157 14.4999 9.50108 14.9567 9.6903C15.4135 9.87952 15.804 10.2 16.0787 10.6111C16.3534 11.0222 16.5 11.5055 16.5 12C16.5 12.663 16.2366 13.2989 15.7678 13.7678C15.2989 14.2366 14.663 14.5 14 14.5Z"
                                    fill="currentColor" />
                            </svg>

                            <span class="text-sm text-gray-700">Settings</span>
                        </li>
                        <li @click="handleLogout"
                            class="cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded px-4 py-2">
                            <svg class="w-[14px] h-[14px] text-gray-800" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3" />
                            </svg>
                            <span class="text-sm text-gray-700">Sign out</span>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>

    <!-- Mobile Header -->
    <header class="inline-block lg:hidden bg-white z-10 fixed w-full top-0 border-b border-gray-200 px-2 py-3">
        <div class="max-w-screen-2xl mx-auto flex flex-row justify-between items-center">
            <!-- Logo -->
            <div>
                <a href="/"><img :src="SwapifineLogo" width="150"></a>
            </div>
            <!-- Menu Buttons -->
            <div class="flex flex-row items-center gap-1">
                <!-- Search -->
                <div class="cursor-pointer hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100 p-2 rounded-full">
                    <svg class="w-[24px] h-[24px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <!-- Hamburger -->
                <div @click="goToPage('/order')"
                    class="cursor-pointer hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100 p-2 rounded-full">
                    <svg class="w-[24px] h-[24px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </div>
            </div>
        </div>
    </header>
</template>