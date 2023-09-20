<script setup>
import { onMounted, ref } from 'vue';
import { f7 } from 'framework7-vue';
import { usePostStore } from '../../js/post.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';

const postStore = usePostStore();
const selectedImages = ref([]);
const selectedImagesCount = ref(0);
const fileInput = ref(null);
const toastWithButton = ref(null);
const isRequest = ref(false);
const categories = ref([]);

const form = ref({
  category_id: null,
  location_id: 1,
  item_name: '',
  item_description: '',
  item_stocks: '',
  condition: '',
  item_for_type: '',
  item_cash_value: '',
  img_file_path: [],

});

onMounted(async () => {
  try {
    // Assign Category list data to categories variable
    categories.value = await postStore.getCategoryList();

  } catch (error) {

  }
});

const handlePostItem = async () => {
  try {
    // Init Loading Request
    isRequest.value = true;

    // Get Value of form data
    const { category_id, location_id, item_name, item_description, item_cash_value, item_stocks, condition,
      item_for_type } = form.value;

    // Create an array to store file data
    const files = [];

    // Convert File objects to base64 encoded strings
    for (const file of form.img_file_path) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      await new Promise((resolve) => {
        reader.onload = (e) => {
          files.push({ name: file.name, data: e.target.result });
          resolve();
        };
      });
    }

    // Distribute data to PostItem store
    const response = await postStore.PostItem(category_id, location_id, item_name, item_description,
      item_stocks, condition, item_for_type, item_cash_value, files);

    // Cancel loading state if the response is true
    if (response) {
      isRequest.value = false;
    }

    // Success State
    if (response.status == 'success') {
      form.value.category_id = null;
      form.value.location_id = null;
      form.value.item_name = null;
      form.value.item_description = null;
      form.value.item_stocks = null;
      form.value.condition = null;
      form.value.item_for_type = null;
      form.value.item_cash_value = null;
      form.value.files = null;

      // Show the toast
      if (!toastWithButton.value) {
        toastWithButton.value = f7.toast.create({
          text: 'Posted item successfully!',
          position: 'top',
          closeButton: true,
          closeButtonText: 'Okay',
          closeButtonColor: 'green',
          closeTimeout: 3000,
        });
      }

      // Open the toast
      toastWithButton.value.open();

      // Redirect the user to home page
      f7.views.main.router.navigate('/home');
    }

    console.log(response);

  } catch (error) {
    console.error("Error:", error);
  }
}

// const handleImageChange = (event) => {
//   const files = Array.from(event.target.files);

//   // Filter files to only include JPG, JPEG, and PNG
//   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//   const selectedFiles = files.filter((file) => allowedTypes.includes(file.type));
//   console.log('selected: '+selectedFiles);

//   // Set the value to form.img_file_path
//   // form.img_file_path = files;
//   form.img_file_path = selectedFiles;


//   // Display selected images
//   selectedFiles.forEach((file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       selectedImages.value.push({ file, url: e.target.result });
//       selectedImagesCount.value = selectedImages.value.length;
//     };
//     reader.readAsDataURL(file);
//   });

// };

const handleImageChange = (event) => {
  const files = Array.from(event.target.files);

  // Filter files to only include JPG, JPEG, and PNG
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const selectedFiles = files.filter((file) => allowedTypes.includes(file.type));

  // Initialize form.img_file_path as an empty array if it's not already an array
  if (!Array.isArray(form.img_file_path)) {
    form.img_file_path = [];
  }

  // Append selectedFiles to the existing form.img_file_path array
  form.img_file_path = [...form.img_file_path, ...selectedFiles];

  // Display selected images
  selectedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImages.value.push({ file, url: e.target.result });
      selectedImagesCount.value = selectedImages.value.length;
    };
    reader.readAsDataURL(file);
  });
};


const removeImage = (index) => {
  // Remove the selected image from the array
  selectedImages.value.splice(index, 1);
  form.img_file_path.splice(index, 1);
  selectedImagesCount.value = selectedImages.value.length;
};
</script>

<template>
  <f7-page class="post-container">
    <SecondaryLayout>
      <!-- Header -->
      <template v-slot:header-title>
        <h1 class="font-semibold text-lg">Post new item</h1>
      </template>
      <!-- Post Container -->
      <div class="mx-auto lg:w-1/2">
        <div class="bg-white lg:px-4 lg:rounded-lg lg:shadow-md lg:border lg:border-gray-200 mb-12">
          <!-- Item Form -->
          <div class="post-item-form">
            <f7-tabs animated class="h-600">
              <!-- Step #1 -->
              <f7-tab id="step-1" class="page-content" tab-active>
                <!-- Upload Image and Preview -->
                <f7-block class="post-upload-image">
                  <!-- Tips -->
                  <div class="bg-blue-100 p-4 mb-4 flex items-center gap-2 rounded-md">
                    <svg class="w-6 h-6 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor" viewBox="0 0 15 20">
                      <path
                        d="M9.092 18h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2Zm-2-18a7.009 7.009 0 0 0-7 7 7.8 7.8 0 0 0 2.219 5.123c.956 1.195 1.781 2.228 1.781 3.877a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1c0-1.7.822-2.7 1.774-3.868A7.63 7.63 0 0 0 14.092 7a7.009 7.009 0 0 0-7-7Zm0 5a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4 1 1 0 0 1 0 2Z" />
                    </svg>
                    <span>Adding more photos can help attract interested buyers.</span>
                  </div>
                  <h2 class="text-xl font-medium">Add Item Images</h2>
                  <p class="text-gray-600">Photos · {{ selectedImagesCount }} / 10</p>
                  <!-- Conditionally render the uploaded images or the upload container -->
                  <swiper-container v-if="selectedImagesCount > 0" :pagination="true" class="w-full h-72 mt-4"
                    :space-between="50" :key="selectedImagesCount">
                    <swiper-slide v-for="(image, index) in selectedImages" :key="index"
                      class="flex items-center justify-center bg-gray-200 relative-group">
                      <div class="max-w-full">
                        <img :src="image.url" alt="Selected Image" class="object-contain max-w-full h-auto" />
                      </div>
                      <!-- Remove Image -->
                      <div @click="removeImage(index)" class="absolute right-0 top-0 mr-4 mt-4">
                        <svg
                          class="cursor-pointer w-[24px] h-[24px] text-gray-800 bg-white hover:bg-gray-200 duration-75 delay-75 ease-in rounded-full"
                          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"
                            d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                    </swiper-slide>
                  </swiper-container>
                  <!-- Select Image Container -->
                  <div v-show="selectedImagesCount < 10" class="mt-4">
                    <label for="images"
                      class="cursor-pointer py-16 border border-gray-200 hover:bg-gray-100 duration-75 delay-75 ease-in rounded-md flex flex-col justify-center items-center">
                      <svg class="w-[48px] h-[48px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path fill="currentColor"
                          d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.6"
                          d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.6"
                          d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                      </svg>
                      <div class="text-center">
                        <h4 class="font-medium text-xl mt-3 mb-1">Add Photos</h4>
                        <p>You can add up to 10 photos.</p>
                      </div>
                    </label>
                    <!-- Wrap the file input in a div -->
                    <div style="display: none;">
                      <!-- <input type="file" id="images" name="images[]" multiple accept="image/*" ref="fileInput"
                        @change="handleImageChange" />
                    </div> -->
                      <input type="file" id="images" name="images[]" multiple ref="fileInput"
                        @change="handleImageChange" />
                    </div>
                  </div>
                  <!-- Next Step -->
                  <div class="mt-4">
                    <f7-link tab-link="#step-2">
                      <f7-button large fill class="primary-button">Next</f7-button>
                    </f7-link>
                  </div>
                </f7-block>
                <!-- Upload Image and Preview End -->
              </f7-tab>

              <!-- Step #2 -->
              <f7-tab id="step-2" class="page-content">
                <f7-block class="step-title">
                  <h2 class="text-xl font-medium">About Item</h2>
                  <p class="text-gray-600">Be as descriptive as possible.</p>
                </f7-block>
                <f7-list>
                  <f7-list-input v-model:value="form.item_name" outline label="Item Name" floating-label type="text"
                    clear-button></f7-list-input>
                  <f7-list-input v-model:value="form.item_description" outline label="Description" floating-label
                    type="textarea" clear-button></f7-list-input>
                  <f7-list-input v-model:value="form.item_stocks" outline label="Stocks (Qty)" floating-label type="text"
                    clear-button></f7-list-input>
                </f7-list>
                <!-- Next Step -->
                <f7-block class="flex gap-4 step-cta">
                  <f7-link tab-link="#step-1">
                    <f7-button large fill class="secondary-button">Back</f7-button>
                  </f7-link>
                  <f7-link tab-link="#step-3">
                    <f7-button large fill class="primary-button">Next</f7-button>
                  </f7-link>
                </f7-block>
              </f7-tab>

              <!-- Step #3 -->
              <f7-tab id="step-3" class="page-content">
                <f7-block class="step-title">
                  <h2 class="text-xl font-medium">More Details</h2>
                  <p class="text-gray-600">Attract more interest by including more details.</p>
                </f7-block>
                <f7-list>
                  <f7-list-input v-model:value="form.category_id" outline label="Category" floating-label type="select">
                    <option v-for="category in categories" :value="category.id" :key="category.id">{{
                      category.category_name }}</option>
                  </f7-list-input>
                  <f7-list-input v-model:value="form.condition" outline label="Condition" floating-label type="select">
                    <option value="New">New</option>
                    <option value="Used - Like New">Used - Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </f7-list-input>
                  <f7-list-input v-model:value="form.item_for_type" outline label="Item for" floating-label type="select">
                    <option value="For Sale">For Sale</option>
                    <option value="For Swap">For Swap</option>
                    <option value="For Swap and Sale">For Swap and Sale</option>
                  </f7-list-input>
                  <f7-list-input v-model:value="form.item_cash_value" outline label="₱ Cash Value" floating-label type="text"
                    clear-button>
                  </f7-list-input>
                </f7-list>
                <!-- Next Step -->
                <f7-block class="flex gap-4 step-cta">
                  <f7-link tab-link="#step-2">
                    <f7-button large fill class="secondary-button">Back</f7-button>
                  </f7-link>
                  <!-- Publish Button -->
                  <f7-link>
                    <f7-button preloader :loading="isRequest" @click="handlePostItem" large fill
                      class="primary-button">Publish</f7-button>
                  </f7-link>
                </f7-block>
              </f7-tab>
            </f7-tabs>
          </div>
        </div>
      </div>
    </SecondaryLayout>
  </f7-page>
</template>

<style scoped lang="scss">
.post-container {
  background: #FFF;
  width: 100%;
  height: 100%;

  .post-item-form {
    @media only screen and (max-width: 1023px) {
      margin-top: -50px;
    }
  }

  .step-title {
    margin-bottom: -15px;
  }

  .step-cta {
    margin-top: -24px;
  }

  .page-content {
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;

    &::-webkit-scrollbar {
      width: 5px;
      background-color: #ccc;
      transition: width 0.3s ease;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #003D66;
    }
  }
}
</style>