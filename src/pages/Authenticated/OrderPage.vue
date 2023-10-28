<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import AllOrder from '../../components/Orders/All.vue';
import InProgressOrder from '../../components/Orders/Inprogress.vue';
import RequirementsOrder from '../../components/Orders/Requirementlist.vue';
import DeliverOrder from '../../components/Orders/Deliver.vue';
import CompletedOrder from '../../components/Orders/Completed.vue';
import ReviewOrder from '../../components/Orders/Review.vue';
import CancelledOrder from '../../components/Orders/Cancelled.vue';

const currentPage = 'orders';
const isScrollableTab = ref(false);
let resizeListener = null;

const checkScrollableTab = () => {
    isScrollableTab.value = window.innerWidth <= 992;
};

onMounted(async () => {
    resizeListener = window.addEventListener('resize', checkScrollableTab);
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
                            <div class="absolute top-1 -right-2 z-0">
                                <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                    <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
                                </div>
                            </div>
                        </div>
                    </f7-link>
                    <f7-link tab-link="#in-progress" tooltip="Step 1">
                        <div class="relative p-2">
                            <span>In Progress</span>
                            <!-- Number Indicator -->
                            <!-- <div class="absolute -top-4 -left-3 z-0">
                                    <div class="p-2 bg-red-400 rounded-full w-2 h-2">
                                        <span class="text-white absolute -top-[0.50px] left-[6px]">1</span>
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
                        <AllOrder />
                    </f7-tab>
                    <f7-tab id="in-progress" class="page-content">
                        <InProgressOrder />
                    </f7-tab>
                    <f7-tab id="requirements" class="page-content">
                        <RequirementsOrder />
                    </f7-tab>
                    <f7-tab id="to-deliver" class="page-content">
                        <DeliverOrder />
                    </f7-tab>
                    <f7-tab id="completed" class="page-content">
                        <CompletedOrder />
                    </f7-tab>
                    <f7-tab id="to-review" class="page-content">
                        <ReviewOrder />
                    </f7-tab>
                    <f7-tab id="cancelled" class="page-content">
                        <CancelledOrder />
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