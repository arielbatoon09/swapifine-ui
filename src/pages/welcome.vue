<script setup>
import { f7Page } from 'framework7-vue';
import WelcomeIllustration from '../assets/marketplace-illustration.svg';
import SwapifineLogo from '../assets/swapifine-logo.png';

</script>

<template>
  <f7-page name="welcome" class="welcome-container">
    <div class="welcome-image">
      <img class="welcome-illustration" :src="WelcomeIllustration" alt="...">
    </div>
    <div class="welcome-content">
      <div class="welcome-info">
        <div class="welcome-logo">
          <img :src="SwapifineLogo" alt="...">
          <h1>Swapi<span>fine</span></h1>
          <p>Discover, Trade, Thrive - Welcome to Swap Marketplace!</p>
        </div>
        <div class="welcome-buttons">
          <a href="/login"><button class="primary-button">Login</button></a>
          <a href="/signup"><button class="secondary-button">Sign up</button></a>
        </div>
        <div class="welcome-version">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  </f7-page>
</template>
