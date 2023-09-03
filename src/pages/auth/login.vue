<script setup>
import { useAuthStore } from '../../js/auth.store';
import { ref } from 'vue';
import { f7 } from 'framework7-vue';
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

    // Success State
    if (response.status == 'success') {
      form.value.email = null;
      form.value.password = null;

      // Redirect the user to Home page
      f7.views.main.router.navigate('/home');
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
            <h3 class="auth-title text-clr-primary text-3xl font-semibold w-5/6">Welcome back! Glad to see you, Again!
            </h3>
          </f7-block>
          <!-- Form -->
          <form class="auth-form">
              <!-- Email -->
            <f7-list-input v-model:value="form.email" outline label="Email" floating-label type="email"
              :error-message="error.invalidCredentials" error-message-force clear-button></f7-list-input>
              <!-- Password -->
            <f7-list-input v-model:value="form.password" outline label="Password" floating-label type="password"
              :error-message="error.invalidCredentials" error-message-force clear-button></f7-list-input>
              <!-- Remember Me -->
            <f7-list-item checkbox title="Remember me" name="remember" class="auth-remember"></f7-list-item>
              <!-- Submit button -->
            <f7-block>
              <f7-button preloader :loading="isRequest" @click="handleLogin" class="auth-btn" large fill>Log in</f7-button>
              <a href="#" class="auth-forgot flex justify-center mt-3">Forgot Password?</a>
            </f7-block>
          </form>

          <div class="flex items-center justify-center lg:bg-gray-100 lg:p-4 lg:mt-5">
            <p class="text-center text-sm text-gray-500">Don't have an account? <a href="/signup"
                class="text-clr-primary font-medium">Sign up</a>
            </p>
          </div>
        </f7-list>
      </div>
    </div>
  </f7-page>
</template>

