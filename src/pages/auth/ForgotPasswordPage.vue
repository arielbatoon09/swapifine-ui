<script setup>
import { useAuthStore } from '../../js/auth.store';
import { ref } from 'vue';
import BtnBack from '../../assets/btn-back.svg';

const authStore = useAuthStore();
const isRequest = ref(false);

// Form Getters
const form = ref({
  email: '',
  password: '',
});

// Error message
const error = ref({
  invalidCredentials: '',
})

// Process Data
const handleLogin = async () => {
  try {
    // Init Loading Request
    isRequest.value = true;
    
    // Init Form Value
    const { email, password } = form.value;

    // Pass the data argument to login store function
    const response = await authStore.login(email, password);

    // Cancel loading state if the response is true
    if (response) {
      isRequest.value = false;
    }

    // Null Error
    error.value.invalidCredentials = null;

    // Switch Case for Error Message
    switch (response.source) {
      case 'emptyField':
        error.value.invalidCredentials = response.message;
        break;
      case 'invalidCredentials':
        error.value.invalidCredentials = response.message;
        break;
    }

  } catch (error) {
    console.error("Error:", error);
  }
};
</script>

<template>
  <f7-page name="signin" class="auth-container">
    <!-- <f7-nav-left back-link="Back"></f7-nav-left> -->
    <div>
      <div class="mx-auto max-w-screen-2xl lg:mt-24 lg:px-8">
        <f7-list class="lg:bg-white mx-auto max-w-lg lg:rounded-lg lg:border">
          <f7-block>
            <f7-link back class="mb-3">
              <img :src="BtnBack" alt="">
            </f7-link>
            <h3 class="auth-title text-clr-primary text-3xl font-semibold w-5/6">Forgot Password?
            </h3>
            <p class="mt-2 text-sm text-clr-primary">Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>
          </f7-block>
          <!-- Form -->
          <form class="auth-form">
            <!-- Email -->
            <f7-list-input v-model:value="form.email" outline label="Email" floating-label type="email"
              :error-message="error.invalidCredentials" error-message-force clear-button>
            </f7-list-input>

            <!-- Submit button -->
            <f7-block>
              <f7-button preloader :loading="isRequest" @click="handleLogin" class="auth-btn" large fill>
                Reset Password
            </f7-button>
            </f7-block>
          </form>

          <div class="flex items-center justify-center lg:bg-gray-100 lg:p-4 lg:mt-5">
            <p class="text-center text-sm text-gray-500">Go back to <a href="/login"
                class="text-clr-primary font-medium">Log in</a>
            </p>
          </div>
        </f7-list>
      </div>
    </div>
  </f7-page>
</template>

