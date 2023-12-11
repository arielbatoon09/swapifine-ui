<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from '../js/post.store';

const postStore = usePostStore();
const postData = ref([]);
const searchParam = ref('');
const showAutocompleteResults = ref(false);
const textToShow = ref(false);
const notFound = ref(false);
const viewID = ref(0);
const toastWithButton = ref(null);

const renderData = async () => {
    // Get All Posted Items
    const postResponse = await postStore.GetAllPostItem();
    postData.value = postResponse.data;
    console.log('Search', postData.value);
};

const filteredSearch = computed(() => {
    if (searchParam.value === '') {
        textToShow.value = true;
        notFound.value = false;
        return postData.value.slice(0, 5);
    }
    textToShow.value = false;
    const filteredData = postData.value.filter(post =>
        post.item_name.toLowerCase().includes(searchParam.value.toLowerCase())
    );

    notFound.value = filteredData.length === 0;
    showAutocompleteResults.value = true;

    return filteredData;
});

const closeSearchModal = () => {
    showAutocompleteResults.value = false;
};

const setPostData = async (selectedPost) => {
    viewID.value = selectedPost.id;
    searchParam.value = selectedPost.item_name;
};

const goToPostDetails = async () => {
    if (viewID.value == 0) {
        // Show the toast
        if (!toastWithButton.value) {
            toastWithButton.value = f7.toast.create({
                text: 'Not found: Click the result!',
                position: 'top',
                closeButton: true,
                closeButtonText: 'Okay',
                closeButtonColor: 'red',
                closeTimeout: 3000,
            });
        }

        // Open the toast
        toastWithButton.value.open();
        return;
    }
    await postStore.GetPostDetails(viewID.value);
    const route = `/view/item/${viewID.value}`;
    const animate = window.innerWidth <= 1023;

    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

onMounted(() => {
    renderData();
});

</script>

<template>
    <!-- Global Search -->
    <div class="w-1/2 mx-8 relative flex">
        <!-- Input -->
        <input v-model="searchParam" placeholder="What items are you looking for?"
            class="border rounded-l-md px-4 py-3 flex-1" />
        <div @click="goToPostDetails"
            class="absolute bg-gray-800 hover:bg-gray-700 cursor-pointer text-white rounded-r-md px-4 py-3 top-0 right-0 flex items-center h-full">
            <svg class="text-white w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
        </div>
        <!-- Autocomplete Search -->
        <div v-show="showAutocompleteResults"
            class="bg-white shadow-lg rounded absolute top-12 w-full max-h-[300px] overflow-y-auto border border-gray-200">
            <div class="flex items-center justify-between px-4 pt-4">
                <p v-if="textToShow" class="font-medium">Recommended</p>
                <p v-else class="font-medium">Search Result</p>
                <!-- Close Search Modal -->
                <svg @click="closeSearchModal" class="w-[14px] h-[14px] text-gray-600 hover:text-gray-700 cursor-pointer"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </div>
            <ul class="p-2">
                <li v-if="notFound" class="p-2 text-gray-700">
                    Nothing found
                </li>
                <li @click="setPostData(data)" v-for="data in filteredSearch"
                    class="cursor-pointer hover:bg-gray-100 p-2 text-gray-700 rounded flex items-center gap-3">
                    <img class="rounded-full w-8 h-8 object-cover" :src="data.images[0].img_file_path">
                    <p>{{ data.item_name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>