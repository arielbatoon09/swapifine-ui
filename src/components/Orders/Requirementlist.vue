<script setup>
import { f7 } from 'framework7-vue';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import { usePostStore } from '../../js/post.store';
import { useTransactionStore } from '../../js/transaction.store';

const authStore = useAuthStore();
const postStore = usePostStore();
const transactionStore = useTransactionStore();
const itemsPerPage = ref(5);
const currentPage = ref(1);
const reqData = ref([]);
const toastWithButton = ref(null);

const props = defineProps({
    data: Array,
    isRequest: Boolean,
});

const FormData = ref({
    transaction_id: null,
    payment_method: null,
    delivery_address: null,
    user_notes: null,
});

const SetTransacID = (transaction_id) => {
    FormData.value.transaction_id = transaction_id;

    initRenderRequirementsData(transaction_id);
};

const initRenderRequirementsData = async (transaction_id) => {
    const response = await transactionStore.GetAdditionalInformation(transaction_id);
    reqData.value = response.data;
};

const HandleAdditional = async () => {
    const { transaction_id, payment_method, delivery_address, user_notes } = FormData.value;

    const response = await transactionStore.AdditionalInformation(transaction_id, payment_method, delivery_address, user_notes);

    if (response.status == 'success') {
        FormData.value.transaction_id = null;
        FormData.value.payment_method = null;
        FormData.value.delivery_address = null;
        FormData.value.user_notes = null;

        // Show the success toast
        toastWithButton.value = f7.toast.create({
            text: response.message,
            position: 'top',
            closeButton: true,
            closeButtonText: 'Okay',
            closeButtonColor: 'green',
            closeTimeout: 3000,
        });

        // Close Popup Modal
        f7.popup.close('.popup-requirements');
    } else {
        toastWithButton.value = f7.toast.create({
            text: response.message,
            position: 'top',
            closeButton: true,
            closeButtonText: 'Okay',
            closeButtonColor: 'red',
            closeTimeout: 3000,
        });
    }


    // Open the toast
    if (toastWithButton.value) {
        toastWithButton.value.open();
    }
};

// Compute the total number of pages based on the itemsPerPage and data length
const totalPages = computed(() => {
    const filteredData = props.data.filter(transaction => 
    transaction.status === 'Requirements' || transaction.status === 'To Deliver'
    );
    return Math.ceil(filteredData.length / itemsPerPage.value);
});

// Compute the currently visible page's data
const paginatedData = computed(() => {
    const filteredData = props.data.filter(transaction => 
    transaction.status === 'Requirements' || transaction.status === 'To Deliver'
    );
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;

    const paginatedData = filteredData.slice(startIndex, endIndex);

    return paginatedData.reverse();
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
};

const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        currentPage.value = pageNumber;
    }
};

// Redirection to View item Details Page
const goToPostDetails = async (post_item_id, post_item_key) => {

    const route = `/view/item/${post_item_id}`;
    const animate = window.innerWidth <= 1023;

    await postStore.GetPostDetails(post_item_key);

    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

const doMoveToInbox = async () => {
    const animate = window.innerWidth <= 1023;

    f7.views.main.router.navigate('/inbox', {
        animate: animate,
    });
};
</script>


<template>
    <div class="mt-4">
        <!-- List -->
        <div class="flex flex-col gap-2">
            <div v-for="data in paginatedData" class="bg-white p-6 rounded border border-gray-200">
                <!-- Header -->
                <div class="flex flex-row justify-between items-start gap-2 border-b border-gray-200 pb-4">
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-1">
                            <svg class="w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M3.308 9a2.257 2.257 0 0 0 2.25-2.264 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 0 0 4.5 0 2.25 2.25 0 1 0 4.5 0C19.058 5.471 16.956 1 16.956 1H3.045S1.058 5.654 1.058 6.736A2.373 2.373 0 0 0 3.308 9Zm0 0a2.243 2.243 0 0 0 1.866-1h.767a2.242 2.242 0 0 0 3.733 0h.767a2.242 2.242 0 0 0 3.733 0h.767a2.247 2.247 0 0 0 1.867 1A2.22 2.22 0 0 0 18 8.649V19H9v-7H5v7H2V8.524c.37.301.83.469 1.308.476ZM12 12h3v3h-3v-3Z" />
                            </svg>
                            <span class="text-base font-medium">{{ data.vendor_name }} <span
                                    class="text-gray-700 text-sm font-light">{{ data.vendor_id == authStore.user?.id ?
                                        '(You)' : '' }}</span></span>
                        </div>
                        <!-- View Store CTA -->
                        <div class="cursor-pointer bg-clr-primary flex justify-center items-center gap-2 py-1 px-2 rounded">
                            <svg class="w-[14px] h-[14px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                            </svg>
                            <span @click="doMoveToInbox" class="text-white">Open Inbox</span>
                        </div>
                    </div>
                    <span class="text-clr-primary text-base">Requirements</span>
                </div>
                <!-- Body -->
                <div class="mt-4 flex items-center gap-4 pb-6">
                    <div class="w-24 h-24 overflow-hidden rounded bg-gray-100 border border-gray-200">
                        <img @click="goToPostDetails(data.post_item_id, data.post_item_key)"
                            class="cursor-pointer h-full w-full object-cover object-center hover:brightness-75"
                            :src="data.thumbnail">
                    </div>
                    <div class="space-y-1">
                        <h2 class="text-base font-semibold">{{ data.buyer_name }} • {{ data.item_name }}</h2>
                        <p><span class="font-medium">Category:</span> {{ data.category_name }}</p>
                        <p><span class="font-medium">Price:</span> ₱{{ data.cash_value }}</p>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex justify-end border-t py-4">
                    <div class="flex w-full md:w-auto">
                        <f7-button @click="SetTransacID(data.transaction_id)" v-if="data.vendor_id != authStore.user?.id"
                            fill class="primary-button" popup-open=".popup-requirements">Provide
                        </f7-button>
                        <f7-button @click="SetTransacID(data.transaction_id)" v-else fill class="secondary-button" popup-open=".popup-details">Details</f7-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Requirements Pop up -->
        <f7-popup class="popup-requirements" swipe-to-close>
            <f7-page>
                <f7-navbar title="Add Details">
                    <f7-nav-right>
                        <f7-link popup-close>Close</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <!-- Form -->
                <div class="px-2 flex-1">
                    <f7-list>
                        <!-- Payment Method -->
                        <f7-list-input v-model:value="FormData.payment_method" outline label="Payment Method" floating-label
                            type="select">
                            <option value="cod">Cash on Delivery</option>
                            <option value="credits">Swapifine Credits</option>
                        </f7-list-input>

                        <!-- Address -->
                        <f7-list-input v-model:value="FormData.delivery_address" outline label="Delivery Address"
                            floating-label type="text" clear-button>
                        </f7-list-input>

                        <!-- Add Note -->
                        <f7-list-input v-model:value="FormData.user_notes" outline label="Other Information"
                            floating-label type="textarea" clear-button>
                        </f7-list-input>

                        <f7-block class="mt-2">
                            <f7-button @click="HandleAdditional" class="refresh-data primary-button" preloader large
                                fill>Submit</f7-button>
                        </f7-block>
                    </f7-list>
                </div>
            </f7-page>
        </f7-popup>

        <!-- Modal Requirements Details Pop up -->
        <f7-popup class="popup-details" swipe-to-close>
            <f7-page>
                <f7-navbar title="Details">
                    <f7-nav-right>
                        <f7-link popup-close>Close</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <!-- Form -->
                <div class="px-2 flex-1 overflow-y-auto">
                    <f7-list>
                        <!-- Payment Method -->
                        <f7-list-input v-show="reqData.payment_method == 'cod'" disabled outline label="Payment Method" :value="reqData.payment_method == 'cod' ? 'Cash on Delivery' : ''"
                            floating-label type="text">
                        </f7-list-input>

                        <f7-list-input v-show="reqData.payment_method == 'ewallet'" disabled outline label="Payment Method" :value="reqData.payment_method == 'ewallet' ? 'E-Wallet' : ''"
                            floating-label type="text">
                        </f7-list-input>

                        <f7-list-input v-show="reqData.payment_method == 'credits'" disabled outline label="Payment Method" :value="reqData.payment_method == 'credits' ? 'Swapifine Credits' : ''"
                            floating-label type="text">
                        </f7-list-input>

                        <f7-list-input v-show="reqData.payment_method == null" disabled outline label="Payment Method" :value="reqData.payment_method == null ? 'No Data Yet' : ''"
                            floating-label type="text">
                        </f7-list-input>


                        <!-- Address -->
                        <f7-list-input v-show="reqData.delivery_address != null" disabled outline label="Delivery Address" :value="reqData.delivery_address"
                            floating-label type="text">
                        </f7-list-input>

                        <f7-list-input v-show="reqData.delivery_address == null" disabled outline label="Delivery Address" value="No Data Yet"
                            floating-label type="text">
                        </f7-list-input>

                        <!-- Add Note -->
                        <f7-list-input v-show="reqData.user_notes != null" disabled outline label="Other Information" :value="reqData.user_notes"
                            floating-label type="textarea">
                        </f7-list-input>
                        
                        <f7-list-input v-show="reqData.user_notes == null" disabled outline label="Other Information" value="No Data Yet"
                            floating-label type="textarea">
                        </f7-list-input>
                    </f7-list>
                </div>
            </f7-page>
        </f7-popup>        

        <!-- Show if No Data -->
        <div v-show="props.data.length < 1"
            class="bg-white px-6 py-12 rounded border border-gray-200 flex flex-col items-center justify-center">
            <div v-show="isRequest">
                <f7-preloader />
            </div>
            <p class="pt-5 text-gray-500 text-base">No Order Found</p>
        </div>

        <!-- Pagination Button -->
        <div v-if="props.data.length > itemsPerPage" class="mt-6 flex justify-center items-center">
            <div class="sm:w-1/3 md:w-1/4 lg:w-1/6">
                <div class="flex items-center">
                    <div class="cursor-pointer bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                        @click="previousPage" :disabled="currentPage === 1">
                        Previous
                    </div>

                    <!-- Display page numbers dynamically -->
                    <div v-for="pageNumber in totalPages" :key="pageNumber"
                        class="cursor-pointer bg-white border border-gray-300 px-4 py-2 text-gray-500 hover:bg-gray-100"
                        @click="goToPage(pageNumber)"
                        :class="{ 'bg-blue-50 hover:bg-blue-50': currentPage === pageNumber }">
                        {{ pageNumber }}
                    </div>

                    <div class="cursor-pointer bg-white border border-gray-300 rounded-r-lg px-3 py-2 text-gray-500 hover-bg-gray-100"
                        @click="nextPage" :disabled="currentPage === totalPages">
                        Next
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@media (min-width: 630px) and (min-height: 630px) {
    .popup-details {
        height: 440px;
    }
}
</style>