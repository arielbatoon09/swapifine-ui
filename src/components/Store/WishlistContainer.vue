<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMystoreStore } from '../../js/mystore.store';
import SampleProduct from '../../assets/products/sample2.jpg';
import SampleProduct3 from '../../assets/products/sample3.jpg';

const mystoreStore = useMystoreStore();
const data = ref([]);
const imgSample = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const popup = ref(null);
const photos = ref([
    {
        url: SampleProduct,
        caption: 'Post Title'
    },
    {
        url: SampleProduct,
        caption: 'Post Title'
    },
    {
        url: SampleProduct,
        caption: 'Post Title'
    },
]);

const thumbs = ref([
    SampleProduct,
    SampleProduct,
    SampleProduct,
]);

const openPopup = () => {
    popup.value.open();
};

const initRender = async () => {
    const myPost = await mystoreStore.GetWishlistByUserID();
    data.value = myPost.data;

    console.log(data.value);
};

onMounted(() => {
    initRender();
});


</script>


<template>
    <!-- Wishlist List -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <!-- Images -->
        <div v-for="data in data" class="h-[300px] group relative overflow-hidden bg-gray-100">
            <img :src="data.thumbnail" @click="openPopup" :key="data.id"
                class="cursor-pointer h-full w-full object-cover object-center transition duration-200 group-hover:brightness-75 scale-110">
        </div>
        <f7-photo-browser ref="popup" :photos="photos" :thumbs="thumbs" type="popup" />
    </div>
    <!-- Photo Browser Popup -->
    <f7-photo-browser :photos="photos" :thumbs="thumbs" type="popup" />
</template>