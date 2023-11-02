<script setup>
import { f7 } from 'framework7-vue';
import { ref } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import BtnBack from '../../assets/btn-back.svg';

const authStore = useAuthStore();
const isRequest = ref(false);
const toastWithButton = ref(null);

// Form Getters
const form = ref({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// Error message
const error = ref({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const handleSignUp = async () => {
  try {
    // Init Loading Request
    isRequest.value = true;

    // Init Form Value
    const { fullname, email, password, confirmPassword } = form.value;
    
    // Pass the data argument to register store function
    const response = await authStore.register(fullname, email, password, confirmPassword);

    // Cancel loading state if the response is true
    if (response) {
      isRequest.value = false;
    }

    // Success State
    if (response.status == 'success') {
      form.value.fullname = null;
      form.value.email = null;
      form.value.password = null;
      form.value.confirmPassword = null;

      // Show the toast
      if (!toastWithButton.value) {
        toastWithButton.value = f7.toast.create({
          text: 'Sent verification link to your email!',
          position: 'top',
          closeButton: true,
          closeButtonText: 'Okay',
          closeButtonColor: 'green',
          closeTimeout: 3000,
        });
      }
      
      // Open the toast
      toastWithButton.value.open();

      // Redirect the user to Login page
      f7.views.main.router.navigate('/verify-email');
    }

    // Null Error
    error.value.fullname = null;
    error.value.email = null;
    error.value.password = null;
    error.value.confirmPassword = null;
    
    // Switch Case for Error Message
    switch (response.source) {
      case 'emptyField':
        error.value.fullname = response.message;
        error.value.email = response.message;
        error.value.password = response.message;
        error.value.confirmPassword = response.message;
        break;
      case 'emailNotValid':
        error.value.email = response.message;
        break;
      case 'emailExist':
        error.value.email = response.message;
        break;
      case 'passwordShort':
        error.value.password = response.message;
        break;
      case 'passwordMatch':
        error.value.confirmPassword = response.message;
        break;
    }

  } catch (error) {
    console.error("Error", error);
  }
};

</script>

<template>
  <f7-page name="signup" class="auth-container">
    <!-- <f7-nav-left back-link="Back"></f7-nav-left> -->
    <div>
      <div class="mx-auto max-w-screen-2xl lg:mt-20 lg:px-8">
        <f7-list class="lg:bg-white mx-auto max-w-lg lg:rounded-lg lg:border">
          <f7-block>
            <f7-link back :ignore-cache="true" class="mb-3">
              <img :src="BtnBack" alt="">
            </f7-link>
            <h3 class="auth-title text-clr-primary text-3xl font-semibold w-5/6">Hello! Sign Up to get started!
            </h3>
          </f7-block>
          <!-- Form -->
          <form class="auth-form">
            <!-- Full Name -->
            <f7-list-input v-model:value="form.fullname" outline label="Full Name" floating-label type="text" clear-button
              :error-message="error.fullname" error-message-force></f7-list-input>
            <!-- Email -->
            <f7-list-input v-model:value="form.email" outline label="Email" floating-label type="email" clear-button
              :error-message="error.email" error-message-force></f7-list-input>
            <!-- Passowrd -->
            <f7-list-input v-model:value="form.password" outline label="Password" floating-label type="password"
              clear-button :error-message="error.password" error-message-force></f7-list-input>
            <!-- ConfirmPassword -->
            <f7-list-input v-model:value="form.confirmPassword" outline label="Confirm Password" floating-label
              type="password" clear-button :error-message="error.confirmPassword" error-message-force>
            </f7-list-input>
            <!-- Submit button -->
            <f7-block>
              <f7-button preloader :loading="isRequest" class="auth-btn" large fill @click="handleSignUp">Sign
                up</f7-button>
            </f7-block>
          </form>
          <div class="flex items-center justify-center lg:bg-gray-100 lg:p-4 lg:mt-5">
            <p class="text-center text-sm text-gray-500">Already have an account? <a href="/login"
                class="text-clr-primary font-medium">Log in</a>
            </p>
          </div>
        </f7-list>
      </div>
    </div>
  </f7-page>
</template>

