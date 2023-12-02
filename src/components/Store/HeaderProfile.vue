<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import TestProfile from '../../assets/profile/test_profile.jpg';

const authStore = useAuthStore();
const UpdateProfile = ref(null);
const fileInput = ref(null);
const data = ref([]);

const FormData = ref({
    img_file_path: null,
});

const renderData = async () => {
    const response = await authStore.getMyStoreDetails();
    data.value = response.data;
    console.log(data.value);
};

// Redirection to other Page
const goToPage = (route) => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

const handleUpdateImage = async () => {
    // Create an array to store file data
    const files = [];

    if (!FormData.value.img_file_path) {
        return;
    }

    // Convert File objects to base64 encoded strings
    for (const file of FormData.value.img_file_path) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise((resolve) => {
            reader.onload = (e) => {
                files.push({ name: file.name, data: e.target.result });
                resolve();
            };
        });
    }

    const response = await authStore.updateProfile(files);

    console.log(response);
}

// Handle Update Profile Image
const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if (files.length == 0) {
        return;
    }

    f7.dialog.confirm('Do you want to update your profile?', () => {
        // Filter files to only include JPG, JPEG, and PNG
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const selectedFiles = files.filter((file) => allowedTypes.includes(file.type));

        // Initialize form.img_file_path as an empty array if it's not already an array
        if (!Array.isArray(FormData.value.img_file_path)) {
            FormData.value.img_file_path = [];
        }

        // Append selectedFiles to the existing form.img_file_path array
        FormData.value.img_file_path = [...selectedFiles];

        // Display selected images
        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                UpdateProfile.value = reader.result;
            };
            reader.readAsDataURL(file);
        });
        
        // Upload Image
        handleUpdateImage();
    });
};

onMounted(() => {
    renderData();
});
</script>

<template>
    <!-- Header Profile -->
    <div class="mb-12 flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-20">
        <!-- Profile Image -->
        <div class="relative w-32 h-32 lg:w-48 lg:h-48 overflow-hidden rounded-full hover:brightness-75 bg-gray-100">
            <!-- <f7-preloader class="absolute right-20 top-20 z-[99999]" /> -->
            <label for="file-input" class="w-full h-full">
                <img v-if="!UpdateProfile" :src="data.profile_img" class="cursor-pointer w-full h-full object-cover">
                <img v-else :src="UpdateProfile" class="cursor-pointer w-full h-full object-cover">
            </label>
            <input id="file-input" type="file" class="hidden" @change="handleImageUpload" ref="fileInput">
        </div>

        <!-- User Profile Data -->
        <div class="flex flex-col items-center lg:items-start gap-5">
            <!-- User Information -->
            <div>
                <h2 class="text-2xl font-semibold">{{ data.fullname }}</h2>
                <!-- Verified Indicator -->
                <div v-if="data.is_verified" class="flex flex-row items-center gap-1">
                    <span class="text-clr-primary font-medium">Verified Vendor</span>
                    <svg class="w-[18px] h-[18px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill="currentColor"
                            d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
                        <path fill="#fff"
                            d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
                    </svg>
                </div>
                <div v-else class="flex flex-row items-center gap-1">
                    <span class="text-clr-primary font-medium">Unverified Vendor</span>
                </div>
            </div>

            <!-- Data Statistic Number -->
            <div class="flex flex-row flex-nowrap gap-8">
                <!-- Total Post -->
                <div class="flex flex-col items-center text-base">
                    <span class="font-semibold text-clr-primary">{{ data.total_post }}</span>
                    <span class="font-light">Posts</span>
                </div>

                <!-- Overall Ratings -->
                <div class="flex flex-col items-center text-base">
                    <span class="font-semibold text-clr-primary">{{ data.total_ratings }}</span>
                    <span class="font-light">Ratings</span>
                </div>

                <!-- Overall Ratings -->
                <div class="flex flex-col items-center text-base">
                    <span class="font-semibold text-clr-primary">{{ data.wallet }} PHP</span>
                    <span class="font-light">Wallet Credits</span>
                </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-row gap-4">
                <div class="flex flex-row items-center gap-2">
                    <f7-button tooltip="Post new item" @click="goToPage('/post/item')"
                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md font-medium">
                        <span>Post Item</span>
                    </f7-button>
                    <f7-button tooltip="Withdraw Credits" @click="goToPage('/buy-credits')"
                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md font-medium">
                        <span>Withdraw</span>
                    </f7-button>
                    <f7-button tooltip="Edit Profile" @click="goToPage('/settings')"
                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md font-medium">
                        <span>Edit Profile</span>
                    </f7-button>
                </div>
            </div>

            <div class="flex flex-row gap-3">
                <div @click="goToPage('/order')" class="flex gap-1 items-center cursor-pointer">
                    <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                    </svg>
                    <span>Track Orders</span>
                </div>
                <div @click="goToPage('/buy-credits')" class="flex gap-1 items-center cursor-pointer">
                    <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M11.905 1.316 15.633 6M18 10h-5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5m0-5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3m-6.367-9L7.905 1.316 2.352 6h9.281Z" />
                    </svg>
                    <span>Buy Credits</span>
                </div>
            </div>
        </div>
    </div>
</template>