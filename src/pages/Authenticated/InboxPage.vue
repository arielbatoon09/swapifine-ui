<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const isChatSidebarOpen = ref(true);

const isChatSidebarToggle = () => {
  isChatSidebarOpen.value = !isChatSidebarOpen.value;
}

// Redirection to other Page
const goToPage = (route) => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.navigate(route, {
    animate: animate,
  });
};

const goBack = () => {
  const animate = window.innerWidth <= 1023;
  f7.views.main.router.back({ animate: animate });
};


</script>

<template>
  <f7-page class="inbox-container">
    <!-- component -->
    <div class="flex h-screen w-full overflow-hidden">
      <!-- Sidebar -->
      <div v-show="isChatSidebarOpen" class="w-1/4 bg-white border-r border-gray-300">
        <!-- Sidebar Header -->
        <header class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
          <!-- Go To Home -->
          <div @click="goBack" class="cursor-pointer flex items-center gap-2">
            <svg class="w-[24px] h-[24px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M13 5H1m0 0 4 4M1 5l4-4" />
            </svg>
            <p>Back</p>
          </div>
          <!-- Header -->
          <h1 class="text-2xl font-semibold -ml-14">Inbox</h1>
          <!-- Toggle Sidebar -->
          <div class="relative" @click="isChatSidebarToggle">
            <button id="menuButton" class="focus:outline-none">
              <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 16 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M1 1h14M1 6h14M1 11h7" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Contact List -->
        <div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Ariel Batoon</h2>
              <p class="text-gray-600">Hoorayy!!</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/ad922e/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Martin</h2>
              <p class="text-gray-600">That pizza place was amazing! We should go again sometime. 🍕</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/2e83ad/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Charlie</h2>
              <p class="text-gray-600">Hey, do you have any recommendations for a good movie to watch?</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/c2ebff/0f0b14.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">David</h2>
              <p class="text-gray-600">I just finished reading a great book! It was so captivating.</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/e7c2ff/7315d1.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Ella</h2>
              <p class="text-gray-600">What's the plan for this weekend? Anything fun?</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/ffc2e2/ffdbdb.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Fiona</h2>
              <p class="text-gray-600">I heard there's a new exhibit at the art museum. Interested?</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/f83f3f/4f4f4f.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">George</h2>
              <p class="text-gray-600">I tried that new cafe downtown. The coffee was fantastic!</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/dddddd/999999.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Hannah</h2>
              <p class="text-gray-600">I'm planning a hiking trip next month. Want to join?</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/70ff33/501616.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Ian</h2>
              <p class="text-gray-600">Let's catch up soon. It's been too long!</p>
            </div>
          </div>

          <div class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
              <img src="https://placehold.co/200x/30916c/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                class="w-12 h-12 rounded-full">
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold">Jack</h2>
              <p class="text-gray-600">Remember that hilarious joke you told me? I can't stop laughing!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1">
        <!-- Chat Header -->
        <header class="bg-white p-4 text-gray-700 border-b border-gray-300 shadow flex flex-row items-center gap-4">
          <div v-show="!isChatSidebarOpen" @click="isChatSidebarToggle">
            <!-- Toggle Sidebar -->
            <div class="relative">
              <button id="menuButton" class="focus:outline-none">
                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 16 12">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M1 1h14M1 6h14M1 11h7" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Post Header Name -->
          <div class="w-fit">
            <div class="flex items-center gap-2">
              <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
              </svg>
              <h1 class="text-clr-primary text-xl font-semibold">Onhand New Arrival • <span>Ariel Batoon</span></h1>
            </div>

            <!-- <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              <p>Ariel Batoon</p>
            </div> -->
            <div class="flex gap-4 mt-2">
              <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium">Proceed
                now</button>
              <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium">View item</button>
            </div>
          </div>
          <!-- Action -->
          <div class="ml-auto">
            <svg class="cursor-pointer w-[32px] h-[32px] text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
              <path
                d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </div>
        </header>

        <!-- Chat Messages -->
        <div class="h-screen flex flex-col-reverse overflow-y-auto p-4 pb-[12rem]">
          <!-- Outgoing Message -->
          <div class="flex justify-end mb-4">
            <div class="flex max-w-96 bg-clr-primary text-white rounded-lg p-3 gap-3">
              <p>Hi Ariel! I'm good, just finished a great book. How about you?</p>
            </div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
              <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar"
                class="w-8 h-8 rounded-full">
            </div>
          </div>

          <!-- Incoming Message -->
          <div class="flex mb-4">
            <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
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
          :class="isChatSidebarOpen ? 'w-3/4' : 'w-full'">
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