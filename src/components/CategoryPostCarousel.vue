<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { usePostStore } from '../js/post.store';
import { useLocationStore } from '../js/location.store';

const postStore = usePostStore();
const locationStore = useLocationStore();
const postData = ref([]);
const isClicked = ref(false);
const slidesPerView = ref(4);
const isLoadingItem = ref(false);
const viewID = ref(0);
const recentViewed = ref([]);
const existingArrayRecent = localStorage.getItem('RecentViewed');
const error = ref(false);
let resizeListener = null;

const initRender = async () => {
    updateSlidesPerView();
    resizeListener = window.addEventListener('resize', updateSlidesPerView);

    // Init Preloader
    isLoadingItem.value = true;

    // Get Top3 Category Posts
    const response = await postStore.GetTop3PostCategory();
    postData.value = response.data;

    if (postData.value === 'No Data Found') {
        return error.value = true;
    }

    // Init the distance inside the postData.value
    populateDistance();

    if (postData.status == 'No Data Found') {
        postData.value = null;
    }

    // Cancel Preloader state
    isLoadingItem.value = false;

    // Get the RecentViewed Post
    if (existingArrayRecent) {
        try {
            recentViewed.value = JSON.parse(existingArrayRecent);
        } catch (error) {
            recentViewed.value = [];
        }
    };
};

// Redirection to View item Details Page
const goToPostDetails = async (id) => {
    viewID.value = id;
    doRecentView(id);
    await postStore.GetPostDetails(id);
    const route = `/view/item/${viewID.value}`;
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

// Set Vendor ID in Localstorage
const setVendorID = (vendor_id) => {
    localStorage.setItem('vendorID', vendor_id);

    const route = `/view/store`;
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

// Add to Wishlist
const HandleWishlist = async (post_item_id) => {
    await postStore.AddWishList(post_item_id);

    // Rerender Data
    const response = await postStore.GetTop3PostCategory();
    postData.value = response.data;

    populateDistance();
};

// Redirection to other Page
const goToPage = (route) => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

// Recent Viewed
const doRecentView = (id) => {
    const existingArray = [...recentViewed.value];
    existingArray.push(id);
    localStorage.setItem('RecentViewed', JSON.stringify(existingArray));
    recentViewed.value = existingArray;
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

const calculateDistance = (userLatitude, userLongitude, postLatitude, postLongitude) => {
    // console.log(userLatitude + ' ' + userLongitude + ' ' + postLatitude + ' ' + postLongitude);
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

// Check if the Distance is NaN
const displayDistance = (distance) => {
    if (!isNaN(distance)) {
        return `${distance} km away`;
    } else {
        return 'Set your location';
    }
};

const populateDistance = async () => {
    // Get the User Location Data
    const getLocationAuthUser = await locationStore.GetUserLocation();

    if (postData.value != 'No Data Found') {
        postData.value.forEach((post) => {
            if (post.posts && post.posts.length > 0) {
                // Calculate distance for each nested post
                post.posts.forEach((nestedPost) => {
                    nestedPost.distance = calculateDistance(
                        getLocationAuthUser.latitude,
                        getLocationAuthUser.longitude,
                        nestedPost.post_latitude,
                        nestedPost.post_longitude
                    );
                });
            }
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
    <div v-if="!error">
        <div v-if="!isLoadingItem" class="mb-6" v-for="top in postData">
            <div class="w-50">
                <h2 class="cursor-pointer text-xl font-medium mb-2 hover:underline">{{ top.category_name }}</h2>
            </div>
            <swiper-container :pagination="false" :allowTouchMove="false" :navigation="true" :space-between="18"
                :slides-per-view="slidesPerView">
                <swiper-slide v-for="post in top.posts" class="w-full border border-gray-200 rounded-lg hover:shadow">
                    <!-- Post-Image-Slider -->
                    <div class="w-full h-52 overflow-hidden rounded-t-lg">
                        <swiper-container :pagination="true" class="demo-swiper-multiple" :space-between="0"
                            :slides-per-view="1">
                            <swiper-slide v-for="image in post.images">
                                <img @click="goToPostDetails(post.id)"
                                    class="w-full h-52 cursor-pointer hover:brightness-75 delay-75 object-cover object-top"
                                    :src="image.img_file_path" alt="">
                            </swiper-slide>
                        </swiper-container>
                    </div>
                    <!-- About Post Item -->
                    <div class="item-post px-3 py-4">
                        <!-- Profile -->
                        <div class="flex flex-row items-center gap-2">
                            <div class="w-10 h-10 rounded-full overflow-hidden">
                                <img class="w-full h-full object-cover" :src="post.vendor_profile" />
                            </div>
                            <!-- Post User Profile -->
                            <div class="profile">
                                <p @click="setVendorID(post.user_id)" class="profile-name cursor-pointer profile-name hover:underline text-lg">{{ post.fullname
                                }}
                                </p>
                                <!-- Verified Indicator -->
                                <div class="flex flex-row items-center gap-1">
                                    <span class="profile-verified-label text-clr-primary">Verified Vendor</span>
                                    <svg class="verified w-[18px] h-[18px] text-clr-primary" aria-hidden="true"
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
                                    class="cursor-pointer text-lg font-medium hover:underline truncate">{{ post.item_name }}
                                </h3>
                                <!-- Add Wishlist -->
                                <svg v-if="!post.added_user_wishlist" @click="HandleWishlist(post.id)"
                                    class="cursor-pointer w-[24px] h-[24px] text-clr-primary shrink-0" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 19">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                                </svg>
                                <svg v-else @click="HandleWishlist(post.id)"
                                    class="cursor-pointer w-[24px] h-[24px] text-clr-primary shrink-0" aria-hidden="true"
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
                                <p @click="goToPage('/location')" class="text-clr-primary cursor-pointer hover:underline">
                                    {{ displayDistance(post.distance) }}
                                </p>
                            </div>
                            <!-- Item Location -->
                            <div class="flex items-center gap-1 mt-2 pb-4">
                                <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
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
        </div>
        <div v-else class="mt-6 mb-12 flex items-center justify-center">
            <f7-preloader />
        </div>
    </div>

    <!-- If Error -->
    <div v-else class="border border-gray-300 rounded-lg px-6 py-8 mb-12">
          Error: No Data Found
        </div>
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