<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMystoreStore } from '../../js/mystore.store';
import TestProfile from '../../assets/profile/test_profile.jpg';

const mystoreStore = useMystoreStore();
const data = ref([]);
const isLoading = ref(false);

const initRender = async () => {
    isLoading.value = true;
    const response = await mystoreStore.GetRatingsByUserID();
    data.value = response.data;
    isLoading.value = false;

    console.log(data.value);
};

onMounted(() => {
    initRender();
});

</script>


<template>
    <!-- Ratings List -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <!-- Rate Box -->
        <div v-for="rating in data" class="border rounded">
            <div class="py-8 text-left px-4 m-2">
                <div class="flex flex-col items-start gap-4">
                    <div class="w-20 h-20 overflow-hidden rounded-full hover:brightness-75 bg-gray-100 shrink-0">
                        <img class="cursor-pointer w-full h-full object-cover" :src="TestProfile" alt="" />
                    </div>
                    <div>
                        <div class="flex items-center gap-1">
                            <template v-for="star in 5" :key="star">
                                <svg :class="{
                                    'w-[20px] h-[20px] text-yellow-400': star <= rating.scale_ratings,
                                    'w-[20px] h-[20px] text-gray-200': star > rating.scale_ratings,
                                }" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            </template>
                        </div>
                        <div class="mt-2 text-yellow-400">
                            <span>{{ rating.scale_ratings }}.0 Ratings</span>
                        </div>
                        <!-- Rate Comment -->
                        <div>
                            <p class="mt-3 text-base text-gray-700">{{ rating.comment }}</p>
                            <p class="mt-2 text-sm font-bold">{{ rating.rated_by_fullname }}</p>
                            <p class="mt-1 text-sm text-gray-600">{{ rating.rated_date }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>