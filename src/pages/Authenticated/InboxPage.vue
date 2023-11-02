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
const inboxID = ref(null);
const messages = ref([]);
let resizeListener = null;


const initRender = async () => {
  updateSidebarByBreakpoint();
  resizeListener = window.addEventListener('resize', updateSidebarByBreakpoint);
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
          <!-- More Options Dropdown -->
          <div class="ml-auto">
            <svg class="cursor-pointer w-[32px] h-[32px] text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
              <path
                d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </div>
        </div>

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