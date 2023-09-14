<script setup>
import { f7 } from 'framework7-vue';
import { ref } from 'vue';
import { useAuthStore } from '../js/auth.store';
import SwapifineLogo from '../assets/swapifine-logo-text.png';
import TestProfile from '../assets/profile/test_profile.jpg';

const authStore = useAuthStore();
const toggleDropDown = ref(false);

// Redirection to Home Page
const goToHome = () => {
    f7.views.main.router.navigate('/home', {
        animate: false,
    });
};

// Logout Trigger
const handleLogout = async () => {
    try {
        await authStore.logout();
    } catch (error) {
        console.log("Error:", error);
    }
}
</script>
<template>
    <!-- Desktop Header -->
    <header class="hidden lg:block bg-white z-10 fixed w-full top-0 border-b border-gray-200 px-4 py-3">
        <div class="max-w-screen-2xl mx-auto flex flex-row justify-between items-center">
            <!-- Logo -->
            <div>
                <div @click="goToHome" class="cursor-pointer"><img :src="SwapifineLogo" alt="..."></div>
            </div>
            <!-- Global Search -->
            <div class="w-1/2 mx-8 relative flex">
                <input placeholder="What items are you looking for?" class="border rounded-l-md px-4 py-3 flex-1" />
                <div
                    class="absolute bg-gray-800 hover:bg-gray-700 cursor-pointer text-white rounded-r-md px-4 py-3 top-0 right-0 flex items-center h-full">
                    <svg class="text-white w-5 h-5 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
            </div>
            <!-- Navbar -->
            <nav class="flex flex-row items-center gap-6 relative">
                <!-- Orders and Buy Credits -->
                <div class="flex flex-row items-center gap-4">
                    <div class="cursor-pointer flex flex-row items-center gap-2 hover:bg-gray-100 py-2 px-3 rounded-lg">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                        </svg>
                        <span>Orders</span>
                    </div>
                    <div class="cursor-pointer flex flex-row items-center gap-2 hover:bg-gray-100 py-2 px-3 rounded-lg">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M11.905 1.316 15.633 6M18 10h-5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5m0-5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3m-6.367-9L7.905 1.316 2.352 6h9.281Z" />
                        </svg>
                        <span>Buy Credits</span>
                    </div>
                </div>
                <!-- Icons Menu -->
                <div class="nav-menu-icons flex flex-row items-center gap-2">
                    <!-- Notification -->
                    <div class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full relative">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 21">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z" />
                        </svg>
                        <!-- Alert Indication -->
                        <div class="absolute top-0 right-1">
                            <div class="w-3 h-3 bg-red-400 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                    <!-- Message -->
                    <div class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full relative">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                        </svg>
                        <!-- Alert Indication -->
                        <div class="absolute top-0 right-1">
                            <div class="w-3 h-3 bg-red-400 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                    <!-- Favorites -->
                    <div class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                        </svg>
                    </div>
                </div>
                <!-- Profile Dropdown -->
                <div class="relative">
                    <div @click="toggleDropDown = !toggleDropDown"
                        class="cursor-pointer hover:contrast-75 w-10 h-10 rounded-full overflow-hidden">
                        <img class="w-full h-full object-cover" :src="TestProfile" />
                    </div>
                    <!-- Online-Indicator -->
                    <div class="absolute bottom-0 right-0">
                        <div class="w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                </div>
                <div @click="handleLogout" class="bg-white border border-gray-200 radius shadow rounded py-4 px-12 absolute right-0 top-14"
                    v-show="toggleDropDown">
                    <div class="flex items-center gap-4 cursor-pointer">
                        <svg class="w-[14px] h-[14px] text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 15">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3" />
                        </svg>
                        <span>Logout</span>
                    </div>
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
                    <svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <!-- Hamburger -->
                <div @click="handleLogout"
                    class="cursor-pointer hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100 p-2 rounded-full">
                    <svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </div>
        </div>
    </div>
</header></template>