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
        categories.value = await postStore.GetCategoryList();

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
                <h1 class="font-semibold text-lg">Set Location</h1>
            </template>
            <!-- Post Container -->
            <div class="mx-auto lg:w-1/2">
                <div class="bg-white lg:px-4 lg:rounded-lg lg:shadow-md lg:border lg:border-gray-200 mb-12">
                    <div class="set-location-form">
                        <div class="h-600">
                            <f7-block>
                                <div class="bg-blue-100 p-4 mb-4 flex items-center gap-2 rounded-md">
                                    <svg class="w-6 h-6 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor" viewBox="0 0 15 20">
                                        <path
                                            d="M9.092 18h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2Zm-2-18a7.009 7.009 0 0 0-7 7 7.8 7.8 0 0 0 2.219 5.123c.956 1.195 1.781 2.228 1.781 3.877a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1c0-1.7.822-2.7 1.774-3.868A7.63 7.63 0 0 0 14.092 7a7.009 7.009 0 0 0-7-7Zm0 5a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4 1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span>Choose a location where you currently staying.</span>
                                </div>
                                <h2 class="text-lg font-semibold text-gray-700">Change location</h2>
                            </f7-block>
                            <f7-list class="-mt-7">
                                <f7-list-input v-model:value="form.item_name" outline label="Location" floating-label
                                    type="text" clear-button>
                                </f7-list-input>
                                <f7-list-input v-model:value="form.condition" outline label="Radius" floating-label
                                    type="select">
                                    <option value="New">New</option>
                                    <option value="Used - Like New">Used - Like New</option>
                                    <option value="Used - Good">Used - Good</option>
                                    <option value="Used - Fair">Used - Fair</option>
                                </f7-list-input>
                            </f7-list>
                            <!-- Next Step -->
                            <f7-block class="flex gap-4 cta-btn">
                                <f7-link>
                                    <f7-button large fill class="primary-button">Apply</f7-button>
                                </f7-link>
                            </f7-block>
                        </div>
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

    .set-location-form {
        @media only screen and (max-width: 1023px) {
            margin-top: -20px;
        }
    }

    .cta-btn {
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