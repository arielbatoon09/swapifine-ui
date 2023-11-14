<script setup>
import { onMounted, ref } from 'vue';
import { f7 } from 'framework7-vue';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import OnboardingIMG from '../../assets/illustrations/onboarding_verification_illus.svg';
import DocumentIdIMG from '../../assets/illustrations/document_id_illustration.svg';

// Redirection to other Page
const goToPage = (route) => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};
</script>

<template>
  <f7-page class="post-container">
    <SecondaryLayout>
      <!-- Header -->
      <template v-slot:header-title>
        <h1 class="font-semibold text-lg">Vendor Verification</h1>
      </template>
      <!-- Post Container -->
      <div class="mx-auto lg:w-1/2">
        <div class="bg-white lg:px-4 lg:rounded-lg lg:shadow-md lg:border lg:border-gray-200 mb-12">
          <!-- Item Form -->
          <div class="post-item-form">
            <f7-tabs animated class="h-600">
              <!-- Step #1 -->
              <f7-tab id="step-1" class="page-content" tab-active>
                <f7-block class="flex flex-col justify-between items-stretch gap-6">
                  <!-- Image -->
                  <div class="mt-4 flex flex-col justify-center items-center">
                    <img class="w-24" :src="OnboardingIMG">
                  </div>
                  <div class="mt-6">
                    <!-- Description -->
                    <h2 class="text-clr-primary font-bold text-2xl">Verify Vendor</h2>
                    <p class="text-base text-gray-600 lg:w-9/12 mt-4">Vendors must complete a verification process on
                      the platform for
                      secure transactions.
                      This only takes a couple of minutes.
                    </p>
                  </div>
                  <!-- Next Step -->
                  <div class="mt-10">
                    <p class="text-gray-500 text-sm mb-4">By selecting <span class="text-clr-primary">'Continue'</span>
                      you agree to provide your data.</p>
                    <f7-link tab-link="#step-2" class="flex gap-2 flex-col">
                      <f7-button large fill class="primary-button">Continue</f7-button>
                      <f7-button @click="goToPage('/home')" large fill class="secondary-button">Cancel</f7-button>
                    </f7-link>
                  </div>
                </f7-block>
                <!-- Upload Image and Preview End -->
              </f7-tab>

              <!-- Step #2 -->
              <f7-tab id="step-2" class="page-content">
                <f7-block class="step-title">
                  <h2 class="text-xl font-medium">Basic Information</h2>
                  <p class="text-gray-600">Ensure that the ID details match the data you input.</p>
                </f7-block>
                <f7-list>
                  <f7-list-input outline label="Legal name" floating-label type="text" clear-button>
                  </f7-list-input>
                  <f7-list-input outline label="Address" floating-label type="text" clear-button>
                  </f7-list-input>
                  <f7-list-input outline label="City" floating-label type="text" clear-button>
                  </f7-list-input>
                  <f7-list-input outline label="ZIP Code" floating-label type="text" clear-button>
                  </f7-list-input>
                  <f7-list-input outline placeholder="Date of Birth" type="datepicker" />
                </f7-list>
                <!-- Next Step -->
                <f7-block class="flex flex-col gap-2 step-cta">
                  <f7-link tab-link="#step-3">
                    <f7-button large fill class="primary-button">Next</f7-button>
                  </f7-link>
                  <f7-link tab-link="#step-1">
                    <f7-button large fill class="secondary-button">Back</f7-button>
                  </f7-link>
                </f7-block>
              </f7-tab>

              <!-- Step #3 -->
              <f7-tab id="step-3" class="page-content">
                <f7-block class="flex flex-col justify-between items-stretch gap-6">
                  <!-- Image -->
                  <div class="mt-4 flex flex-col justify-center items-center">
                    <img class="w-40" :src="DocumentIdIMG">
                  </div>
                  <div>
                    <!-- Description -->
                    <div>
                      <h2 class="text-clr-primary font-bold text-2xl">Upload ID</h2>
                      <p class="text-base text-gray-600 lg:w-9/12 mt-4">
                        Vendors must provide any valid ID to easily
                        check the provided images.
                        <br><br>
                        1. Check the accepted ID here.
                        <br>2. Take a picture of your ID in a flat surface.
                        <br>3. Avoid glare, shaking, and blur.
                      </p>
                    </div>
                    <!-- Upload ID -->
                    <div class="mt-4">
                      <input type="file" />
                    </div>
                  </div>
                </f7-block>
                <!-- Next Step -->
                <f7-block class="flex flex-col gap-2 pt-8 step-cta">
                  <!-- Publish Button -->
                  <f7-link>
                    <f7-button large fill class="primary-button">Publish</f7-button>
                  </f7-link>
                  <!-- Back Button -->
                  <f7-link tab-link="#step-2">
                    <f7-button large fill class="secondary-button">Back</f7-button>
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