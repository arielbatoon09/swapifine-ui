<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted } from 'vue';
import { useWithdrawalStore } from '../../js/withdrawal.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';

const currentPage = 'withdrawal';
const withdrawalStore = useWithdrawalStore();
const withdrawalData = ref([]);
const withdrawalDetails = ref([]);
const isRequestLoad = ref(false);
const isRequest = ref(false);

const FormData = ref({
    transfer_to: null,
    account_name: null,
    account_number: null,
    amount: null,
});

const renderData = async () => {
    isRequestLoad.value = true;

    const response = await withdrawalStore.GetWithdrawalListByUserID();
    withdrawalData.value = response.data;

    isRequestLoad.value = false;
};

const handleRequestWithdrawal = async () => {
    // Init Loading Request
    isRequest.value = true;

    const { transfer_to, account_name, account_number, amount } = FormData.value;

    const response = await withdrawalStore.RequestWithdrawal(transfer_to, account_name, account_number, amount);

    // Show the toast
    const toast = f7.toast.create({
        text: response.message,
        position: 'top',
        closeButton: true,
        closeButtonText: 'Okay',
        closeButtonColor: response.status == 'success' ? 'green' : 'red',
        closeTimeout: 3000,
    });

    toast.open();

    if (response.status == 'success') {
        // Clean Up Form Input
        FormData.value.transfer_to = null;
        FormData.value.account_name = null;
        FormData.value.account_number = null;
        FormData.value.amount = null;

        f7.popup.close('.popup-request');

        renderData();
    }

        // Init Loading Request
        isRequest.value = false;
};

const GetWithdrawalByID = async (id) => {
    const response = await withdrawalStore.GetWithdrawalByID(id);
    withdrawalDetails.value = response.data;
};

const UpdateWithdrawalStatus = async (id, status) => {
    await withdrawalStore.UpdateWithdrawalStatus(id, status);

    renderData();
};

onMounted(() => {
    renderData();
});
</script>

<template>
    <f7-page class="withdrawal-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Withdrawal</h1>
            </template>
            <div class="-mt-6 lg:mt-0"></div>
            <section class="mb-12">
                <div class="flex items-center gap-2 mb-6">
                    <div class="bg-sky-100 p-2 rounded-full">
                        <svg class="w-[24px] h-[24px] text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 20 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M4 9h2m3 0h5M1 5h18M2 1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-600">Withdraw History</h2>
                </div>

                <!-- Withdraw CTA -->
                <div class="w-32 mb-4">
                    <f7-button popup-open=".popup-request" class="primary-button" large fill>Withdraw</f7-button>
                </div>

                <!-- Desktop Table -->
                <div class="hidden md:block relative overflow-x-auto shadow-sm rounded">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Fullname
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Transfer To
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Amount
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Requested Date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!isRequestLoad" v-for="list in withdrawalData" class="bg-white border-b">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ list.fullname }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ list.transfer_to }}
                                </td>
                                <td class="px-6 py-4">
                                    ₱ {{ list.amount }}
                                </td>
                                <td class="px-6 py-4">
                                    <span v-show="list.status == 'Pending'"
                                        class="bg-orange-100 border border-orange-300 p-1 rounded text-orange-500">Pending</span>
                                    <span v-show="list.status == 'Completed'"
                                        class="bg-green-100 border border-green-300 py-1 px-4 rounded text-green-500">Completed</span>
                                    <span v-show="list.status == 'Rejected'"
                                        class="bg-red-100 border border-red-300 py-1 px-4 rounded text-red-500">Rejected</span>
                                    <span v-show="list.status == 'Cancelled'"
                                        class="bg-red-100 border border-red-300 py-1 px-4 rounded text-red-500">Cancelled</span>
                                </td>
                                <td class="px-6 py-4">
                                    {{ list.date_of_request }}
                                </td>
                                <td class="px-6 py-4 flex gap-2">
                                    <f7-button @click="GetWithdrawalByID(list.id)" popup-open=".popup-withdrawal"
                                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
                                        Details
                                    </f7-button>
                                    <div @click="UpdateWithdrawalStatus(list.id, 'Delete')"
                                        v-show="list.status == 'Rejected' || list.status == 'Cancelled' || list.status == 'Completed'"
                                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
                                        Delete
                                    </div>
                                    <div @click="UpdateWithdrawalStatus(list.id, 'Cancelled')"
                                        v-show="list.status == 'Pending'"
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
                    <div v-if="!isRequestLoad" v-for="list in withdrawalData"
                        class="bg-white p-6 rounded border border-gray-200">
                        <h3 class="text-gray-700 text-xl font-semibold mb-3">Order Details</h3>
                        <p class="text-base font-medium">Fullname: <span class="font-normal">{{
                            list.fullname }}</span></p>
                        <p class="text-base font-medium">Transfer To: <span class="font-normal">{{ list.transfer_to
                        }}</span></p>
                        <p class="text-base font-medium">amount: <span class="font-normal">₱ {{ list.amount }}</span></p>
                        <p class="text-base font-medium">
                            Status:
                            <span v-show="list.status == 'Pending'" class="text-orange-500">Pending</span>
                            <span v-show="list.status == 'Completed'" class="text-green-500">Completed</span>
                            <span v-show="list.status == 'Rejected'" class="text-red-500">Rejected</span>
                            <span v-show="list.status == 'Cancelled'" class="text-red-500">Cancelled</span>
                        </p>
                        <p class="text-base font-medium">Payment Method: <span class="font-normal">{{ list.payment_method
                        }}</span></p>
                        <div class="mt-4 flex flex-col gap-2">
                            <f7-button @click="GetWithdrawalByID(list.id)" popup-open=".popup-withdrawal"
                                class="primary-button" fill>Details</f7-button>
                            <f7-button @click="UpdateWithdrawalStatus(list.id, 'Delete')"
                                v-show="list.status == 'Rejected' || list.status == 'Cancelled' || list.status == 'Completed'"
                                class="secondary-button" fill>Delete
                            </f7-button>
                            <f7-button @click="UpdateWithdrawalStatus(list.id, 'Cancelled')"
                                v-show="list.status == 'Pending'" class="secondary-button" fill>Cancel
                            </f7-button>
                        </div>
                    </div>
                    <div v-else class="bg-white p-6 rounded border border-gray-200 flex justify-center">
                        <f7-preloader />
                    </div>
                    <div v-show="withdrawalData.length == 0" class="bg-white p-6 rounded border border-gray-200 flex justify-center">
                        <p>No Data</p>
                    </div>
                </div>
            </section>

            <!-- Modal Withdrawal Request Pop up -->
            <f7-popup class="popup-request" swipe-to-close>
                <div>
                    <f7-navbar title="Withdrawal Request">
                        <f7-nav-right>
                            <f7-link popup-close>Close</f7-link>
                        </f7-nav-right>
                    </f7-navbar>

                    <!-- Form -->
                    <div class="px-2 flex-1">
                        <f7-list>
                            <!-- Withdrawal Request Details -->
                            <f7-list-input v-model:value="FormData.transfer_to" outline label="Transfer To" floating-label
                                type="select">
                                <option value="GCash">GCash</option>
                                <option value="Maya">Maya</option>
                                <option value="BPI">BPI</option>
                                <option value="BDO">BDO</option>
                            </f7-list-input>

                            <f7-list-input v-model:value="FormData.account_name" outline label="Account Name" floating-label
                                type="text" clear-button></f7-list-input>

                            <f7-list-input v-model:value="FormData.account_number" outline label="Account Number"
                                floating-label type="number" clear-button></f7-list-input>

                            <f7-list-input v-model:value="FormData.amount" outline label="Amount" floating-label
                                type="number" clear-button></f7-list-input>

                            <f7-block class="mt-2">
                                <f7-button preloader :loading="isRequest" @click="handleRequestWithdrawal" class="primary-button" large
                                    fill>Proceed</f7-button>
                            </f7-block>

                            <p class="text-center text-sm"><span class="font-semibold">Note:</span> Minimum withdrawal: P100.00, Maximum: P5000.00</p>
                        </f7-list>
                    </div>
                </div>
            </f7-popup>


            <!-- Modal Withdrawal Details Pop up -->
            <f7-popup class="popup-withdrawal" swipe-to-close>
                <div>
                    <f7-navbar title="Withdrawal Details">
                        <f7-nav-right>
                            <f7-link popup-close>Close</f7-link>
                        </f7-nav-right>
                    </f7-navbar>

                    <!-- Form -->
                    <div class="px-2 flex-1">
                        <f7-list>
                            <!-- Withdrawal Details -->
                            <f7-block v-for="detail in withdrawalDetails">
                                <!-- Account Name -->
                                <div class="border-b border-gray-200 pb-5 mb-5">
                                    <p class="text-gray-700 font-medium">Account name:</p>
                                    <p class="text-gray-600 mt-2 text-base font-light">{{ detail.account_name }}</p>
                                </div>

                                <!-- Bank / E-Wallet -->
                                <div class="border-b border-gray-200 pb-5 mb-5">
                                    <p class="text-gray-700 font-medium">Bank/E-wallet number:</p>
                                    <p class="text-gray-600 mt-2 text-base font-light">{{ detail.account_number }}</p>
                                </div>

                                <!-- Amount -->
                                <div class="border-b border-gray-200 pb-5 mb-5">
                                    <p class="text-gray-700 font-medium">Amount:</p>
                                    <p class="text-gray-600 mt-2 text-base font-light">₱{{ detail.amount }}</p>
                                </div>

                                <!-- Requested Date -->
                                <div class="border-b border-gray-200 pb-5 mb-5">
                                    <p class="text-gray-700 font-medium">Requested Date:</p>
                                    <p class="text-gray-600 mt-2 text-base font-light">{{ detail.date_of_request }}</p>
                                </div>
                            </f7-block>

                            <f7-block class="mt-2">
                                <f7-button class="primary-button" large fill popup-close>Close</f7-button>
                            </f7-block>
                        </f7-list>
                    </div>
                </div>
            </f7-popup>
        </SecondaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.withdrawal-container {
    background: #FFF;
    width: 100%;
    height: 100%;
}

@media (min-width: 630px) and (min-height: 630px) {
    .popup-withdrawal {
        overflow-y: auto;
        height: 600px;
    }

    .popup-request {
        overflow-y: auto;
        height: 550px;
    }
}
</style>