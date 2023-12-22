<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMystoreStore } from '../../js/mystore.store';

const mystoreStore = useMystoreStore();
const data = ref([]);
const popup = ref(null);
const photos = ref([]);
const thumbs = ref([]);
const isLoading = ref(false);
const error = ref(false);

const initRender = async () => {
    isLoading.value = true;
    const myPost = await mystoreStore.GetWishlistByUserID();
    data.value = myPost.data;

    if (data.value === 'No Data Found') {
        error.value = true;
    }


    isLoading.value = false;

    console.log(data.value);
};

// Open Photos Browser
const openPopup = async (id) => {
    const response = await mystoreStore.GetWishlistImagesByID(id);

    const newImages = response.data.map(image => ({
        url: image.images,
        caption: image.caption,
    }));

    photos.value.splice(0, photos.value.length, ...newImages);
    thumbs.value.splice(0, thumbs.value.length, ...newImages);

    popup.value.open();
};

onMounted(() => {
    initRender();
});


</script>


<template>
    <!-- Wishlist List -->
    <div :class="!error ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-2' : ''">
        <!-- Images -->
        <div v-if="!error" v-for="data in data" class="h-[300px] group relative overflow-hidden bg-gray-100">
            <!-- Preview Image -->
            <img :src="data.thumbnail" @click="openPopup(data.id)" :key="data.id"
                class="cursor-pointer h-full w-full object-cover object-center transition duration-200 group-hover:brightness-75 scale-110 z-0" />
        </div>

        <div v-else class="h-[300px] group relative overflow-hidden bg-gray-50 text-center flex justify-center items-center">
            <span class="text-gray-500 text-base">Error: No Data Found</span>
        </div>

        <!-- Photo Browser Popup -->
        <f7-photo-browser ref="popup" :photos="photos" :thumbs="thumbs" type="popup" />
    </div>

    <div v-show="isLoading" class="flex justify-center p-40">
        <f7-preloader />
    </div>
</template>