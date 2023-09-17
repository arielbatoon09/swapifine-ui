<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { usePostStore } from '../../js/post.store';
import { f7 } from 'framework7-vue';
import SubAuthenticatedLayout from '../../Layout/SubAuthenticatedLayout.vue';
import SampleProduct1 from '../../assets/products/sample1.png';
import SampleProduct2 from '../../assets/products/sample2.jpg';
import TestProfile from '../../assets/profile/test_profile.jpg';
import TestIcon from '../../assets/icon-test.svg';

const currentPage = 'browse';
const postStore = usePostStore();
const isClicked = ref(false);
const postData = ref([]);
const slidesPerView = ref(8);
let resizeListener = null;

const slides = ref([
    'All List', 'Vehicles', 'Apparel', 'Electronics', 'Entertainment', 'Tools',
    'Free Stuff', 'Instruments', 'Hobbies', 'Office Supplies', 'Pet Supplies'
]);

const updateSlidesPerView = () => {
    if (window.innerWidth <= 767) {
        slidesPerView.value = 2; // Mobile
    } else if (window.innerWidth <= 1024) {
        slidesPerView.value = 4; // Tablet
    } else if (window.innerWidth >= 1025) {
        slidesPerView.value = 6; // Desktop
    }
};

onMounted(async () => {
    // Get All the Post
    const response = await postStore.GetAllPostItem();
    postData.value = response.data;
    console.log(postData.value);

    updateSlidesPerView();
    resizeListener = window.addEventListener('resize', updateSlidesPerView);
});

onBeforeUnmount(() => {
    if (resizeListener) {
        window.removeEventListener('resize', updateSlidesPerView);
    }
});

</script>

<template>
    <f7-page class="browse-container">
        <SubAuthenticatedLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Browse Items</h1>
            </template>
            <div class="-mt-6"></div>
            <!-- Categories Filter -->
            <div class="categories-filter">
                <div class="flex items-center mb-2">
                    <p class="text-clr-primary font-medium text-lg">Categories</p>
                    <svg class="ml-2 w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"
                            d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </div>
                <div class="w-full mb-3">
                    <swiper-container :pagination="false" :space-between="14" :slides-per-view="slidesPerView">
                        <swiper-slide v-for="(slide, index) in slides" :key="index">
                            <div
                                class="cursor-pointer flex flex-row items-center gap-2 border-clr-primary hover:bg-gray-100 py-3 px-3 rounded-full">
                                <img :src="TestIcon">
                                <span>{{ slide }}</span>
                            </div>
                        </swiper-slide>
                    </swiper-container>
                </div>
                <!-- Custom Filter -->
                <div class="flex items-center gap-2 cursor-pointer">
                    <svg class="w-[20px] h-[20px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                    </svg>
                    <p class="text-clr-primary hover:text-cyan-800 hover:underline">Select Filter</p>
                </div>
                <!-- Show Filtered List -->
                <div class="mt-6">
                    <div class="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                        <div
                            class="cursor-pointer flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-3">
                            <p>Vehicles</p>
                            <svg class="cursor-pointer w-[16px] h-[16px] text-gray-800 hover:text-blue-800"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div
                            class="cursor-pointer flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-3">
                            <p>Electronics</p>
                            <svg class="cursor-pointer w-[16px] h-[16px] text-gray-800 hover:text-blue-800"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Item Lists -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-12">
                <div v-for="post in postData" class="w-full border border-gray-200 rounded-lg hover:shadow">
                    <!-- Post-Image-Slider -->
                    <div class="w-full h-52 overflow-hidden rounded-t-lg">
                        <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="0"
                            :slides-per-view="1">
                            <swiper-slide v-for="image in post.images" :id="image.id">
                                <img class="w-full h-52" :src="image.img_file_path" alt="">
                            </swiper-slide>
                        </swiper-container>
                    </div>
                    <!-- About Post Item -->
                    <div class="item-post px-3 py-4">
                        <!-- Profile -->
                        <div class="flex flex-row items-center gap-2">
                            <div class="w-10 h-10 rounded-full overflow-hidden">
                                <img class="w-full h-full object-cover" :src="TestProfile" />
                            </div>
                            <!-- Post User Profile -->
                            <div class="profile">
                                <p class="cursor-pointer profile-name hover:underline text-lg">{{ post.fullname }}</p>
                                <!-- Verified Indicator -->
                                <div class="flex flex-row items-center gap-1">
                                    <span class="profile-verified-label">Verified</span>
                                    <svg class="verified w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill="currentColor"
                                            d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
                                        <path fill="#fff"
                                            d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <!-- Item Description -->
                        <div class="post-description pt-4">
                            <!-- Item Title and React -->
                            <div class="flex items-center justify-between">
                                <h3 class="cursor-pointer text-lg font-medium hover:underline">{{ post.item_name }}
                                </h3>
                                <!-- Add-To-Favorites -->
                                <svg v-if="!isClicked" @click="isClicked = true"
                                    class="cursor-pointer w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                                </svg>
                                <svg v-else @click="isClicked = false"
                                    class="cursor-pointer w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path
                                        d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                                </svg>
                            </div>
                            <!-- Item Distance -->
                            <div class="flex items-center gap-1 mt-1">
                                <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                    <path
                                        d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                </svg>
                                <p class="text-clr-primary cursor-pointer hover:underline">65 km away</p>
                            </div>
                            <!-- Item Location -->
                            <div class="flex items-center gap-1 mt-2 pb-4">
                                <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                                    <path
                                        d="M7 0a7 7 0 0 0-1 13.92V19a1 1 0 1 0 2 0v-5.08A7 7 0 0 0 7 0Zm0 5.5A1.5 1.5 0 0 0 5.5 7a1 1 0 0 1-2 0A3.5 3.5 0 0 1 7 3.5a1 1 0 0 1 0 2Z" />
                                </svg>
                                <p>Cebu City, Central Visayas</p>
                            </div>
                            <!-- CTA View Item -->
                            <div class="cursor-pointer bg-blue-100 py-2 rounded-md text-center">
                                <span class="text-blue-500">View Item</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SubAuthenticatedLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.browse-container {
    background: #FFF;
    width: 100%;
    height: 100%;
}
</style>