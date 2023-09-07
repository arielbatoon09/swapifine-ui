<script setup>
import { ref } from 'vue';
import AuthenticatedLayout from '../../Layout/AuthenticatedLayout.vue';
import CategoryCarousel from '../../components/category-carousel.vue';
import PostIllustration from '../../assets/illustrations/post_illustration.svg';
import MyLocationIllustration from '../../assets/illustrations/my_location_illustration.svg';
import SampleProduct1 from '../../assets/products/sample1.png';
import SampleProduct2 from '../../assets/products/sample2.jpg';
import TestProfile from '../../assets/profile/test_profile.jpg';

const currentPage = 'home';
const isClicked = ref(false);

const sampleData = ref([
  '1', '2', '3', '4', '5',
  '6', '7', '8'
]);

</script>

<template>
  <f7-page class="homepage-container">
    <AuthenticatedLayout :currentPage="currentPage" class="pb-12">
      <!-- Welcome Message -->
      <section class="mt-12 mb-8">
        <h2 class="text-3xl font-semibold">Nice to see you, Ariel 👋</h2>
      </section>
      <!-- CTA: Post Item and Set Location -->
      <section class="flex flex-row flex-wrap lg:flex-nowrap gap-4 mb-4">
        <!-- Post Item CTA -->
        <div
          class="flex items-center justify-between gap-8 cursor-pointer hover:shadow border border-gray-300 rounded-lg px-6 py-6 w-full">
          <img :src="PostIllustration" width="100" height="100">
          <div class="flex-1">
            <h4 class="font-bold text-xl">Post Item</h4>
            <p class="text-lg mt-1">Let's create a post now!</p>
          </div>
          <div class="hidden lg:block">
            <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="m1 9 4-4-4-4" />
            </svg>
          </div>
        </div>
        <!-- Set Location CTA -->
        <div
          class="flex items-center justify-between gap-8 cursor-pointer hover:shadow border border-gray-300 rounded-lg px-6 py-6 w-full">
          <img :src="MyLocationIllustration" width="100" height="100">
          <div class="flex-1">
            <h4 class="font-bold text-xl">Set Location</h4>
            <p class="text-lg mt-1">To check the distance between items!</p>
          </div>
          <div class="hidden lg:block">
            <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="m1 9 4-4-4-4" />
            </svg>
          </div>
        </div>
      </section>
      <!-- Categories -->
      <section class="mb-12">
        <CategoryCarousel />
      </section>
      <!-- Recently viewed -->
      <section class="mb-6">
        <h2 class="text-lg font-medium mb-2">Recently Viewed</h2>
        <div class="border border-gray-300 rounded-lg px-6 py-8">
          You didn't check any items yet. Last few items you viewed will appear here...
        </div>
      </section>
      <!-- General Items 1 -->
      <section class="mb-6">
        <h2 class="text-lg font-medium mb-2">Vehicles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(vehicle, index) in sampleData" :key="index" class="w-full cursor-pointer border border-gray-200 rounded-lg hover:shadow">
            <!-- Post-Image-Slider -->
            <div class="w-full h-52 overflow-hidden rounded-t-lg">
              <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="0" :slides-per-view="1">
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
              <div class="flex flex-row items-center gap-4">
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img class="w-full h-full object-cover" :src="TestProfile" />
                </div>

                <div class="profile">
                  <p class="profile-name">Ariel Batoon</p>
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
                  <h3 class="text-lg">Ryzen 5 5600G</h3>
                  <!-- Add-To-Favorites -->
                  <svg v-if="!isClicked" @click="isClicked = true"
                    class="cursor-pointer w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z" />
                  </svg>
                  <svg v-else @click="isClicked = false"
                    class="cursor-pointer w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </div>
                <!-- Address -->
                <div class="flex items-center gap-1 mt-1">
                  <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path
                      d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                  <span>65 km away</span>
                </div>
                <!-- Other Info -->
                <div class="mt-2 pb-4">
                  <span>Cebu City, Central Visayas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  </f7-page>
</template>

<style scoped lang="scss">
.homepage-container {
  background: #FFF;
  width: 100%;
  height: 100%;

  .item-post .profile {
    .profile-name {
      font-size: 16px;
      font-weight: 500;
    }

    .profile-verified-label {
      color: #003D66;
      font-size: 14px;
      font-weight: 400;
    }

    .verified {
      color: #003D66;
    }
  }
}
</style>