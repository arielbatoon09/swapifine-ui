<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import { usePostStore } from '../../js/post.store';
import { useLocationStore } from '../../js/location.store';
import TestProfile from '../../assets/profile/test_profile.jpg';
import PrimaryLayout from '../../Layout/PrimaryLayout.vue';
import ListCategoryCarousel from '../../components/ListCategoryCarousel.vue';
import CategoryPostCarousel from '../../components/CategoryPostCarousel.vue';
import BrowseItemIllustration from '../../assets/illustrations/browse-item-illustration.svg';
import PostIllustration from '../../assets/illustrations/post_illustration.svg';
import MyLocationIllustration from '../../assets/illustrations/my_location_illustration.svg';

const currentPage = 'home';
const authStore = useAuthStore();
const postStore = usePostStore();
const locationStore = useLocationStore();
const postData = ref([]);
const isClicked = ref(false);
const slidesPerView = ref(4);
const viewID = ref(0);
const existingArrayRecent = localStorage.getItem('RecentViewed');
let resizeListener = null;

const initRender = async () => {
  updateSlidesPerView();
  resizeListener = window.addEventListener('resize', updateSlidesPerView);

  // Get the recent viewed post
  if (existingArrayRecent) {
    const response = await postStore.GetRecentViewedPost(existingArrayRecent);
    postData.value = response.data;
  }

  // Init the distance inside the postData.value
  populateDistance();

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

// Clear Recent Viewed Item Post
const clearRecentViewedPost = () => {
  localStorage.removeItem('RecentViewed');
  location.reload();
};

// Redirection to View item Details Page
const goToPostDetails = async (id) => {
  viewID.value = id;
  await postStore.GetPostDetails(id);
  const route = `/view/item/${viewID.value}`;
  const animate = window.innerWidth <= 1023;

  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};

// Redirection to other Page
const goToPage = (route) => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};

const calculateDistance = (userLatitude, userLongitude, postLatitude, postLongitude) => {
  // Convert latitude and longitude from degrees to radians
  const radLat1 = (Math.PI / 180) * userLatitude;
  const radLon1 = (Math.PI / 180) * userLongitude;
  const radLat2 = (Math.PI / 180) * postLatitude;
  const radLon2 = (Math.PI / 180) * postLongitude;

  // Radius of the Earth in kilometers (mean value)
  const Radius = 6371.0;

  // Haversine formula
  const dLon = radLon2 - radLon1;
  const dLat = radLat2 - radLat1;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const calculatedDistance = Radius * c;

  // Round the calculated distance to the nearest whole number
  const roundedDistance = Math.round(calculatedDistance);

  // distance.value = roundedDistance;
  return roundedDistance;
};

const populateDistance = async () => {
    // Get the User Location Data
    const getLocationAuthUser = await locationStore.GetUserLocation();
    if (postData.value) {
        postData.value.forEach((post) => {
            post.distance = calculateDistance(
                getLocationAuthUser.latitude,
                getLocationAuthUser.longitude,
                post.post_latitude,
                post.post_longitude
            );
        });
    }
};

onMounted(async () => {
  // Mount and Render
  initRender();
});

onBeforeUnmount(() => {
  if (resizeListener) {
    window.removeEventListener('resize', updateSlidesPerView);
  }
});
</script>

<template>
  <f7-page class="homepage-container">
    <PrimaryLayout :currentPage="currentPage" class="pb-12">
      <!-- Welcome Message -->
      <section class="mt-12 mb-8">
        <h2 class="text-3xl font-semibold">Nice to see you, {{ authStore.user?.fullname }} 👋</h2>
      </section>
      <!-- Start - CTA: Post Item and Set Location -->
      <section class="flex flex-row flex-wrap lg:flex-nowrap gap-4 mb-4">
        <!-- Browse Item CTA -->
        <div @click="goToPage('/browse')"
          class="flex items-center justify-between gap-8 cursor-pointer hover:shadow border border-gray-300 rounded-lg px-6 py-6 w-full">
          <img :src="BrowseItemIllustration" width="100" height="100">
          <div class="flex-1">
            <h4 class="font-bold text-xl">Browse Item</h4>
            <p class="text-lg mt-1">Browse available items!</p>
          </div>
          <div class="hidden lg:block">
            <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="m1 9 4-4-4-4" />
            </svg>
          </div>
        </div>

        <!-- Post Item CTA -->
        <div @click="goToPage('/post/item')"
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
        <div @click="goToPage('/location')"
          class="flex items-center justify-between gap-8 cursor-pointer hover:shadow border border-gray-300 rounded-lg px-6 py-6 w-full">
          <img :src="MyLocationIllustration" width="100" height="100">
          <div class="flex-1">
            <h4 class="font-bold text-xl">Set Location</h4>
            <p class="text-lg mt-1">Distance between items!</p>
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
      <!-- End - CTA: Post Item and Set Location -->

      <!-- Start - List of Categories -->
      <section class="mb-12">
        <ListCategoryCarousel />
      </section>
      <!-- End - List of Categories -->

      <!-- Start - Recently viewed -->
      <section class="mb-6">
        <div class="mb-2 flex flex-col items-start">
          <h2 class="text-xl font-medium">Recently Viewed</h2>
          <p v-show="existingArrayRecent" @click="clearRecentViewedPost"
            class="cursor-pointer text-red-500 hover:text-red-600">Clear Recents</p>
        </div>
        <swiper-container :pagination="false" :allowTouchMove="false" :navigation="true" :space-between="18"
          :slides-per-view="slidesPerView">
          <swiper-slide v-for="post in postData" :key="post.id"
            class="w-full border border-gray-200 rounded-lg hover:shadow">
            <!-- Post-Image-Slider -->
            <div class="w-full h-52 overflow-hidden rounded-t-lg">
              <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="0" :slides-per-view="1">
                <swiper-slide v-for="image in post.images">
                  <img @click="goToPostDetails(post.id)" class="w-full h-52 cursor-pointer hover:brightness-75 delay-75"
                    :src="image.img_file_path" alt="">
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
                  <p class="profile-name cursor-pointer profile-name hover:underline text-lg">{{ post.fullname }}
                  </p>
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
                  <h3 @click="goToPostDetails(post.id)"
                    class="cursor-pointer text-lg font-medium hover:underline truncate">{{
                      post.item_name }}</h3>
                  <!-- Add-To-Favorites -->
                  <svg v-if="!isClicked" @click="isClicked = true"
                    class="cursor-pointer w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                  </svg>
                  <svg v-else @click="isClicked = false" class="cursor-pointer w-[24px] h-[24px] text-clr-primary"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path
                      d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                  </svg>
                </div>
                <!-- Item Distance -->
                <div class="flex items-center gap-1 mt-1">
                  <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path
                      d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                  <p @click="goToPage('/location')" class="text-clr-primary cursor-pointer hover:underline">{{ post.distance }} km away</p>
                </div>
                <!-- Item Location -->
                <div class="flex items-center gap-1 mt-2 pb-4">
                  <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                    <path
                      d="M7 0a7 7 0 0 0-1 13.92V19a1 1 0 1 0 2 0v-5.08A7 7 0 0 0 7 0Zm0 5.5A1.5 1.5 0 0 0 5.5 7a1 1 0 0 1-2 0A3.5 3.5 0 0 1 7 3.5a1 1 0 0 1 0 2Z" />
                  </svg>
                  <p>{{ post.post_address }}</p>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
        <div v-show="!existingArrayRecent" class="border border-gray-300 rounded-lg px-6 py-8">
          You didn't check any items yet. Last few items you viewed will appear here!
        </div>
      </section>

      <!-- End - Recently viewed -->

      <!-- Start - Top Category and Items -->
      <CategoryPostCarousel />
      <!-- End - Top Category and Items -->

      <!-- Start - Advertising Carousel -->
      <!-- <section class="mb-12">
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
      </section> -->
      <!-- End - Advertising Carousel -->
    </PrimaryLayout>
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