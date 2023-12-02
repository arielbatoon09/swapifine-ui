<script setup>
import { f7 } from 'framework7-vue';
import InboxLayout from '../../Layout/InboxLayout.vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '../../js/auth.store';
import { usePostStore } from '../../js/post.store';
import { useInboxStore } from '../../js/inbox.store';
import { useTransactionStore } from '../../js/transaction.store';
import ContactIllustration from '../../assets/illustrations/select_chat.svg';
import ContactList from '../../components/Chat/Contact.vue';
import ComposeMessage from '../../components/Chat/Composemessage.vue';
import Conversation from '../../components/Chat/Conversation.vue';

const authStore = useAuthStore();
const postStore = usePostStore();
const inboxStore = useInboxStore();
const transactionStore = useTransactionStore();
const toastWithButton = ref(null);
const isChatSidebarOpen = ref(true);
const fileInput = ref(null);
const selectedImages = ref([]);
const inboxID = ref(null);
const messages = ref([]);
const getName = ref(null);
const isRequest = ref(false);
let resizeListener = null;

const FormData = ref({
  user_id: null,
  message: null,
  proof_img_path: null,
});


const initRender = async () => {
  updateSidebarByBreakpoint();
  resizeListener = window.addEventListener('resize', updateSidebarByBreakpoint);
};

const setName = (recipient, userID) => {
  getName.value = recipient;
  FormData.value.user_id = userID;
};

const handleReportUser = async () => {
  // Init Loading Request
  isRequest.value = true;

  const { user_id, message } = FormData.value;

  // Create an array to store file data
  const files = [];

  if (!FormData.value.proof_img_path) {
    return;
  }

  // Convert File objects to base64 encoded strings
  for (const file of FormData.value.proof_img_path) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    await new Promise((resolve) => {
      reader.onload = (e) => {
        files.push({ name: file.name, data: e.target.result });
        resolve();
      };
    });
  }

  const response = await authStore.reportUser(user_id, message, files);

  if (response) {
    isRequest.value = false;
  }

  // Success State
  if (response.status == 'success') {

    // Show the toast
    if (!toastWithButton.value) {
      toastWithButton.value = f7.toast.create({
        text: 'Reported user successfully!',
        position: 'top',
        closeButton: true,
        closeButtonText: 'Okay',
        closeButtonColor: 'green',
        closeTimeout: 3000,
      });
    }

    // Open the toast
    toastWithButton.value.open();
    f7.popup.close('.popup-report');

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

  // Initialize form.proof_img_path as an empty array if it's not already an array
  if (!Array.isArray(FormData.value.proof_img_path)) {
    FormData.value.proof_img_path = [];
  }

  // Append selectedFiles to the existing form.proof_img_path array
  FormData.value.proof_img_path = [...selectedFiles];

  // Display selected images
  selectedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImages.value.push({ file, url: e.target.result });
    };
    reader.readAsDataURL(file);
  });
};

// Redirection to View item Details Page
const goToPostDetails = async () => {
  // Retrieving specific data from Messages Controller
  const getPostData = Object.keys(messages.value)
    .map(key => ({
      post_item_id: messages.value[key].post_item_id,
      post_item_key: messages.value[key].post_item_key,
    }));

  const PostItemKey = getPostData[0].post_item_key;
  const PostItemId = getPostData[0].post_item_id;

  const route = `/view/item/${PostItemId}`;
  const animate = window.innerWidth <= 1023;

  await postStore.GetPostDetails(PostItemKey);

  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};

// Open Transactions
const OpenTransactions = async (GetChatMessages) => {
  const animate = window.innerWidth <= 1023;

  const response = await transactionStore.OpenTransactions(GetChatMessages.to_user_id, GetChatMessages.msg_inbox_key);
  if (response.status == 'success') {
    toastWithButton.value = f7.toast.create({
      text: response.message,
      position: 'top',
      closeButton: true,
      closeButtonText: 'Okay',
      closeButtonColor: 'green',
      closeTimeout: 3000,
    });

    // If success
    f7.views.main.router.navigate('/order', {
      animate: animate,
    });

  } else {
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
};

const updateSidebarByBreakpoint = () => {
  return window.innerWidth <= 1023 ? isChatSidebarOpen.value = false : isChatSidebarOpen.value = true;
};

// To open certain chat
const inboxState = computed(() => {
  if (inboxStore.stateInitChat) {
    return inboxID.value = inboxStore.stateInitChat;
  }
  return false;
});

// Get the Chat Data by specific Inbox Id
const GetChatMessages = computed(() => {
  messages.value = inboxStore.stateMessageData;
  // console.log(messages.value);

  return messages.value;
});

const isChatSidebarToggle = () => {
  isChatSidebarOpen.value = !isChatSidebarOpen.value;
}

onMounted(async () => {
  // Mount and Render
  initRender();
});

onBeforeUnmount(() => {
  if (resizeListener) {
    window.removeEventListener('resize', updateSidebarByBreakpoint);
  }
});
</script>

<template>
  <f7-page class="inbox-container">
    <InboxLayout>
      <!-- Contact List Component -->
      <ContactList :showContact="isChatSidebarOpen" />

      <!-- Main Chat Area -->
      <div v-if="inboxState" class="flex-1">
        <!-- Toggler -->
        <div class="bg-white p-4 text-gray-700 border-b border-gray-300 shadow flex flex-row gap-2">
          <!-- Toggle Sidebar - Desktop -->
          <f7-button @click="isChatSidebarToggle" class="hidden lg:block">
            <div class="relative lg:mt-2 -ml-4 ">
              <button class="focus:outline-none ">
                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 16 12">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M1 1h14M1 6h14M1 11h7" />
                </svg>
              </button>
            </div>
          </f7-button>

          <!-- Toggle Sidebar - Mobile -->
          <f7-button panel-open="#panel-nested" class="block lg:hidden">
            <div class="relative mt-2 -ml-5">
              <button class="focus:outline-none">
                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 16 12">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M1 1h14M1 6h14M1 11h7" />
                </svg>
              </button>
            </div>
          </f7-button>
          <!-- Post Header Name -->
          <div class="w-fit">
            <div class="flex items-center gap-2">
              <!-- Bag Icon -->
              <svg class="w-[32px] h-[32px] text-clr-primary flex-shrink-0" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
              </svg>
              <h1 class="text-clr-primary text-base lg:text-xl font-semibold" v-if="GetChatMessages">
                <span>{{ authStore.user?.fullname == GetChatMessages[0].from_user_fullname ?
                  GetChatMessages[0].to_user_fullname : GetChatMessages[0].from_user_fullname }} • </span>
                {{ GetChatMessages[0].post_item_title }}
              </h1>
            </div>
          </div>
          <!-- Report User -->
          <div class="ml-auto">
            <f7-button @click="setName(GetChatMessages[0].to_user_fullname, GetChatMessages[0].id)" tooltip="Report User"
              popup-open=".popup-report">
              <svg class="w-[24px] h-[24px] text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 16 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M1 1v18M1 3.652v9c5.6-5.223 8.4 2.49 14-.08v-9c-5.6 2.57-8.4-5.143-14 .08Z" />
              </svg>
            </f7-button>
          </div>
        </div>

        <!-- Report Popup Form -->
        <f7-popup class="popup-report" swipe-to-close>
          <f7-page>
            <f7-navbar title="Report Form">
              <f7-nav-right>
                <f7-link popup-close>Close</f7-link>
              </f7-nav-right>
            </f7-navbar>

            <div>
              <f7-list>
                <f7-block class="my-0">
                  <p>User to Report:</p>
                </f7-block>
                <f7-list-input outline :label="getName" floating-label type="text" disabled>
                </f7-list-input>

                <f7-list-input v-model:value="FormData.message" outline label="Message" floating-label type="textarea"
                  placeholder="Enter anything..." clear-button>
                </f7-list-input>

                <f7-block class="my-0 mt-3">
                  <p>Proof of Report:</p>
                  <input @change="handleImageChange" type="file" id="images" ref="fileInput" />
                </f7-block>

                <f7-block>
                  <f7-button preloader :loading="isRequest" @click="handleReportUser" large fill
                    class="primary-button">Submit</f7-button>
                </f7-block>

              </f7-list>
            </div>
          </f7-page>
        </f7-popup>

        <!-- CTA Action Component -->
        <div class="flex gap-2 bg-gray-100 shadow">
          <div @click="OpenTransactions(GetChatMessages[0])"
            class="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-4 rounded font-medium w-full text-center">
            Open Transaction
          </div>

          <div @click="goToPostDetails"
            class="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-4 rounded font-medium w-full text-center">
            Item Details
          </div>
        </div>

        <!-- Conversation Component -->
        <Conversation />

        <!-- Send Message Component -->
        <ComposeMessage :showContact="isChatSidebarOpen" />
      </div>

      <!-- No Selected Contacts -->
      <div v-else class="flex-1 bg-gray-200">
        <!-- Toggler -->
        <div class="bg-white p-4 text-gray-700 border-b border-gray-300 shadow flex flex-row gap-2">
          <!-- Toggle Sidebar - Desktop -->
          <f7-button @click="isChatSidebarToggle" class="hidden lg:block">
            <div class="relative lg:mt-2 -ml-4 ">
              <button class="focus:outline-none ">
                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 16 12">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M1 1h14M1 6h14M1 11h7" />
                </svg>
              </button>
            </div>
          </f7-button>

          <!-- Toggle Sidebar - Mobile -->
          <f7-button panel-open="#panel-nested" class="block lg:hidden">
            <div class="relative mt-2 -ml-5">
              <button class="focus:outline-none">
                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 16 12">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M1 1h14M1 6h14M1 11h7" />
                </svg>
              </button>
            </div>
          </f7-button>
        </div>

        <div class="flex flex-col justify-center items-center h-screen gap-8">
          <h2 class="text-2xl font-bold text-center break-normal text-gray-500">Select a Contact to Message</h2>
          <img width="200" :src="ContactIllustration">
        </div>
      </div>
    </InboxLayout>
  </f7-page>
</template>

<style scoped lang="scss">
.inbox-container {
  background: #FFF;
  width: 100%;
  height: 100%;
}
</style>