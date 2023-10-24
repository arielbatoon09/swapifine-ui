<script setup>
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
const currentPage = 'buy-credits';

</script>
<template>
    <f7-page class="buy-credits-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Buy Credits</h1>
            </template>
            <div class="-mt-6 lg:mt-0"></div>
            <section class="mb-12">
                <div class="bg-white py-6 sm:py-8 lg:py-12">
                    <div class="mx-auto max-w-screen-xl px-4 md:px-8">
                        <div class="mb-4 md:mb-8 xl:mb-12 text-center">
                            <h2 class="mb-2 text-2xl font-bold text-gray-800 lg:text-3xl">Buy Credits</h2>
                            <div class="flex justify-center gap-2">
                                <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
                                </svg>
                                <span>Process a payment with the vendors securely.</span>
                            </div>
                        </div>
                        <div class="mb-6 grid gap-6 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 lg:gap-x-8">
                            <!-- Plan A -->
                            <div class="flex flex-col gap-4 rounded-lg border p-4 pt-6 pb-6">
                                <h3 class="text-center text-2xl font-semibold text-gray-800">Standard</h3>

                                <div class="flex items-end justify-center gap-1">
                                    <span class="text-4xl font-bold text-gray-800">₱200.00</span>
                                </div>

                                <div class="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <span>You will receive 200 PHP Credits.</span>
                                </div>

                                <f7-button color="black" large outline>Purchase now</f7-button>
                            </div>

                            <!-- Plan B -->
                            <div class="relative flex flex-col gap-4 rounded-lg border border-clr-primary p-4 pt-6 pb-6">
                                <div class="absolute inset-x-0 -top-3 flex justify-center">
                                    <span class="flex h-6 items-center justify-center rounded-full bg-clr-primary px-3 py-1 text-xs 
                                        font-semibold uppercase tracking-widest text-white">Most Popular
                                    </span>
                                </div>

                                <h3 class="text-center text-2xl font-semibold text-gray-800">Medium</h3>

                                <div class="flex items-end justify-center gap-1">
                                    <span class="text-4xl font-bold text-gray-800">₱500.00</span>
                                </div>

                                <div class="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <span>You will receive 500 PHP Credits.</span>
                                </div>

                                <f7-button color="primary" class="primary-button" large fill>Purchase now</f7-button>
                            </div>

                            <!-- Plan C -->
                            <div class="flex flex-col gap-4 rounded-lg border p-4 pt-6 pb-6">
                                <h3 class="text-center text-2xl font-semibold text-gray-800">Best</h3>

                                <div class="flex items-end justify-center gap-1">
                                    <span class="text-4xl font-bold text-gray-800">₱1,000.00</span>
                                </div>

                                <div class="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <span>You will receive 1,000 PHP Credits.</span>
                                </div>

                                <f7-button color="black" large outline>Purchase now</f7-button>
                            </div>
                        </div>

                        <!-- Custom Plan -->
                        <div class="w-full lg:w-1/2 mx-auto">
                            <div class="flex flex-col justify-center items-center gap-4 rounded-lg border p-4 pt-6 pb-6">
                                <h3 class="text-center text-2xl font-semibold text-gray-800">Custom </h3>

                                <div class="flex justify-center items-center text-center gap-1">
                                    <div class="text-4xl font-bold text-gray-800">
                                        <span>₱ </span>
                                        <input class="w-[98px] border-b border-cyan-700" value="5000">
                                        <span>.00</span>
                                    </div>
                                </div>

                                <div class="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <span class="text-center">Enter a value between ₱50.00 - ₱5,000.00</span>
                                </div>

                                <div class="w-40">
                                    <f7-button color="black" large outline>Purchase now</f7-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SecondaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.buy-credits-container {
    background: #FFF;
    width: 100%;
    height: 100%;
}
</style>