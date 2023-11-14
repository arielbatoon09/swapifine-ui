<script setup>
import { f7 } from 'framework7-vue';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';

const currentPage = 'settings';

// Redirection to other Page
const goToPage = (route) => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};
</script>
<template>
    <f7-page class="settings-container">
        <SecondaryLayout :currentPage="currentPage">
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Settings</h1>
            </template>
            <div class="-mt-6 lg:mt-0"></div>
            <section class="mb-12 flex flex-col">
                <!-- Verify Account CTA -->
                <div class="grid lg:grid-cols-1 mb-8">
                    <div class="border border-gray-200 rounded bg-white pt-6">
                        <div class="px-4">
                            <h2 class="font-semibold text-xl">Verify Account</h2>
                            <p class="text-sm text-gray-500">Vendors must complete a verification process to be able to post items.</p>
                        </div>
                        <f7-block class="mt-4">
                            <div class="w-32">
                                <f7-button @click="goToPage('/verification')" class="primary-button" large fill>Verify Now</f7-button>
                            </div>
                        </f7-block>
                    </div>
                </div>

                <!-- Personal Information Form -->
                <div class="grid lg:grid-cols-1 mb-8">
                    <div class="border border-gray-200 rounded bg-white pt-6">
                        <div class="px-4">
                            <h2 class="font-semibold text-xl">Profile Information</h2>
                            <p class="text-sm text-gray-500">Update your account's profile information and email address.
                            </p>
                        </div>
                        <f7-list class="mt-4 w-1/2">
                            <!-- Full Name -->
                            <f7-list-input outline label="Full Name" floating-label type="text" clear-button>
                            </f7-list-input>

                            <!-- Email -->
                            <f7-list-input outline label="Email" floating-label type="email" clear-button>
                            </f7-list-input>

                            <!-- Save -->
                            <f7-block class="mt-2">
                                <div class="w-32">
                                    <f7-button class="primary-button" large fill>Save</f7-button>
                                </div>
                            </f7-block>
                        </f7-list>
                    </div>
                </div>

                <!-- Update Password Form -->
                <div class="grid lg:grid-cols-1 mb-8">
                    <div class="border border-gray-200 rounded bg-white pt-6">
                        <div class="px-4">
                            <h2 class="font-semibold text-xl">Update Password</h2>
                            <p class="text-sm text-gray-500">Ensure your account is using a long, random password to stay
                                secure.</p>
                        </div>
                        <f7-list class="mt-4 w-1/2">
                            <!-- Current Password -->
                            <f7-list-input outline label="Current Password" floating-label type="password" clear-button>
                            </f7-list-input>

                            <!-- New Password -->
                            <f7-list-input outline label="New Password" floating-label type="password" clear-button>
                            </f7-list-input>

                            <!-- Confirm Password -->
                            <f7-list-input outline label="Confirm Password" floating-label type="password" clear-button>
                            </f7-list-input>
                            <!-- Save -->
                            <f7-block class="mt-2">
                                <div class="w-32">
                                    <f7-button class="primary-button" large fill>Save</f7-button>
                                </div>
                            </f7-block>
                        </f7-list>
                    </div>
                </div>

                <!-- Verify Account CTA -->
                <div class="grid lg:grid-cols-1 mb-8">
                    <div class="border border-gray-200 rounded bg-white pt-6">
                        <div class="px-4">
                            <h2 class="font-semibold text-xl">Delete Account</h2>
                            <p class="text-sm text-gray-500">Once your account is deleted, all of its resources and data will be permanently deleted.
                                <br>Be reminded that we're not able to restore your account or data once it's deleted.
                            </p>
                        </div>
                        <f7-block class="mt-4 w-1/2">
                            <div class="w-40">
                                <f7-button color="red" large fill>Delete Account</f7-button>
                            </div>
                        </f7-block>
                    </div>
                </div>                
            </section>
        </SecondaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.settings-container {
    background: #F7F8F9;
    width: 100%;
    height: 100%;
}
.wrapper-layout {
    background: #F7F8F9;
}
</style>