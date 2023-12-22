<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../js/auth.store';
import GlobalSearchModal from './GlobalSearchModal.vue';
import SwapifineLogo from '../assets/swapifine-logo-text.png';
import DefaultProfile from '../assets/profile/default-profile.png';
import database from '../js/firestore';
import { collection, query, orderBy, where, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const authStore = useAuthStore();
const dropdownProfile = ref(false);
const dropdownNotification = ref(false);
const db = database;
const notifData = ref([]);
const notifCTAFilter = ref('all');

const toggleDropdown = () => {
    dropdownProfile.value = !dropdownProfile.value;
};

const toggleDropdownNotif = () => {
    dropdownNotification.value = !dropdownNotification.value;
};

const renderNotificationData = async () => {
    try {
        const notificationRef = collection(db, 'notification');

        const notificationQuery = query(
            notificationRef,
            where('notified_to_id', '==', authStore.user?.id),
            orderBy('created_at', 'desc')
        );

        onSnapshot(notificationQuery, (querySnapshot) => {
            const listData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                notified_by_fullname: doc.data().notified_by_fullname,
                message: doc.data().message,
                is_read: doc.data().is_read,
                type: doc.data().type,
                created_at: doc.data().created_at ? formatMsgCreatedAt(doc.data().created_at.toDate()) : ' ',
            }));

            notifData.value = listData;
        });

    } catch (error) {
        console.error('Error fetching notification data:', error);
    }
};


// Update Notification Record
const updateNotificatioNIsRead = async (id) => {
    const dataQuery = doc(db, 'notification', id);

    const snapshot = await getDoc(dataQuery);

    if (snapshot.exists()) {
        const currentStatus = snapshot.data().is_read;

        // Toggle the status
        const newStatus = !currentStatus;

        const newData = {
            is_read: newStatus
        };

        await updateDoc(dataQuery, newData);

    }
};

const updateNotificationIsReadFalse = async (id) => {
    const dataQuery = doc(db, 'notification', id);
    const newData = {
        is_read: true
    };

    await updateDoc(dataQuery, newData);
};

const deleteNotificationData = async (id) => {
    const querryData = doc(db, 'notification', id);
    deleteDoc(querryData);
};

const renderNotifFilter = computed(() => {
    if (!notifCTAFilter.value === 'all') {
        return notifData.value;
    }
    const filteredData = notifData.value.filter(item => {
        if (notifCTAFilter.value === 'all') {
            return true;
        } else if (notifCTAFilter.value === 'unread') {
            return !item.is_read;
        } else {
            return item.is_read === notifCTAFilter.value;
        }
    });

    return filteredData;
});

const notifFilter = (filter) => {
    notifCTAFilter.value = filter;
};

// Identify where to route the user
const identifyRedirection = (notif_type) => {
    const animate = window.innerWidth <= 1023;
    let route = null;

    if (notif_type === 'inbox') {
        route = '/inbox'
    } else if (notif_type === 'transaction') {
        route = '/order'
    }

    f7.views.main.router.navigate(route, {
        animate: animate,
    });

    dropdownNotification.value = false;
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

// Calculate the created_at date to ago
const formatMsgCreatedAt = (created_at) => {
    const now = new Date();
    const messageTime = new Date(created_at);

    // Check if created_at is a valid date
    if (isNaN(messageTime.getTime())) {
        return 'Invalid date';
    }

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

onMounted(() => {
    renderNotificationData();
});
</script>
<template>
    <!-- Desktop Header -->
    <header class="hidden lg:block bg-white z-10 fixed w-full top-0 border-b border-gray-200 px-4 py-3">
        <div class="max-w-screen-2xl mx-auto flex flex-row justify-between items-center">
            <!-- Logo -->
            <div>
                <div @click="goToPage('/')" class="cursor-pointer"><img :src="SwapifineLogo" alt="..."></div>
            </div>

            <!-- Desktop Global Search Component -->
            <GlobalSearchModal />

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
                    <f7-button @click="goToPage('/checkout')" tooltip="Credits Transaction"
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
                    <f7-button tooltip="Notification" @click="toggleDropdownNotif"
                        class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full relative">
                        <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 16 21">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z" />
                        </svg>

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
                        <img class="w-full h-full object-cover"
                            :src="authStore.user?.profile_img ? authStore.user?.profile_img : DefaultProfile" />
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
                                <img class="w-full h-full object-cover"
                                    :src="authStore.user?.profile_img ? authStore.user?.profile_img : DefaultProfile" />
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

                <!-- Notification Dropdown -->
                <div v-if="dropdownNotification"
                    class="bg-white text-base z-50 list-none divide-gray-100 rounded shadow absolute right-0 top-14 w-[400px] max-h-[500px] overflow-y-auto px-4 py-6">
                    <h3 class="text-gray-800 font-semibold text-2xl">Notifications</h3>

                    <!-- Filter Button -->
                    <div v-if="notifData.length > 0" class="flex gap-2 items-center my-4">
                        <f7-button @click="notifFilter('all')"
                            :class="notifCTAFilter === 'all' ? 'border bg-clr-primary text-white hover:text-white' : 'border'">All</f7-button>
                        <f7-button @click="notifFilter('unread')"
                            :class="notifCTAFilter === 'unread' ? 'border bg-clr-primary text-white hover:text-white' : 'border'">Unread</f7-button>
                    </div>

                    <!-- List of Notification -->
                    <ul class="flex flex-col gap-1">
                        <li @click="updateNotificationIsReadFalse(notif.id)" v-if="notifData.length > 0"
                            v-for="notif in renderNotifFilter" :key="notif.id"
                            :class="notif.is_read ? 'bg-white hover:bg-gray-100' : 'bg-blue-50 hover:bg-gray-100'"
                            class="cursor-pointer flex items-center gap-4 py-3 px-2 rounded -ml-2 border-b">
                            <div class="p-2 bg-clr-primary rounded-full">
                                <svg v-if="notif.type === 'inbox'" class="w-[20px] h-[20px] text-white" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path
                                        d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                                    <path
                                        d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                                </svg>

                                <svg v-if="notif.type === 'transaction'" class="w-[20px] h-[20px] text-white"
                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                                </svg>
                            </div>
                            <div>
                                <p>
                                    <span class="font-semibold text-clr-primary">{{ notif.notified_by_fullname }}</span> 
                                    <span class="ml-1 hover:underline" @click="identifyRedirection(notif.type)">{{ notif.message }}</span>
                                </p>
                                <p class="text-sm text-gray-600">{{ notif.created_at }}</p>

                                <!-- Notification Action -->
                                <div class="flex gap-2 mt-2">
                                    <p @click="updateNotificationIsReadFalse(notif.id)" v-if="!notif.is_read"
                                        class="text-sm text-gray-500 hover:text-cyan-900">Read</p>
                                    <p @click="deleteNotificationData(notif.id)"
                                        class="text-sm text-gray-500 hover:text-cyan-900">Remove</p>
                                </div>
                            </div>
                        </li>

                        <li v-else class="cursor-pointer flex items-center gap-4 hover:bg-gray-100 py-3 px-2 rounded -ml-2">
                            No Notification
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>

    <!-- Mobile Header -->
    <header class="inline-block lg:hidden bg-white z-10 fixed w-full top-0 border-b border-gray-200 px-2 py-3">
        <div class="max-w-screen-2xl mx-auto flex flex-row justify-between items-center relative">
            <!-- Logo -->
            <div>
                <a href="/"><img :src="SwapifineLogo" width="150"></a>
            </div>
            <!-- Menu Buttons -->
            <div class="flex flex-row items-center gap-1">
                <f7-button tooltip="Notification" @click="toggleDropdownNotif"
                    class="nav-menu-icon-item cursor-pointer hover:bg-gray-100 p-2 rounded-full relative">
                    <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 16 21">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z" />
                    </svg>

                    <div class="absolute top-0 right-2">
                        <div class="w-3 h-3 bg-red-400 border-2 border-white rounded-full"></div>
                    </div>
                </f7-button>

                <!-- Search -->
                <div @click="goToPage('/search')"
                    class="cursor-pointer hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100 p-2 rounded-full">
                    <svg class="w-[24px] h-[24px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <!-- Hamburger -->
                <f7-button panel-open="#panel-menu"
                    class="cursor-pointer hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100 p-2 rounded-full">
                    <svg class="w-[24px] h-[24px] text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </f7-button>

                <f7-panel id="panel-menu" left cover container-el="#panel-page">
                    <f7-page class="bg-white">
                        <f7-block strong-ios outline-ios>
                            <img class="mb-5" :src="SwapifineLogo" />

                            <!-- Profile -->
                            <div class="flex flex-row items-center gap-3 border-b border-t border-gray-200 py-6">
                                <div class="relative">
                                    <div class="w-10 h-10 rounded-full overflow-hidden">
                                        <img class="w-full h-full object-cover"
                                            :src="authStore.user?.profile_img ? authStore.user?.profile_img : DefaultProfile" />
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-base text-gray-700">{{ authStore.user?.fullname }}</span>
                                    <span class="text-sm font-normal text-gray-600 break-all truncate w-40">{{
                                        authStore.user?.email
                                    }}</span>
                                </div>
                            </div>

                            <div>
                                <ul class="flex flex-col gap-2 mt-4">
                                    <li @click="goToPage('/post/item')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[20px] h-[20px] text-clr-primary" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span class="text-md text-clr-primary">Post New Item</span>
                                    </li>
                                    <li @click="goToPage('/store')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none"
                                            viewBox="0 0 21 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M3.308 9a2.257 2.257 0 0 0 2.25-2.264 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 1 0 4.5 0C19.058 5.471 16.956 1 16.956 1H3.045S1.058 5.654 1.058 6.736A2.373 2.373 0 0 0 3.308 9Zm0 0a2.243 2.243 0 0 0 1.866-1h.767a2.242 2.242 0 0 0 3.733 0h.767a2.242 2.242 0 0 0 3.733 0h.767a2.247 2.247 0 0 0 1.867 1A2.22 2.22 0 0 0 18 8.649V19H9v-7H5v7H2V8.524c.37.301.83.469 1.308.476ZM12 12h3v3h-3v-3Z" />
                                        </svg>
                                        <span class="text-md text-gray-700">My Store</span>
                                    </li>
                                    <li @click="goToPage('/inbox')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[18px] h-[18px] text-gray-700" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                        </svg>
                                        <span class="text-md text-gray-700">Message</span>
                                    </li>
                                    <li @click="goToPage('/order')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[18px] h-[18px] text-gray-700" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                                        </svg>
                                        <span class="text-md text-gray-700">Order Tracker</span>
                                    </li>
                                    <li @click="goToPage('/checkout')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[18px] h-[18px] text-gray-700" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                        </svg>
                                        <span class="text-md text-gray-700">Checkout</span>
                                    </li>
                                    <li @click="goToPage('/buy-credits')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M11.905 1.316 15.633 6M18 10h-5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5m0-5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3m-6.367-9L7.905 1.316 2.352 6h9.281Z" />
                                        </svg>
                                        <span class="text-md text-gray-700">Buy Credits</span>
                                    </li>
                                    <li @click="goToPage('/settings')"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true" viewBox="0 0 20 18"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
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

                                        <span class="text-md text-gray-700">Settings</span>
                                    </li>
                                    <li @click="handleLogout"
                                        class="panel-close cursor-pointer w-full flex flex-row items-center gap-2 hover:bg-gray-100 rounded py-2">
                                        <svg class="w-[16px] h-[16px] text-gray-700" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3" />
                                        </svg>
                                        <span class="text-md text-gray-700">Sign out</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- <p>
                                <f7-link panel-close>Close me</f7-link>
                            </p> -->
                        </f7-block>
                    </f7-page>
                </f7-panel>
            </div>

            <!-- Notification Dropdown -->
            <div v-if="dropdownNotification"
                class="bg-white text-base z-50 list-none divide-gray-100 rounded absolute top-14 w-full h-screen overflow-y-auto px-4 py-6">
                <h3 class="text-gray-800 font-semibold text-2xl">Notifications</h3>

                <!-- Filter Button -->
                <div v-if="notifData.length > 0" class="flex gap-2 items-center my-4">
                    <f7-button @click="notifFilter('all')"
                        :class="notifCTAFilter === 'all' ? 'border bg-clr-primary text-white hover:text-white' : 'border'">All</f7-button>
                    <f7-button @click="notifFilter('unread')"
                        :class="notifCTAFilter === 'unread' ? 'border bg-clr-primary text-white hover:text-white' : 'border'">Unread</f7-button>
                </div>

                <!-- List of Notification -->
                <ul class="flex flex-col gap-1">
                    <li @click="identifyRedirection(notif.type), updateNotificationIsReadFalse(notif.id)" v-if="notifData.length > 0"
                        v-for="notif in renderNotifFilter" :key="notif.id"
                        :class="notif.is_read ? 'bg-white hover:bg-gray-100' : 'bg-blue-50 hover:bg-gray-100'"
                        class="cursor-pointer flex items-center gap-4 py-3 px-2 rounded -ml-2 border-b">
                        <div class="p-2 bg-clr-primary rounded-full">
                            <svg v-if="notif.type === 'inbox'" class="w-[20px] h-[20px] text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path
                                    d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                                <path
                                    d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                            </svg>

                            <svg v-if="notif.type === 'transaction'" class="w-[20px] h-[20px] text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                            </svg>
                        </div>
                        <div>
                            <p>
                                <span class="font-semibold text-clr-primary">{{ notif.notified_by_fullname }}</span> {{
                                    notif.message }}
                            </p>
                            <p class="text-sm text-gray-600">{{ notif.created_at }}</p>

                            <!-- Notification Action -->
                            <div class="flex gap-2 mt-2">
                                <p @click="updateNotificationIsReadFalse(notif.id)" v-if="!notif.is_read"
                                    class="text-sm text-gray-500 hover:text-cyan-900">Read</p>
                                <p @click="deleteNotificationData(notif.id)"
                                    class="text-sm text-gray-500 hover:text-cyan-900">Remove</p>
                            </div>
                        </div>
                    </li>

                    <li v-else class="cursor-pointer flex items-center gap-4 hover:bg-gray-100 py-3 px-2 rounded -ml-2">
                        No Notification
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<style scoped lang="scss">
.page-content {
    background: #FFF;
}
</style>