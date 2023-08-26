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
  <section class="footer lg:hidden w-full fixed bottom-0 left-0">
    <div class="footer-menu-list">
      <div>
        <f7-link href="/home" :animate="false" :ignore-cache="true" 
          :class="{ '': true, 'active-link': isPageActive('home') }">
          <f7-icon material="explore" size="28px"
            :class="{ 'footer-menu': true, 'footer-menu-active': isPageActive('home') }"></f7-icon>
        </f7-link>
      </div>
      <div>
        <f7-link href="/chat" :animate="false" :ignore-cache="true"
          :class="{ '': true, 'active-link': isPageActive('chat') }">
          <f7-icon material="question_answer" size="28px"
            :class="{ 'footer-menu': true, 'footer-menu-active': isPageActive('chat') }"></f7-icon>
        </f7-link>
      </div>
      <div>
        <f7-link href="/chat" :animate="false" :ignore-cache="true"
          :class="{ '': true, 'active-link': isPageActive('post') }">
          <f7-icon material="add_circle" size="28px"
            :class="{ 'footer-menu': true, 'footer-menu-active': isPageActive('post') }"></f7-icon>
        </f7-link>
      </div>
      <div>
        <f7-link href="/notification" :animate="false" :ignore-cache="true"
          :class="{ '': true, 'active-link': isPageActive('notification') }">
          <f7-icon material="notifications" size="28px"
            :class="{ 'footer-menu': true, 'footer-menu-active': isPageActive('notification') }"></f7-icon>
        </f7-link>
      </div>
      <div>
        <f7-link href="/store" :animate="false" :ignore-cache="true"
          :class="{ '': true, 'active-link': isPageActive('store') }">
          <f7-icon material="store" size="28px"
            :class="{ 'footer-menu': true, 'footer-menu-active': isPageActive('store') }"></f7-icon>
        </f7-link>
      </div>
    </div>
  </section>
</template>