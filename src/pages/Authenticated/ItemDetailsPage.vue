<script setup>
import { f7 } from 'framework7-vue';
import { ref } from 'vue';
import { usePostStore } from '../../js/post.store';
import { useInboxStore } from '../../js/inbox.store';
import TertiaryLayout from '../../Layout/TertiaryLayout.vue';
import TestProfile from '../../assets/profile/test_profile.jpg';

const currentPage = 'view-item';
const postStore = usePostStore();
const inboxStore = useInboxStore();
const isRequest = ref(false);
const toastWithButton = ref(null);

console.log(postStore.getItemDetails);

const doHandleTapToInquire = async (id, post_user_id) => {
    // Init Loading Request
    isRequest.value = true;

    const response = await inboxStore.TapToInquire(id, post_user_id);

    if (response.status != 'error') {
        
        if (!toastWithButton.value) {
            toastWithButton.value = f7.toast.create({
                text: response.message,
                position: 'top',
                closeButton: true,
                closeButtonText: 'Okay',
                closeButtonColor: 'green',
                closeTimeout: 3000,
            });
            goToPage('/inbox');
        }

    } else {
        if (!toastWithButton.value) {
            toastWithButton.value = f7.toast.create({
                text: response.message,
                position: 'top',
                closeButton: true,
                closeButtonText: 'Okay',
                closeButtonColor: 'red',
                closeTimeout: 3000,
            });
        }
    }

    toastWithButton.value.open();
    isRequest.value = false;
}

// Redirection to other Page
const goToPage = (route) => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};

</script>

<template>
    <f7-page class="itemdetails-container">
        <TertiaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Item Details</h1>
            </template>
            <div class="-mt-6"></div>
            <!-- Item Details -->
            <div class="mb-12">
                <div class="mx-auto max-w-screen-xl lg:py-8">
                    <!-- Breadcrumps -->
                    <div class="mb-4 hidden lg:flex gap-4 items-center">
                        <f7-link class="text-gray-500" href="/" :animate="false">Home</f7-link>
                        <svg class="w-[14px] h-[14px] text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <f7-link class="text-gray-500" href="/browse" :animate="false">Browse</f7-link>
                        <svg class="w-[14px] h-[14px] text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                d="m1 9 4-4-4-4" />
                        </svg>
                        <p class="text-gray-700">Item Details</p>
                    </div>
                    <div class="grid gap-2 lg:gap-8 grid-cols-1 lg:grid-cols-2">
                        <!-- Left -->
                        <div class="left-product-details grid grid-cols-1 gap-6">
                            <!-- Post-Image-Slider -->
                            <div
                                class="w-full h-auto lg:h-[500px] overflow-hidden bg-gray-100 border border-gray-200 rounded-md">
                                <swiper-container :pagination="true" :space-between="0" :slides-per-view="1"
                                    class="h-auto lg:h-[500px] object-cover">
                                    <swiper-slide v-for="image in postStore.getItemDetails.images">
                                        <img class="w-full h-full" :src="image.img_file_path">
                                    </swiper-slide>
                                </swiper-container>
                            </div>
                            <!-- Vendor Details -->
                            <div class="vendor-details flex justify-between flex-wrap md:flex-nowrap">
                                <!-- Vendor Profile -->
                                <div class="flex flex-row items-center gap-2 mb-2">
                                    <div class="w-10 h-10 rounded-full overflow-hidden">
                                        <img class="w-full h-full object-cover" :src="TestProfile" />
                                    </div>
                                    <!-- Vendor User Info -->
                                    <div class="profile">
                                        <p class="cursor-pointer profile-name hover:underline text-lg">{{
                                            postStore.getItemDetails.fullname }}</p>
                                        <!-- Verified Indicator -->
                                        <div class="flex flex-row items-center gap-1">
                                            <span class="profile-verified-label">Verified</span>
                                            <svg class="verified w-[18px] h-[18px] text-gray-800 dark:text-white"
                                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fill="currentColor"
                                                    d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
                                                <path fill="#fff"
                                                    d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <!-- Vendor Ratings -->
                                <div>
                                    <p class="text-yellow-400">High Rated Vendor</p>
                                    <div class="flex gap-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Right -->
                        <div class="right-product-details">
                            <!-- Product Details -->
                            <div class="flex flex-col">
                                <!-- Product About -->
                                <div class="product-about">
                                    <!-- Title -->
                                    <h2 class="text-xl font-semibold w-full lg:w-[500px]">{{
                                        postStore.getItemDetails.item_name }}</h2>
                                    <p class="text-gray-500 mt-1">Available Stocks - {{ postStore.getItemDetails.item_stocks
                                    }}pcs.
                                        • ₱{{ postStore.getItemDetails.item_cash_value }}
                                    </p>
                                    <!-- Condition -->
                                    <div class="mt-4">
                                        <h3 class="text-lg font-semibold ">Condition</h3>
                                        <p class="w-full lg:w-[500px] text-gray-500 text-md">{{
                                            postStore.getItemDetails.condition }}</p>
                                    </div>
                                    <!-- Description -->
                                    <div class="mt-4">
                                        <h3 class="mb-3 text-lg font-semibold ">Description</h3>
                                        <p class="w-full lg:w-[500px] text-gray-500 text-md">
                                            {{ postStore.getItemDetails.item_description }}
                                        </p>
                                    </div>
                                </div>
                                <!-- Item Location -->
                                <div class="mt-4 flex items-center gap-1 text-clr-primary">
                                    <svg class="w-[18px] h-[18px] text-clr-primary" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                                        <path
                                            d="M7 0a7 7 0 0 0-1 13.92V19a1 1 0 1 0 2 0v-5.08A7 7 0 0 0 7 0Zm0 5.5A1.5 1.5 0 0 0 5.5 7a1 1 0 0 1-2 0A3.5 3.5 0 0 1 7 3.5a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <p>{{ postStore.getItemDetails.post_address }}</p>
                                </div>
                                <!-- Product Item For -->
                                <div class="product-item-for">
                                    <!-- For Sale -->
                                    <div class="flex items-center gap-4 mt-4"
                                        v-show="postStore.getItemDetails.item_for_type == 'For Sale'">
                                        <div class="bg-blue-100 p-2 rounded">
                                            <svg class="w-[32px] h-[32px] text-gray-700" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5"
                                                    d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                                            </svg>
                                        </div>
                                        <div class="flex flex-col">
                                            <h4 class="text-lg font-medium">For Sale</h4>
                                            <p>Open for selling</p>
                                        </div>
                                    </div>
                                    <!-- For Swap -->
                                    <div class="flex items-center gap-4 mt-4"
                                        v-show="postStore.getItemDetails.item_for_type == 'For Swap'">
                                        <div class="bg-blue-100 p-2 rounded">
                                            <svg class="w-[32px] h-[32px] text-gray-700" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 15">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5"
                                                    d="m13.717 1 5.518 4.95a1.05 1.05 0 0 1 0 1.549l-5.612 5.088m-5.73-3.214v1.615a.95.95 0 0 0 1.525.845l5.108-4.251a1.1 1.1 0 0 0 0-1.646L9.418 1.685a.95.95 0 0 0-1.525.846v1.7c-3.312 0-6 2.979-6 6.654v1.329a.7.7 0 0 0 1.344.353 5.174 5.174 0 0 1 4.652-3.191l.004-.003Z" />
                                            </svg>
                                        </div>
                                        <div class="flex flex-col">
                                            <h4 class="text-lg font-medium">For Swap</h4>
                                            <p>Open for swap and offers</p>
                                        </div>
                                    </div>
                                    <!-- For Swap and Sale -->
                                    <div class="flex items-center gap-4 mt-4"
                                        v-show="postStore.getItemDetails.item_for_type == 'For Swap and Sale'">
                                        <div class="bg-blue-100 p-2 rounded">
                                            <svg class="w-[32px] h-[32px] text-gray-700" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5"
                                                    d="M2 19h16m-8 0V5m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4 8l-2.493 5.649A1 1 0 0 0 2.443 15h3.114a1.001 1.001 0 0 0 .936-1.351L4 8Zm0 0V6m12 2-2.493 5.649A1 1 0 0 0 14.443 15h3.114a1.001 1.001 0 0 0 .936-1.351L16 8Zm0 0V6m-4-2.8c3.073.661 3.467 2.8 6 2.8M2 6c3.359 0 3.192-2.115 6.012-2.793" />
                                            </svg>
                                        </div>
                                        <div class="flex flex-col">
                                            <h4 class="text-lg font-medium">For Swap and Sale</h4>
                                            <p>Open for selling and swapping</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- Product CTA -->
                                <div class="mt-6 lg:mt-14 flex gap-4 flex-wrap sm:flex-nowrap">
                                    <div class="w-full sm:w-auto">
                                        <f7-button preloader :loading="isRequest" class="primary-button" large fill
                                            @click="doHandleTapToInquire(postStore.getItemDetails.id, postStore.getItemDetails.user_id)">Tap
                                            to Inquire</f7-button>
                                    </div>
                                    <div
                                        class="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-4 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg">
                                        <svg class="w-6 h-6 text-clr-primary" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                                        </svg>
                                        <p class="text-base text-clr-primary">Add to Wishlist</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TertiaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.itemdetails-container {
    background: #FFF;
    width: 100%;
    height: 100%;
}
</style>