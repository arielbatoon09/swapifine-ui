<script setup>
import { onMounted, ref } from 'vue';
import { f7 } from 'framework7-vue';
import { useVerificationStore } from '../../js/verification.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import OnboardingIMG from '../../assets/illustrations/onboarding_verification_illus.svg';
import DocumentIdIMG from '../../assets/illustrations/document_id_illustration.svg';

const verificationStore = useVerificationStore();
const fileInput = ref(null);
const selectedImages = ref([]);
const isRequest = ref(false);
const toastWithButton = ref(null);

const FormData = ref({
  legal_name: null,
  address: null,
  city: null,
  zip_code: null,
  dob: null,
  img_file_path: null,
});

const handlePostVerification = async () => {
  // Init Loading Request
  isRequest.value = true;

  // Get Value of form data
  const { legal_name, address, city, zip_code, dob } = FormData.value;

  const originalDate = new Date(dob[0]);
  const formattedDOB = originalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Create an array to store file data
  const files = [];

  if (!FormData.value.img_file_path) {
    return;
  }

  // Convert File objects to base64 encoded strings
  for (const file of FormData.value.img_file_path) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    await new Promise((resolve) => {
      reader.onload = (e) => {
        files.push({ name: file.name, data: e.target.result });
        resolve();
      };
    });
  }

  const response = await verificationStore.PostVerificationRequest(legal_name, address, city, zip_code, formattedDOB, files);

  if (response) {
    isRequest.value = false;
  }

  // Success State
  if (response.status == 'success') {

    // Show the toast
    if (!toastWithButton.value) {
      toastWithButton.value = f7.toast.create({
        text: 'Sent verification successfully!',
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
  } else {
    // Show the toast
    if (!toastWithButton.value) {
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
    toastWithButton.value.open();
  }
};

const handleImageChange = (event) => {
  const files = Array.from(event.target.files);

  if (files.length == 0) {
    return;
  }

  // Filter files to only include JPG, JPEG, and PNG
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const selectedFiles = files.filter((file) => allowedTypes.includes(file.type));

  // Initialize form.img_file_path as an empty array if it's not already an array
  if (!Array.isArray(FormData.value.img_file_path)) {
    FormData.value.img_file_path = [];
  }

  // Append selectedFiles to the existing form.img_file_path array
  FormData.value.img_file_path = [...selectedFiles];

  // Display selected images
  selectedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImages.value.push({ file, url: e.target.result });
    };
    reader.readAsDataURL(file);
  });
};

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
                  <f7-list-input v-model:value="FormData.legal_name" outline label="Legal name" floating-label type="text"
                    clear-button>
                  </f7-list-input>
                  <f7-list-input v-model:value="FormData.address" outline label="Address" floating-label type="text"
                    clear-button>
                  </f7-list-input>
                  <f7-list-input v-model:value="FormData.city" outline label="City" floating-label type="text"
                    clear-button>
                  </f7-list-input>
                  <f7-list-input v-model:value="FormData.zip_code" outline label="ZIP Code" floating-label type="text"
                    clear-button>
                  </f7-list-input>
                  <f7-list-input v-model:value="FormData.dob" outline placeholder="Date of Birth" type="datepicker" />
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
                      <input type="file" id="images" ref="fileInput" @change="handleImageChange" />
                    </div>
                  </div>
                </f7-block>
                <!-- Next Step -->
                <f7-block class="flex flex-col gap-2 pt-8 step-cta">
                  <!-- Publish Button -->
                  <f7-link>
                    <f7-button preloader :loading="isRequest" @click="handlePostVerification" large fill class="primary-button">Publish</f7-button>
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