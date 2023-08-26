<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  currentPage: String
});

// Function to check if the page is active
const isPageActive = (pageName) => {
  return props.currentPage === pageName;
};
</script>

<template>
  <aside class="sidebar hidden lg:flex flex-col justify-center items-center gap-12 w-16 fixed h-full">
    <div>
      <f7-link href="/home" :animate="false" :ignore-cache="true">
        <f7-icon material="explore" size="28px"
          :class="{ 'sidebar-menu': true, 'sidebar-menu-active': isPageActive('home') }"></f7-icon>
      </f7-link>
    </div>
    <div>
      <f7-link href="/chat" :animate="false" :ignore-cache="true">
        <f7-icon material="question_answer" size="28px"
          :class="{ 'sidebar-menu': true, 'sidebar-menu-active': isPageActive('chat') }"></f7-icon>
      </f7-link>
    </div>
    <div>
      <f7-link href="/notification" :animate="false" :ignore-cache="true">
        <f7-icon material="notifications" size="28px"
          :class="{ 'sidebar-menu': true, 'sidebar-menu-active': isPageActive('notification') }"></f7-icon>
      </f7-link>
    </div>
    <div>
      <f7-link href="/store" :animate="false" :ignore-cache="true">
        <f7-icon material="store" size="28px"
          :class="{ 'sidebar-menu': true, 'sidebar-menu-active': isPageActive('store') }"></f7-icon>
      </f7-link>
    </div>
  </aside>
</template>