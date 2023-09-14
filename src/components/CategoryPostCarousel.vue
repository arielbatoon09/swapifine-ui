<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { f7 } from 'framework7-vue';
import SampleProduct1 from '../assets/products/sample1.png';
import SampleProduct2 from '../assets/products/sample2.jpg';
import TestProfile from '../assets/profile/test_profile.jpg';

const isClicked = ref(false);
const slidesPerView = ref(4);
const sampleData = ref([
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
]);

const goToNextSlide = () => {
  if (swiper) {
    swiper.slideNext(); // Use the swiper variable to navigate to the next slide
  }
};

const updateSlidesPerView = () => {
    if (window.innerWidth <= 767) {
        slidesPerView.value = 1; // Mobile
    } else if (window.innerWidth <= 1023) {
        slidesPerView.value = 2; // Tablet
    } else {
        slidesPerView.value = 4; // Desktop
    }
};

// Listen for window resize events and update slidesPerView
let resizeListener = null;

onMounted(() => {
    updateSlidesPerView(); // Set initial value

    // Add window resize event listener
    resizeListener = window.addEventListener('resize', updateSlidesPerView);
});

onBeforeUnmount(() => {
    // Remove the window resize event listener when the component is unmounted
    if (resizeListener) {
        window.removeEventListener('resize', updateSlidesPerView);
    }
});

</script>

<template>
    <section class="mb-6">
        <div class="w-24">
            <h2 class="cursor-pointer text-xl font-medium mb-2 hover:underline">Vehicles</h2>
        </div>
        <swiper-container :pagination="false" :allowTouchMove="false" :navigation="true" :space-between="18"
            :slides-per-view="slidesPerView" >
            <swiper-slide v-for="(vehicle, index) in sampleData" :key="index"
                class="w-full border border-gray-200 rounded-lg hover:shadow">
                <!-- Post-Image-Slider -->
                <div class="w-full h-52 overflow-hidden rounded-t-lg">
                    <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="0"
                        :slides-per-view="1">
                        <swiper-slide>
                            <img class="w-full h-52" :src="SampleProduct1" alt="">
                        </swiper-slide>
                        <swiper-slide>
                            <img class="w-full h-52" :src="SampleProduct2" alt="">
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
                            <p class="profile-name hover:underline">Ariel Batoon</p>
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
                            <h3 class="cursor-pointer text-lg font-medium hover:underline">Ryzen 5 5600G with 24inch IPS
                            </h3>
                            <!-- Add-To-Favorites -->
                            <svg v-if="!isClicked" @click="isClicked = true"
                                class="cursor-pointer w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z" />
                            </svg>
                            <svg v-else @click="isClicked = false"
                                class="cursor-pointer w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        </div>
                        <!-- Item Distance -->
                        <div class="flex items-center gap-1 mt-1">
                            <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                <path
                                    d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                            </svg>
                            <p class="text-clr-primary cursor-pointer hover:underline">65 km away</p>
                        </div>
                        <!-- Item Location -->
                        <div class="flex items-center gap-1 mt-2 pb-4">
                            <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
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
            </swiper-slide>
        </swiper-container>
</section>
</template>

<style scoped>
/* Custom styles for navigation buttons */
.swiper-button-next,
.swiper-button-prev {
  width: 32px;
  height: 32px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0.5rem 1rem rgba(16, 28, 38, 0.05);
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Custom styles for navigation button icons */
.swiper-button-next svg,
.swiper-button-prev svg {
  width: 20%;
}
</style>