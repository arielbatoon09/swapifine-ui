<script setup>
import { f7 } from 'framework7-vue';
import { ref } from 'vue';
import { useCreditsStore } from '../../js/credits.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';

const currentPage = 'buy-credits';
const creditsStore = useCreditsStore();
const isRequest = ref(false);
const customAmt = ref(5000);
const toastWithButton = ref(null);
const form = ref({
    purchase_name: null,
    description: null,
    amount: null,
    payment_method: null,
});

const setDetails = (purchase_name) => {

    switch (purchase_name) {
        case 'Standard':
            form.value.purchase_name = purchase_name;
            form.value.description = 'You will receive 200 PHP Credits.';
            form.value.amount = 200;
            break;
        case 'Medium':
            form.value.purchase_name = purchase_name;
            form.value.description = 'You will receive 500 PHP Credits.';
            form.value.amount = 500;
            break;
        case 'Best':
            form.value.purchase_name = purchase_name;
            form.value.description = 'You will receive 1,000 PHP Credits.';
            form.value.amount = 1000;
            break;
        case 'Custom':
            form.value.purchase_name = purchase_name;
            form.value.description = `You will receive ${customAmt.value} PHP Credits.`;
            form.value.amount = customAmt.value;
            break;
        default:
            console.log('Not found package.');
    }
};

const handleCheckout = async () => {
    const { purchase_name, description, amount, payment_method } = form.value;

    const animate = window.innerWidth <= 1023;

    isRequest.value = true;
    const response = await creditsStore.CheckoutCredits(purchase_name, description, amount, payment_method);

    // Reset toastWithButton to null before showing any toast
    toastWithButton.value = null;

    if (response.status === 'success') {
        form.value.purchase_name = null;
        form.value.description = null;
        form.value.amount = null;
        form.value.payment_method = null;

        // Show the success toast
        toastWithButton.value = f7.toast.create({
            text: response.message,
            position: 'top',
            closeButton: true,
            closeButtonText: 'Okay',
            closeButtonColor: 'green',
            closeTimeout: 3000,
        });

        f7.popup.close('.popup-mop');

        // Redirect the user to checkout page
        f7.views.main.router.navigate('/checkout', {
            animate: animate,
        });
    } else if (response.status === 'error') {
        // Show the error toast
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

    isRequest.value = false;
};

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
                            <h2 class="mb-2 text-2xl font-bold lg:text-3xl">Buy Credits</h2>
                            <div class="flex justify-center gap-2">
                                <svg class="w-[18px] h-[18px] text-gray-700 dark:text-white" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
                                </svg>
                                <span>Process a payment with the vendors securely.</span>
                            </div>
                        </div>
                        <div class="mb-6 grid gap-6 md:mb-8 md:grid-cols-3 lg:gap-x-8">
                            <!-- Plan A -->
                            <div class="flex flex-col gap-4 rounded-lg border p-4 pt-6 pb-6">
                                <h3 class="text-center text-2xl font-semibold text-gray-800">Standard</h3>

                                <div class="flex items-end justify-center gap-1">
                                    <span class="text-4xl font-bold text-gray-800">₱200.00</span>
                                </div>

                                <div class="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <span>You will receive 200 PHP Credits.</span>
                                </div>

                                <!-- Standard Action -->
                                <f7-button @click="setDetails('Standard')" color="black" large outline
                                    popup-open=".popup-mop">
                                    <svg class="w-[20px] h-[20px] text-gray-700" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                    </svg>
                                    <span class="ml-2">Checkout</span>
                                </f7-button>
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

                                <!-- Medium Action -->
                                <f7-button @click="setDetails('Medium')" color="primary" class="primary-button" large fill
                                    popup-open=".popup-mop">
                                    <svg class="w-[20px] h-[20px] text-white" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                    </svg>
                                    <span class="ml-2">Checkout</span>
                                </f7-button>
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

                                <!-- Best Action -->
                                <f7-button @click="setDetails('Best')" color="black" large outline popup-open=".popup-mop">
                                    <svg class="w-[20px] h-[20px] text-gray-700" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                    </svg>
                                    <span class="ml-2">Checkout</span>
                                </f7-button>
                            </div>
                        </div>

                        <!-- Custom Plan -->
                        <div class="w-full md:w-1/2 mx-auto">
                            <div class="flex flex-col justify-center items-center gap-4 rounded-lg border p-4 pt-6 pb-6">
                                <h3 class="text-center text-2xl font-semibold text-gray-800">Custom </h3>

                                <div class="flex justify-center items-center text-center gap-1">
                                    <div class="text-4xl font-bold text-gray-800">
                                        <span>₱ </span>
                                        <input v-model="customAmt" class="w-[98px] border-b border-cyan-700">
                                        <span>.00</span>
                                    </div>
                                </div>

                                <div class="mb-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <span class="text-center">Enter a value between ₱50.00 - ₱5,000.00</span>
                                </div>

                                <!-- Custom Action -->
                                <div class="w-full">
                                    <f7-button @click="setDetails('Custom')" color="black" large outline
                                        popup-open=".popup-mop">
                                        <svg class="w-[20px] h-[20px] text-gray-700" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1" />
                                        </svg>
                                        <span class="ml-2">Checkout</span>
                                    </f7-button>
                                </div>
                            </div>
                        </div>

                        <!-- Modal Requirements Pop up -->
                        <f7-popup class="popup-mop" swipe-to-close>
                            <div>
                                <f7-navbar title="Mode of Payment">
                                    <f7-nav-right>
                                        <f7-link popup-close>Close</f7-link>
                                    </f7-nav-right>
                                </f7-navbar>

                                <!-- Form -->
                                <div class="px-2 flex-1">
                                    <f7-list>
                                        <!-- Payment Method -->
                                        <f7-list-input v-model:value="form.payment_method" outline label="Payment Method"
                                            floating-label type="select">
                                            <option value="gcash">GCASH</option>
                                            <option value="paymaya">Maya</option>
                                            <option value="grab_pay">Grab Pay</option>
                                            <option value="card">Card</option>
                                        </f7-list-input>

                                        <f7-block class="mt-2">
                                            <f7-button preloader :loading="isRequest" @click="handleCheckout"
                                                class="primary-button" large fill>Proceed</f7-button>
                                        </f7-block>
                                    </f7-list>
                                </div>
                            </div>
                        </f7-popup>
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

@media (min-width: 630px) and (min-height: 630px) {
    .popup-mop {
        height: 300px;
    }
}
</style>