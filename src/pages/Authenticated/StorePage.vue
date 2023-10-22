<script setup>
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import HeaderProfile from '../../components/Store/HeaderProfile.vue';
import PostContainer from '../../components/Store/PostContainer.vue';
import WishlistContainer from '../../components/Store/WishlistContainer.vue';
import RatingsContainer from '../../components/Store/RatingsContainer.vue';

const currentPage = 'store';
</script>

<template>
  <f7-page class="store-container">
    <SecondaryLayout :currentPage="currentPage">
      <!-- Header -->
      <template v-slot:header-title>
        <h1 class="font-semibold text-lg">My Store</h1>
      </template>
      <div class="-mt-6 lg:mt-0"></div>
      <section class="-mb-8 lg:max-w-screen-xl mx-auto">
        <!-- Header Profile -->
        <HeaderProfile />

        <!-- Feeds -->
        <div class="flex flex-col justify-center -mt-4 lg:mt-0">
          <!-- Tab Bar -->
          <f7-toolbar position="bottom" tabbar>
            <f7-link tab-link="#posts" tab-link-active>
              <div class="flex gap-2 items-center">
                <svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M6.143 1H1.857A.857.857 0 0 0 1 1.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 6.143V1.857A.857.857 0 0 0 6.143 1Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 17 6.143V1.857A.857.857 0 0 0 16.143 1Zm-10 10H1.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 16.143v-4.286A.857.857 0 0 0 6.143 11Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z" />
                </svg>
                <span class="text-base">POSTS</span>
              </div>
            </f7-link>
            <f7-link tab-link="#wishlist">
              <div class="flex gap-2 items-center">
                <svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 21 19">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M11 4C5.5-1.5-1.5 5.5 4 11l7 7 7-7c5.458-5.458-1.542-12.458-7-7Z" />
                </svg>
                <span class="text-base">WISHLIST</span>
              </div>
            </f7-link>
            <f7-link tab-link="#ratings">
              <div class="flex gap-2 items-center">
                <svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 21 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z" />
                </svg>
                <span class="text-base">RATINGS</span>
              </div>
            </f7-link>
          </f7-toolbar>

          <!-- Tabs Content -->
          <f7-tabs>
            <!-- Posts -->
            <f7-tab id="posts" class="page-content -mt-7" tab-active>
              <PostContainer />
            </f7-tab>

            <!-- Wishlist -->
            <f7-tab id="wishlist" class="page-content -mt-7">
              <WishlistContainer />
            </f7-tab>

            <!-- Ratings -->
            <f7-tab id="ratings" class="page-content">
              <RatingsContainer />
            </f7-tab>
          </f7-tabs>
        </div>
      </section>
    </SecondaryLayout>
  </f7-page>
</template>

<style scoped lang="scss">
.store-container {
  background: #FFF;
  width: 100%;
  height: 100%;

  .toolbar {
    background-color: #FFF;
    border-top: 1px solid #D9D9D9;
  }
}
</style>