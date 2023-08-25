<script setup>
import SwapifineLogo from '../../assets/swapifine-logo.png';
import SearchIcon from '../../assets/search-icon.svg';
import DefaultProfile from '../../assets/profile/default-profile.png';
import DiscoverIcon from '../../assets/icons/discover-icon.png';
import MessageIcon from '../../assets/icons/message-icon.png';
import NotificationIcon from '../../assets/icons/notification-icon.png';

</script>

<template>
  <f7-page name="home" class="home-container">
    <f7-navbar class="py-8">
      <f7-nav-left class="pl-4">
        <div class="flex flex-row items-center space-x-3">
          <img :src="SwapifineLogo" alt="Swapifine Logo" width="48">
          <f7-nav-title><h2 class="font-medium text-xl text-gray-700">Market Centre</h2></f7-nav-title>
        </div>
      </f7-nav-left>
      <f7-nav-right class="pr-4 gap-2">
        <div class="menu-icons hidden lg:inline-flex gap-2">
          <img class="cursor-pointer bg-gray-200 hover:bg-gray-300 duration-75 delay-75 p-2 rounded-full" :src="DiscoverIcon" alt="Discover now">
          <img class="cursor-pointer bg-gray-200 hover:bg-gray-300 duration-75 delay-75 p-2 rounded-full" :src="MessageIcon" alt="Message now">
          <img class="cursor-pointer bg-gray-200 hover:bg-gray-300 duration-75 delay-75 p-2 rounded-full" :src="NotificationIcon" alt="Check Notification">
        </div>
        <!-- <img :src="SearchIcon" alt="search now"> -->
        <img class="rounded-full profile-avatar" width="46" :src="DefaultProfile" alt="Profile img">
      </f7-nav-right>
    </f7-navbar>
    <!-- Body-Content  -->
    <f7-block>
      Test
    </f7-block>
    <!-- Footer-Menu-Mobile -->
    <f7-toolbar class="inline-block lg:hidden" position="bottom">
      <f7-link>Left Link</f7-link>
      <f7-link>Right Link</f7-link>
    </f7-toolbar>
  </f7-page>
</template>  