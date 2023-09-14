<script setup>
import { f7 } from 'framework7-vue';
import AuthenticatedLayout from '../../Layout/AuthenticatedLayout.vue';
import CategoryCarousel from '../../components/CategoryCarousel.vue';
import CategoryPostCarousel from '../../components/CategoryPostCarousel.vue';
import PostIllustration from '../../assets/illustrations/post_illustration.svg';
import MyLocationIllustration from '../../assets/illustrations/my_location_illustration.svg';

const currentPage = 'home';

// Redirection to Post item Page
const goToPostItem = () => {
  if (window.innerWidth <= 1023) {
    f7.views.main.router.navigate('/post/item', {
      animate: true,
    });
  } else {
    f7.views.main.router.navigate('/post/item', {
      animate: false,
    });
  }
};
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
        <div @click="goToPostItem"
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
            <p class="text-lg mt-1">To check your distance between items!</p>
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
        <h2 class="text-xl font-medium mb-2">Recently Viewed</h2>
        <div class="border border-gray-300 rounded-lg px-6 py-8">
          You didn't check any items yet. Last few items you viewed will appear here...
        </div>
      </section>
      <!-- Top Category and Items -->
      <section class="mb-6">
        <div class="w-24">
          <h2 class="cursor-pointer text-xl font-medium mb-2 hover:underline">Vehicles</h2>
        </div>
        <CategoryPostCarousel />
      </section>

      <!-- Advertising Slider -->
      <section class="mb-12">
        <swiper-container :pagination="true" :space-between="50" :speed="900">
          <swiper-slide>
            <div class="bg-gray-400 py-32 px-12">
              Test
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="bg-red-400 py-32 px-12">
              Test
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="bg-green-400 py-32 px-12">
              Test
            </div>
          </swiper-slide>
        </swiper-container>
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