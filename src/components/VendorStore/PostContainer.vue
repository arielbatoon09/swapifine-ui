<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted } from 'vue';
import { useMystoreStore } from '../../js/mystore.store';
import { usePostStore } from '../../js/post.store';

const postStore = usePostStore();
const mystoreStore = useMystoreStore();
const data = ref([]);
const isOpenModal = ref(false);
const activeModalId = ref(null);
const popup = ref(null);
const photos = ref([]);
const thumbs = ref([]);
const isLoading = ref(false);
const error = ref(false);
const getVendorID = localStorage.getItem('vendorID');

const renderData = async () => {
    isLoading.value = true;
    const response = await mystoreStore.ViewVendorStore(getVendorID);
    data.value = response;

    if (data.value.postData.length <= 0) {
        error.value = true;
    }

    isLoading.value = false;
};

// Redirection to View item Details Page
const goToPostDetails = async (id) => {
    await postStore.GetPostDetails(id);
    const route = `/view/item/${id}`;
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
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

const toggleModal = (id) => {
    isOpenModal.value = !isOpenModal.value;
    activeModalId.value = id;
}

onMounted(() => {
    renderData();
});

</script>


<template>
    <!-- Post List -->
    <div :class="!error ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-2' : ''">
        <!-- Images -->
        <div v-if="!error" v-for="post in data.postData" class="h-[300px] group relative overflow-hidden bg-gray-100">
            <!-- Toggle Modal -->
            <div @click="toggleModal(post.id)"
                class="cursor-pointer z-50 absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-[4px]">
                <svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor" viewBox="0 0 16 3">
                    <path
                        d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
            </div>
            <!-- Modal CTA -->
            <div v-show="isOpenModal && activeModalId === post.id"
                class="bg-white z-50 absolute top-9 right-4 w-[120px] p-2 shadow rounded-l rounded-br">
                <div class="flex flex-col gap-2">
                    <div @click="goToPostDetails(post.id)"
                        class="cursor-pointer flex flex-row items-center gap-2 hover:bg-gray-100 p-1 rounded">
                        <svg class="w-[16px] h-[16px] text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 20 14">
                            <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                            </g>
                        </svg>
                        <span>View Item</span>
                    </div>
                </div>
            </div>
            <!-- Preview Image -->
            <img :src="post.thumbnail" @click="openPopup(post.id)" :key="post.id"
                class="cursor-pointer h-full w-full object-cover object-center transition duration-200 group-hover:brightness-75 scale-110 z-0" />

        </div>

        <div v-else
            class="h-[300px] group relative overflow-hidden bg-gray-50 text-center flex justify-center items-center">
            <span class="text-gray-500 text-base">Error: No Data Found</span>
        </div>

        <!-- Photo Browser -->
        <f7-photo-browser ref="popup" :photos="photos" :thumbs="thumbs" type="popup" />
    </div>

    <div v-show="isLoading" class="flex justify-center p-40">
        <f7-preloader />
    </div>
</template>