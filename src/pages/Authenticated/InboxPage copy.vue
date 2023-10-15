<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const isChatSidebarOpen = ref(true);
let resizeListener = null;

const initRender = async () => {
  updateSidebarByBreakpoint();
  resizeListener = window.addEventListener('resize', updateSidebarByBreakpoint);

};

const updateSidebarByBreakpoint = () => {
  return window.innerWidth <= 1023 ? isChatSidebarOpen.value = false : isChatSidebarOpen.value = true;
};

const isChatSidebarToggle = () => {
  isChatSidebarOpen.value = !isChatSidebarOpen.value;
}

const goBack = () => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.back({ animate: animate });
};

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
    <div class="flex h-screen w-full overflow-hidden">
      
      <!-- Sidebar -->
      <div v-show="isChatSidebarOpen" class="w-1/4 bg-white border-r border-gray-300">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
          <!-- Go To Home -->
          <svg @click="goBack" class="cursor-pointer w-[24px] h-[24px] text-white" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M13 5H1m0 0 4 4M1 5l4-4" />
          </svg>
          <!-- Header -->
          <h1 class="text-2xl font-semibold text-center -ml-14">Inbox</h1>
          <span></span>
        </div>

        <!-- Message List Desktop -->
        <div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1 truncate">
              <h2 class="text-lg font-semibold">Ariel Batoon</h2>
              <p class="text-gray-600 truncate">Hoorayy!!</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/30916c/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1 truncate">
              <h2 class="text-lg font-semibold">Jack</h2>
              <p class="text-gray-600 truncate">Remember that hilarious joke you told me? I can't stop
                laughing!ssssssssssssssssssssss</p>
            </div>
          </div>
        </div>

        <!-- Message List Mobile -->
        <f7-panel id="panel-nested" left cover container-el="#panel-page" class="w-full">
          <f7-link panel-close>Close me</f7-link>
        </f7-panel>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1">
        <!-- Chat Header -->
        <div class="bg-white p-4 text-gray-700 border-b border-gray-300 shadow flex flex-row gap-2">
          <!-- Toggle Sidebar - Desktop -->
          <f7-button @click="isChatSidebarToggle" class="hidden lg:block">
            <div class="relative mt-2 -ml-4">
              <button class="focus:outline-none">
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
              <svg class="mt-1 w-[24px] h-[24px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
              </svg>

              <h1 class="text-clr-primary text-base lg:text-xl font-semibold"><span>Ariel Batoon • </span>Onhand New
                Arrival</h1>
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

        <!-- Action -->
        <div class="flex gap-2 bg-gray-100">
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-4 rounded font-medium">Open Transaction</button>
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-4 rounded font-medium">Item Details</button>
        </div>

        <!-- Chat Messages -->
        <div class="h-screen flex flex-col-reverse overflow-y-auto p-4 pb-[13.5rem] sm:pb-[12rem] lg:pb-[12rem]">
          <!-- Outgoing Message -->
          <div class="flex justify-end mb-4">
            <div class="flex max-w-96 bg-clr-primary text-white rounded-lg p-3 gap-3">
              <p>Hi Ariel! I'm good, just finished a great book. How about you?</p>
            </div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar"
                class="w-8 h-8 rounded-full">
            </div>
          </div>

          <!-- Incoming Message -->
          <div class="flex mb-4">
            <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-8 h-8 rounded-full">
            </div>
            <div class="flex max-w-96 bg-gray-100 rounded-lg p-3 gap-3">
              <p class="text-gray-700">Hey Bob, how's it going?</p>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0"
          :class="isChatSidebarOpen ? 'w-full lg:w-3/4' : 'w-full'">
          <div class="flex items-center">
            <!-- Add Image Attachment -->
            <div class="mr-4">
              <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 20 18">
                <path fill="currentColor"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
              </svg>
            </div>
            <!-- Add Message -->
            <input placeholder="Type a message..." class="w-full p-2 rounded-full border border-gray-400 bg-gray-200" />
            <!-- Send Message Event -->
            <div class="ml-4 flex gap-2">
              <button class="bg-clr-primary text-white px-4 py-2 rounded-md">Send</button>
            </div>
          </div>
        </footer>
      </div>

    </div>
  </f7-page>
</template>

<style scoped lang="scss">
.inbox-container {
  background: #FFF;
  width: 100%;
  height: 100%;
}
</style>