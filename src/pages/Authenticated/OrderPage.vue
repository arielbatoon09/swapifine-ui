<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useTransactionStore } from '../../js/transaction.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import AllOrder from '../../components/Orders/All.vue';
import InProgressOrder from '../../components/Orders/Inprogress.vue';
import RequirementsOrder from '../../components/Orders/Requirementlist.vue';
import DeliverOrder from '../../components/Orders/Deliver.vue';
import CompletedOrder from '../../components/Orders/Completed.vue';
import ReviewOrder from '../../components/Orders/Review.vue';
import CancelledOrder from '../../components/Orders/Cancelled.vue';

const currentPage = 'orders';
const transactionStore = useTransactionStore();
const isScrollableTab = ref(false);
const transactionData = ref([]);
const isRequest = ref(false);
let resizeListener = null;

const initRenderData = async () => {
    isRequest.value = true;
    const response = await transactionStore.GetUserTransactions();
    transactionData.value = response.data;
    console.log(transactionData.value);
    isRequest.value = false;
};

const checkScrollableTab = () => {
    isScrollableTab.value = window.innerWidth <= 992;
};

const refreshData = async () => {
    isRequest.value = true;
    const response = await transactionStore.GetUserTransactions();
    transactionData.value = response.data;
    isRequest.value = false;
};

// To Handle child action button
const handleButtonEvent = () => {
    const handleButtonClick = (event) => {
        if (event.target.classList.contains('refresh-data')) {
            initRenderData();
        }
    };

    document.addEventListener('click', handleButtonClick);
    onUnmounted(() => {
        document.removeEventListener('click', handleButtonClick);
    });
};

onMounted(async () => {
    checkScrollableTab();
    resizeListener = window.addEventListener('resize', checkScrollableTab);

    initRenderData();
    
    handleButtonEvent();

});

onBeforeUnmount(() => {
    if (resizeListener) {
        window.removeEventListener('resize', checkScrollableTab);
    }
});

</script>

<template>
    <f7-page class="order-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Orders</h1>
            </template>
            <div class="-mt-6 lg:mt-0"></div>
            <section class="mb-12 lg:max-w-screen-xl mx-auto">
                <div class="mb-6">
                    <h2 class="text-3xl font-medium mb-1">Manage Orders</h2>
                    <p class="text-gray-500">Always keep on track with your orders.</p>
                </div>

                <!-- Tab Bar Navigation -->
                <f7-toolbar top tabbar :scrollable="isScrollableTab">
                    <f7-link tab-link="#all" tab-link-active tooltip="All Orders">
                        <div class="relative p-3">
                            <span>All</span>
                            <!-- Number Indicator -->
                            <!-- <div v-show="transactionData.length > 0" class="absolute top-1 -right-2 z-0">
                                <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                    <span class="text-white absolute -top-[0.50px] left-[5px]">{{ transactionData.length
                                    }}</span>
                                </div>
                            </div> -->
                        </div>
                    </f7-link>
                    <f7-link tab-link="#in-progress" tooltip="Step 1">
                        <div class="relative p-2">
                            <span>In Progress</span>
                            <!-- Number Indicator -->
                            <!-- <div v-show="transactionData.length > 0" class="absolute top-1 -right-2 z-0">
                                <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                    <span class="text-white absolute -top-[0.50px] left-[5px]">{{ InProgressLength }}</span>
                                </div>
                            </div> -->
                        </div>
                    </f7-link>
                    <f7-link tab-link="#requirements" tooltip="Step 2">
                        <div class="relative p-2">
                            <span>Requirements</span>
                            <!-- Number Indicator -->
                            <!-- <div class="absolute -top-4 -left-3 z-0">
                                    <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                        <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
                                    </div>
                                </div> -->
                        </div>
                    </f7-link>
                    <f7-link tab-link="#to-deliver" tooltip="Step 3">
                        <div class="relative p-2">
                            <span>To Deliver</span>
                            <!-- Number Indicator -->
                            <!-- <div class="absolute -top-4 -left-3 z-0">
                                    <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                        <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
                                    </div>
                                </div> -->
                        </div>
                    </f7-link>
                    <f7-link tab-link="#completed" tooltip="Step 4">
                        <div class="relative p-2">
                            <span>Completed</span>
                            <!-- Number Indicator -->
                            <!-- <div class="absolute -top-4 -left-3 z-0">
                                    <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                        <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
                                    </div>
                                </div> -->
                        </div>
                    </f7-link>
                    <f7-link tab-link="#to-review" tooltip="Step 5">
                        <div class="relative p-2">
                            <span>To Review</span>
                            <!-- Number Indicator -->
                            <!-- <div class="absolute -top-4 -left-3 z-0">
                                    <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                        <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
                                    </div>
                                </div> -->
                        </div>
                    </f7-link>
                    <f7-link tab-link="#cancelled" tooltip="Cancelled Orders">
                        <div class="relative p-2">
                            <span>Cancelled</span>
                            <!-- Number Indicator -->
                            <!-- <div class="absolute -top-4 -left-3 z-0">
                                    <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                        <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
                                    </div>
                                </div> -->
                        </div>
                    </f7-link>
                </f7-toolbar>
                <div class="-mb-12"></div>

                <f7-tabs>
                    <!-- All Orders List -->
                    <f7-tab id="all" class="page-content" tab-active>
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <AllOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>

                    <f7-tab id="in-progress" class="page-content">
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <InProgressOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>
                    <f7-tab id="requirements" class="page-content">
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <RequirementsOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>
                    <f7-tab id="to-deliver" class="page-content">
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <DeliverOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>
                    <f7-tab id="completed" class="page-content">
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <CompletedOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>
                    <f7-tab id="to-review" class="page-content">
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <ReviewOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>
                    <f7-tab id="cancelled" class="page-content">
                        <!-- Refresh Button -->
                        <div class="mt-3 mb-6 flex gap-2 cursor-pointer">
                            <svg class="w-[16px] h-[16px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
                            </svg>
                            <span @click="refreshData" class="text-clr-primary">Refresh List</span>
                        </div>
                        <CancelledOrder :isRequest="isRequest" :data="transactionData" />
                    </f7-tab>
                </f7-tabs>
            </section>
        </SecondaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.order-container {
    background: #F7F8F9;
    width: 100%;
    height: 100%;

    .wrapper-layout {
        background: #F7F8F9;
    }

    .toolbar {
        background-color: #FFF;
        border-bottom: 1px solid #D9D9D9;
        z-index: 5;
    }
}
</style>