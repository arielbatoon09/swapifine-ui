<script setup>
import { f7 } from 'framework7-vue';
import useCookies from 'vue-cookies'
import { ref, onMounted } from 'vue';
import { useCreditsStore } from '../../js/credits.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';

const currentPage = 'checkout';
const creditsStore = useCreditsStore();
const checkoutData = ref([]);
const isRequestLoad = ref(false);

const initGetCheckoutData = async () => {
    isRequestLoad.value = true;
    const response = await creditsStore.GetAllCheckoutCredits();

    const getCheckoutData = Object.keys(response.data).map(key => ({
        purchase_name: response.data[key].purchase_name,
        ref_key: response.data[key].ref_key,
        checkout_session_id: response.data[key].checkout_session_id,
        checkout_url: response.data[key].checkout_url,
        payment_method: response.data[key].payment_method,
        status: response.data[key].status,
        formattedAmount: response.data[key].amount.toLocaleString(),
        amount: response.data[key].amount,
    }));

    checkoutData.value = getCheckoutData.reverse();

    isRequestLoad.value = false;
};

const CancelCheckout = async (checkout_session_id) => {
    await creditsStore.CancelCheckout(checkout_session_id);

    // Re-render data
    initGetCheckoutData();
};

const DeleteCheckout = async (checkout_session_id) => {
    await creditsStore.DeleteCheckout(checkout_session_id);

    // Re-render data
    initGetCheckoutData();
};

const PayNow = (checkout_url, checkout_session_id) => {
    useCookies.set('CheckoutSession', checkout_session_id);
    window.open(checkout_url, '_blank');
    
};

onMounted(() => {
    initGetCheckoutData();
});

</script>

<template>
    <f7-page class="checkout-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">My Store</h1>
            </template>
            <div class="-mt-6 lg:mt-0"></div>
            <section class="mb-12">
                <div class="flex items-center gap-2 mb-6">
                    <div class="bg-sky-100 p-2 rounded-full">
                        <svg class="w-[24px] h-[24px] text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-600">Checkout List</h2>
                </div>

                <!-- Desktop Table -->
                <div class="hidden md:block relative overflow-x-auto shadow-sm rounded">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    REFERENCE
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Payment Method
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!isRequestLoad" v-for="list in checkoutData" class="bg-white border-b">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    Credits - {{ list.purchase_name }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ list.ref_key }}
                                </td>
                                <td class="px-6 py-4">
                                    ₱ {{ list.formattedAmount }}
                                </td>
                                <td class="px-6 py-4">
                                    <span v-show="list.status == 'Pending'"
                                        class="bg-orange-100 border border-orange-300 p-1 rounded text-orange-500">Pending</span>
                                    <span v-show="list.status == 'Paid'"
                                        class="bg-green-100 border border-green-300 py-1 px-4 rounded text-green-500">Paid</span>
                                    <span v-show="list.status == 'Failed'"
                                        class="bg-red-100 border border-red-300 py-1 px-4 rounded text-red-500">Failed</span>
                                    <span v-show="list.status == 'Cancelled'"
                                        class="bg-red-100 border border-red-300 py-1 px-4 rounded text-red-500">Cancelled</span>
                                </td>
                                <td class="px-6 py-4">
                                    {{ list.payment_method }}
                                </td>
                                <td class="px-6 py-4 flex gap-2">
                                    <div v-show="list.status == 'Pending'"
                                        @click="PayNow(list.checkout_url, list.checkout_session_id, list.amount)"
                                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
                                        Pay Now
                                    </div>
                                    <div v-show="list.status != 'Pending'" @click="DeleteCheckout(list.checkout_session_id)"
                                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
                                        Delete
                                    </div>
                                    <div v-show="list.status == 'Pending'" @click="CancelCheckout(list.checkout_session_id)"
                                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
                                        Cancel
                                    </div>
                                </td>
                            </tr>
                            <tr v-else>
                                <td class="px-6 py-12 bg-white">
                                    <!-- Load  -->
                                </td>
                                <td class="px-6 py-12 bg-white">
                                    <!-- Load  -->
                                </td>
                                <td class="px-6 py-12 bg-white">
                                    <!-- Load  -->
                                    <f7-preloader />
                                </td>
                                <td class="px-6 py-12 bg-white">
                                    <!-- Load  -->
                                </td>
                                <td class="px-6 py-12 bg-white">
                                    <!-- Load  -->
                                </td>
                                <td class="px-6 py-12 bg-white">
                                    <!-- Load  -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Cards -->
                <div class="flex flex-col gap-2 md:hidden">
                    <div v-if="!isRequestLoad" v-for="list in checkoutData" class="bg-white p-6 rounded border border-gray-200">
                        <h3 class="text-gray-700 text-xl font-semibold mb-3">Order Details</h3>
                        <p class="text-base font-medium">Product name: <span class="font-normal">Credits - {{
                            list.purchase_name }}</span></p>
                        <p class="text-base font-medium">Reference: <span class="font-normal">{{ list.ref_key }}</span></p>
                        <p class="text-base font-medium">Amount: <span class="font-normal">₱ {{ list.formattedAmount
                        }}</span></p>
                        <p class="text-base font-medium">
                            Status:
                            <span v-show="list.status == 'Pending'" class="text-orange-500">Pending</span>
                            <span v-show="list.status == 'Paid'" class="text-green-500">Paid</span>
                            <span v-show="list.status == 'Failed'" class="text-red-500">Failed</span>
                            <span v-show="list.status == 'Cancelled'" class="text-red-500">Cancelled</span>
                        </p>
                        <p class="text-base font-medium">Payment Method: <span class="font-normal">{{ list.payment_method
                        }}</span></p>
                        <div class="mt-4 flex flex-col gap-2">
                            <f7-button v-show="list.status == 'Pending'"
                                @click="PayNow(list.checkout_url, list.checkout_session_id, list.amount)" class="primary-button" fill>Pay
                                Now</f7-button>
                            <f7-button v-show="list.status != 'Pending'" @click="DeleteCheckout(list.checkout_session_id)"
                                class="primary-button" fill>Delete</f7-button>
                            <f7-button v-show="list.status == 'Pending'" @click="CancelCheckout(list.checkout_session_id)"
                                class="secondary-button" fill>Cancel</f7-button>
                        </div>
                    </div>
                    <div v-else class="bg-white p-6 rounded border border-gray-200 flex justify-center">
                        <f7-preloader />
                    </div>
                </div>
            </section>
        </SecondaryLayout>
</f7-page></template>

<style scoped lang="scss">.checkout-container {
    background: #F7F8F9;
    width: 100%;
    height: 100%;

    .wrapper-layout {
        background: #F7F8F9;
    }
}</style>