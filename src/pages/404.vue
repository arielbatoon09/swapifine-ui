<script setup>
import PageNotFound from '../assets/page-not-found.svg';

</script>
<template>
  <f7-page name="404">
    <div class="bg-white py-6 sm:py-8 lg:py-12 h-screen flex flex-col justify-center items-center">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div class="flex flex-col items-center">
          <img :src="PageNotFound" alt="Swapifine not found" width="400">
          <h3 class="mt-10 mb-2 text-center text-2xl font-bold text-gray-800 md:text-3xl">Page not found</h3>

          <p class="mb-5 max-w-screen-md text-center text-gray-500 md:text-lg">The page you're looking for
            doesn't exist.
          </p>
          <f7-link href="/home" :animate="false" :ignore-cache="true"
            class="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">Go
            home
          </f7-link>
        </div>
      </div>
    </div>

  </f7-page>
</template>