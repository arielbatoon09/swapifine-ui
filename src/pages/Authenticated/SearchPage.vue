<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from '../../js/post.store';

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
  console.log('Search Mobile', postData.value);
};

const goToPostDetails = async (selectedPost) => {
  viewID.value = selectedPost.id;
  searchParam.value = selectedPost.item_name;

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
  <f7-page>
    <f7-navbar>
      <f7-subnavbar :inner="false">
        <f7-searchbar search-container=".search-list" search-in=".item-title"></f7-searchbar>
      </f7-subnavbar>
      <f7-link back class="flex items-center gap-2">
        <svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9" />
        </svg>
        <p class="mt-2">Go Back</p>
      </f7-link>
    </f7-navbar>
    <f7-list strong-ios outline-ios dividers-ios class="searchbar-not-found">
      <f7-list-item title="Nothing found" />
    </f7-list>
    <f7-list strong-ios outline-ios dividers-ios class="search-list searchbar-found">
      <f7-list-item @click="goToPostDetails(data)" v-for="data in postData" :title="data.item_name">
        <template #media>
          <img class="rounded-full w-8 h-8 object-cover" :src="data.images[0].img_file_path">
        </template>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
