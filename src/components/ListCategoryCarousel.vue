<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import TestIcon from '../assets/icon-test.svg';

const slidesPerView = ref(4);
const slides = ref([
  'All List', 'Vehicles', 'Apparel', 'Electronics', 'Entertainment', 'Tools',
  'Free Stuff', 'Instruments', 'Hobbies', 'Office Supplies', 'Pet Supplies'
]);

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

// Redirection to Post item Page
const goToBrowse = () => {
  if (window.innerWidth <= 1023) {
    f7.views.main.router.navigate('/browse', {
      animate: true,
    });
  } else {
    f7.views.main.router.navigate('/browse', {
      animate: false,
    });
  }
};

</script>
<template>
  <!-- Categories -->
  <div class="border border-gray-300 rounded-lg px-6 py-8">
    <h3 class="text-xl font-semibold">What are you looking for?</h3>
    <div class="flex items-center gap-1 mt-2">
      <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span class="text-clr-primary font-medium">Swipe it now</span>
      <svg class="ml-2 w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"
          d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
    </div>
    <!-- Slider Item Categories -->
    <swiper-container class="space-x-4 mt-5" :slides-per-view="slidesPerView">
      <swiper-slide @click="goToBrowse" v-for="(slide, index) in slides" :key="index"
        class="cursor-pointer border border-gray-200 rounded-lg px-4 py-6 w-full md:w-1/2 lg:w-1/4 shadow hover:border-gray-700">
        <div class="flex flex-row items-center gap-4">
          <img class="bg-blue-200 p-2 rounded-md" :src="TestIcon">
          <span class="font-medium text-lg">{{ slide }}</span>
        </div>
      </swiper-slide>
    </swiper-container>
  </div>
</template>