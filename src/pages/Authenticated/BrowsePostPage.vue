<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { usePostStore } from '../../js/post.store';
import { useLocationStore } from '../../js/location.store';
import { useFilterStore } from '../../js/filter.store';
import useCookies from 'vue-cookies'
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import TestProfile from '../../assets/profile/test_profile.jpg';
import TestIcon from '../../assets/icon-test.svg';

const currentPage = 'browse';
const postStore = usePostStore();
const locationStore = useLocationStore();
const filterStore = useFilterStore();
const postData = ref([]);
const categories = ref([]);
const isClicked = ref(false);
const slidesPerView = ref(6);
const isLoadingItem = ref(false);
const viewID = ref(0);
const recentViewed = ref([]);
const existingArrayRecent = localStorage.getItem('RecentViewed');
const filterModal = ref(false);
const showFilterList = ref(false);
const kilometersList = ref([1, 2, 5, 6, 10, 20, 40, 60, 80, 250, 500]);
let resizeListener = null;

const formFilterData = ref({
    sortDate: null,
    category: null,
    item_condition: null,
    item_for_type: null,
    distance: null,
});

const initRender = async () => {
    // Update slides per view and Resize Event listener
    updateSlidesPerView();
    resizeListener = window.addEventListener('resize', updateSlidesPerView);
    
    
    // Reset Filter State by Default
    handleResetFilter();

    // Filter Category
    handleCookiesCategory();

    // Get All Categories
    categories.value = await postStore.GetCategoryList();

    // Init Preloader
    isLoadingItem.value = true;

    // Get All Posted Items
    const postResponse = await postStore.GetAllPostItem();
    postData.value = postResponse.data;
    console.log('Browse Default Data', postData.value);

    if (postData.value == 'No Data Found') {
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

// Add to Wishlist
const HandleWishlist = async (post_item_id) => {
    await postStore.AddWishList(post_item_id);

    // Rerender Data
    const postResponse = await postStore.GetAllPostItem();
    postData.value = postResponse.data;
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

// Update SlidesPerView
const updateSlidesPerView = () => {
    if (window.innerWidth <= 767) {
        slidesPerView.value = 2; // Mobile
    } else if (window.innerWidth <= 1024) {
        slidesPerView.value = 4; // Tablet
    } else if (window.innerWidth >= 1025) {
        slidesPerView.value = 6; // Desktop
    }
};

const toggleFilterModal = () => {
    filterModal.value = !filterModal.value;
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

// Check if the Distance is NaN
const displayDistance = (distance) => {
    if (!isNaN(distance)) {
        return `${distance} km away`;
    } else {
        return 'Set your location';
    }
};

// Function to populate distance information in post data
const populateDistance = async () => {
    // Get the User Location Data
    const getLocationAuthUser = await locationStore.GetUserLocation();
    if (postData.value != 'No Data Found') {
        postData.value.forEach((post) => {
            post.distance = calculateDistance(
                getLocationAuthUser.latitude,
                getLocationAuthUser.longitude,
                post.post_latitude,
                post.post_longitude
            );
        });
    };
};

// Process Category Filter in the Home Page
const handleCookiesCategory = () => {
    const newFilterData = formFilterData.value;

    // get category cookies
    newFilterData.category = useCookies.get('category');

    if (newFilterData) {
        // Update the filter state in the Pinia
        filterStore.setFilter(newFilterData);
    }
};

const setTopCategoryCookie = (category) => {
    const newFilterData = formFilterData.value;
    newFilterData.category = category;

    if (newFilterData) {
        // Update the filter state in the Pinia
        filterStore.setFilter(newFilterData);
    }
}

// Set Custom Filter value
const handleCustomFilter = () => {
    const newFilterData = formFilterData.value;

    if (newFilterData) {
        // Update the filter state in the Pinia
        filterStore.setFilter(newFilterData);
        showFilterList.value = true;

        filterModal.value = !filterModal.value;
    }
};

// Reset Click Filter
const handleResetFilter = () => {
    filterStore.sortDate = null;
    filterStore.category = null;
    filterStore.item_condition = null;
    filterStore.item_for_type = null;
    filterStore.distance = null;
    // Form Filter
    formFilterData.value.sortDate = null;
    formFilterData.value.category = null;
    formFilterData.value.item_condition = null;
    formFilterData.value.item_for_type = null;
    formFilterData.value.distance = null;

    showFilterList.value = false;
};

// Remove Filter
const removeFilter = (filterType) => {

    switch (filterType) {
        case "sortDate":
            filterStore.sortDate = null;
            formFilterData.value.sortDate = null;
            break;
        case "category_name":
            filterStore.category = null;
            formFilterData.value.category = null;
            break;
        case "item_condition":
            filterStore.item_condition = null;
            formFilterData.value.item_condition = null;
            break;
        case "item_for_type":
            filterStore.item_for_type = null;
            formFilterData.value.item_for_type = null;
            break;
        case "Distance":
            filterStore.distance = null;
            formFilterData.value.distance = null;
            break;
    }
};


const isShowClearFilter = computed(() => {
    if (formFilterData.value !== null) {
        return Object.values(formFilterData.value).every(value => value === null);
    }
    return false;
});


// To get all filter filter values as an object
const filterValues = computed(() => {
    const sortDate = filterStore.sortDate;

    let sortDateValue = null;
    if (sortDate >= 1 && sortDate <= 29) {
        sortDateValue = "Latest Post";
    } else if (sortDate >= 30) {
        sortDateValue = "Older Post";
    } else {
        sortDateValue = null;
    }

    return {
        'sortDate': sortDateValue,
        'category_name': filterStore.category,
        'item_condition': filterStore.item_condition,
        'item_for_type': filterStore.item_for_type,
        'Distance': filterStore.distance ? filterStore.distance + ' km away' : '',
    };
});

const filteredPost = computed(() => {
    // Populate distances for all posts
    populateDistance();

    // Current Post Data List
    const data = postData.value;

    // Data state from Filter Store
    const { category, sortDate, item_condition, item_for_type, distance } = filterStore;

    // Filter posts below the selected distance
    if (data !== 'No Data Found') {
        const filteredPosts = data.filter((post) => {
            if (sortDate !== null) {
                // Calculate the date threshold based on the number of days
                const postedDate = new Date(post.created_at);
                const currentDate = new Date();
                const timeDifference = currentDate - postedDate;
                const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

                // To distinguish the sortDate value
                let operator;
                if (sortDate == 7) {
                    operator = '<';
                } else if (sortDate == 30) {
                    operator = '>=';
                }

                return (
                    (!category || post.category_name === category) &&
                    (!sortDate || (operator === '<' ? daysDifference < sortDate : daysDifference >= sortDate)) &&
                    (!item_condition || post.condition === item_condition) &&
                    (!item_for_type || post.item_for_type === item_for_type) &&
                    (!distance || post.distance <= distance)
                );
            } else {
                // When sortDate is not specified, don't filter by date
                return (
                    (!category || post.category_name === category) &&
                    (!item_condition || post.condition === item_condition) &&
                    (!item_for_type || post.item_for_type === item_for_type) &&
                    (!distance || post.distance <= distance)
                );
            }
        });

        return filteredPosts;
    }
});

onMounted(async () => {
    initRender();
});

onBeforeUnmount(() => {
    if (resizeListener) {
        window.removeEventListener('resize', updateSlidesPerView);
    }
});

</script>

<template>
    <f7-page class="browse-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Browse Items</h1>
            </template>
            <div class="-mt-6"></div>
            <!-- Categories Filter -->
            <div class="categories-filter relative">
                <div class="flex items-center mb-2">
                    <p class="text-clr-primary font-medium text-lg">Top Categories</p>
                    <svg class="ml-2 w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"
                            d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </div>
                <!-- Top Categories Filter -->
                <div class="w-full mb-3">
                    <swiper-container :pagination="false" :space-between="14" :slides-per-view="slidesPerView">
                        <swiper-slide @click="setTopCategoryCookie(category.category_name)" v-for="category in categories" :key="category.id" >
                            <div class="cursor-pointer flex flex-row flex-nowrap whitespace-nowrap items-center gap-2 border-clr-primary 
                                hover:bg-gray-100 py-3 px-3 rounded-full" :class="formFilterData.category == category.category_name ? 'bg-sky-50' : ''">
                                <img :src="TestIcon">
                                <span>{{ category.category_name }}</span>
                            </div>
                        </swiper-slide>
                    </swiper-container>
                </div>

                <!-- Custom Select Filter -->
                <div @click="toggleFilterModal" class="flex items-center gap-2 cursor-pointer w-28 mb-3">
                    <svg class="w-[20px] h-[20px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                    </svg>
                    <p class="text-clr-primary hover:text-cyan-800 hover:underline">Select Filter</p>
                </div>
                <!-- Display Filtered List -->
                <div v-show="filterValues">
                    <div class="flex flex-wrap gap-2">
                        <div v-for="(filter, key) in filterValues" :key="key" class="cursor-pointer">
                            <template v-if="filter && filter !== 'undefined'">
                                <div
                                    class="w-full flex items-center rounded-full bg-gray-100 hover:bg-gray-200 py-2 px-3 mr-2">
                                    <div class="flex-1">
                                        <p class="text-clr-primary whitespace-nowrap overflow-ellipsis">{{ filter }}</p>
                                    </div>
                                    <!-- Clear Filter Tag -->
                                    <svg @click="removeFilter(key)"
                                        class="w-[16px] h-[16px] text-clr-primary hover:text-cyan-700" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="1.5" d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- Select Filter Modal -->
                <div v-show="filterModal"
                    class="fixed top-0 left-0 flex items-center justify-center w-full h-full z-50 bg-gray-700 bg-opacity-70">
                    <div class="flex flex-col justify-between bg-white bg-opacity-100 md:rounded-lg shadow-lg 
                            h-screen w-full md:h-[600px] md:w-[600px] overflow-y-auto overflow-x-hidden">
                        <!-- Header Filter Modal -->
                        <div class="flex justify-between items-center mb-4 border-b border-gray-200 px-4 pb-4 pt-4">
                            <div class="flex-1 -mr-6">
                                <h2 class="text-lg font-semibold text-gray-600 text-center">Select Filter</h2>
                                <p class="text-gray-500 text-center">Select to filter the posted items.</p>
                            </div>

                            <!-- Close Modal -->
                            <div @click="toggleFilterModal"
                                class="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full p-2">
                                <svg class="w-[14px] h-[14px] text-gray-700" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                            </div>
                        </div>
                        <!-- Body Filter Modal -->
                        <div class="px-2 flex-1">
                            <f7-list style="margin: -12px -12px;">
                                <!-- Sort By Date -->
                                <f7-list-input v-model:value="formFilterData.sortDate" outline label="Sort by Date"
                                    floating-label type="select">
                                    <option value="7">Latest Post</option>
                                    <option value="30">Older Post</option>
                                </f7-list-input>

                                <!-- Filter by Category -->
                                <f7-list-input v-model:value="formFilterData.category" outline label="Filter by category"
                                    floating-label type="select">
                                    <option v-for="category in categories" :key="category.id"
                                        :value="category.category_name">{{ category.category_name }}</option>
                                </f7-list-input>

                                <!-- Item Condition -->
                                <f7-list-input v-model:value="formFilterData.item_condition" outline label="Item Condition"
                                    floating-label type="select">
                                    <option value="New">New</option>
                                    <option value="Used - Like New">Used - Like New</option>
                                    <option value="Used - Good">Used - Good</option>
                                    <option value="Used - Fair">Used - Fair</option>
                                </f7-list-input>

                                <!-- Item Condition -->
                                <f7-list-input v-model:value="formFilterData.item_for_type" outline label="Item For"
                                    floating-label type="select">
                                    <option value="For Sale">For Sale</option>
                                    <option value="For Swap">For Swap</option>
                                    <option value="For Swap and Sale">For Swap and Sale</option>
                                </f7-list-input>

                                <!-- Distance -->
                                <f7-list-input v-model:value="formFilterData.distance" outline label="Distance"
                                    floating-label type="select">
                                    <option v-for="kilometer in kilometersList" :value="kilometer">{{ kilometer == 1 ?
                                        kilometer + ' kilometer' : kilometer + ' kilometers' }}</option>
                                </f7-list-input>
                            </f7-list>
                        </div>
                        <!-- Footer Filter Modal -->
                        <div class="p-2 border-t">
                            <f7-button @click="handleCustomFilter" large fill class="primary-button">Search</f7-button>
                            <p v-if="!isShowClearFilter" class="cursor-pointer pt-2 mb-3 text-center text-red-500"
                                @click="handleResetFilter">Clear Filter
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Item Lists -->
            <div v-if="!isLoadingItem" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-12">
                <div v-for="post in filteredPost" class="w-full border border-gray-200 rounded-lg hover:shadow">
                    <!-- Post-Image-Slider -->
                    <div class="w-full h-52 overflow-hidden rounded-t-lg">
                        <swiper-container :pagination="true" :space-between="0" :slides-per-view="1">
                            <swiper-slide v-for="image in post.images" :id="image.id">
                                <img @click="goToPostDetails(post.id)"
                                    class="w-full h-52 cursor-pointer hover:brightness-75 delay-75 object-cover object-top"
                                    :src="image.img_file_path" alt="">
                            </swiper-slide>
                        </swiper-container>
                    </div>
                    <!-- About Post Item -->
                    <div class="item-post px-3 py-4">
                        <!-- Vendor Profile -->
                        <div class="flex flex-row items-center gap-2">
                            <div class="w-10 h-10 rounded-full overflow-hidden">
                                <img class="w-full h-full object-cover" :src="post.vendor_profile" />
                            </div>
                            <!-- Vendor User Info -->
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
                                <svg class="w-[18px] h-[18px] text-clr-primary" aria-hidden="true"
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
                                <svg class="w-[18px] h-[18px] text-clr-primary" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                                    <path
                                        d="M7 0a7 7 0 0 0-1 13.92V19a1 1 0 1 0 2 0v-5.08A7 7 0 0 0 7 0Zm0 5.5A1.5 1.5 0 0 0 5.5 7a1 1 0 0 1-2 0A3.5 3.5 0 0 1 7 3.5a1 1 0 0 1 0 2Z" />
                                </svg>
                                <p>{{ post.post_address }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="mt-6 mb-12 flex items-center justify-center">
                <f7-preloader />
            </div>
        </SecondaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.browse-container {
    background: #FFF;
    width: 100%;
    height: 100%;
}
</style>