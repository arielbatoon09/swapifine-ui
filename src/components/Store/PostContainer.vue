<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMystoreStore } from '../../js/mystore.store';
import SampleProduct from '../../assets/products/sample2.jpg';

const mystoreStore = useMystoreStore();
const data = ref([]);
const isOpenModal = ref(false);
const popup = ref(null);
const imageID = ref(null);
const photos = ref([]);
const thumbs = ref([]);

const initRender = async () => {
    const myPost = await mystoreStore.GetPostByUserID();
    data.value = myPost.data;

    console.log(data.value);
};

// Open Photos Browser
const openPopup = async (id) => {
    const response = await mystoreStore.GetPostImagesByID(id);
    
    const newImages = response.data.map(image => ({
        url: image.images,
        caption: image.caption,
    }));

    photos.value.splice(0, photos.value.length, ...newImages);
    thumbs.value.splice(0, thumbs.value.length, ...newImages);

    popup.value.open();
};

const toggleModal = () => {
    isOpenModal.value = !isOpenModal.value;
}

onMounted(() => {
    initRender();
});

</script>


<template>
    <!-- Post List -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <!-- Images -->
        <div v-for="data in data" class="h-[300px] group relative overflow-hidden bg-gray-100">
            <!-- Toggle Modal -->
            <div @click="toggleModal"
                class="cursor-pointer z-50 absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-[4px]">
                <svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor" viewBox="0 0 16 3">
                    <path
                        d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
            </div>
            <!-- Modal -->
            <div v-show="isOpenModal"
                class="bg-white z-50 absolute top-9 right-4 w-[120px] p-2 shadow rounded-l rounded-br">
                <div class="flex flex-col gap-2">
                    <div class="cursor-pointer flex flex-row items-center gap-2 hover:bg-gray-100 p-1 rounded">
                        <svg class="w-[14px] h-[14px] text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                        </svg>
                        <span>Unlisted</span>
                    </div>
                    <div class="cursor-pointer flex flex-row items-center gap-2 hover:bg-gray-100 p-1 rounded">
                        <svg class="w-[14px] h-[14px] text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 21 21">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279" />
                        </svg>
                        <span>Edit Post</span>
                    </div>
                </div>
            </div>
            <!-- Preview Image -->
            <img :src="data.thumbnail" @click="openPopup(data.id)" :key="data.id"
                class="cursor-pointer h-full w-full object-cover object-center transition duration-200 group-hover:brightness-75 scale-110 z-0" />

        </div>

        <!-- Photo Browser -->
        <f7-photo-browser ref="popup" :photos="photos" :thumbs="thumbs" type="popup" />
    </div>
</template>