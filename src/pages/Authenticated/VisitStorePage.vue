<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted } from 'vue';
import { useMystoreStore } from '../../js/mystore.store';
import SecondaryLayout from '../../Layout/SecondaryLayout.vue';
import PostContainer from '../../components/VendorStore/PostContainer.vue';
import RatingsContainer from '../../components/VendorStore/RatingsContainer.vue';

const currentPage = 'visit-store';
const mystoreStore = useMystoreStore();
const data = ref([]);
const getVendorID = localStorage.getItem('vendorID');
const isRequest = ref(false);

const renderData = async () => {
	const response = await mystoreStore.ViewVendorStore(getVendorID);
	data.value = response;

	console.log(data.value);
};

onMounted(() => {
	renderData();
});
</script>

<template>
	<f7-page class="store-container">
		<SecondaryLayout :currentPage="currentPage">
			<!-- Header -->
			<template v-slot:header-title>
				<h1 class="font-semibold text-lg">View Store</h1>
			</template>
			<div class="-mt-6 lg:mt-0"></div>
			<section class="lg:max-w-screen-xl mx-auto">
				<!-- Header Profile -->
				<div class="mb-12 flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-20">
					<!-- Profile Image -->
					<div class="relative w-32 h-32 lg:w-48 lg:h-48 overflow-hidden rounded-full bg-gray-100">
						<label v-for="user in data.userData" :key="user.id" for="file-input" class="w-full h-full">
							<img :src="user.profile_img"
								class="w-full h-full object-cover" />
						</label>
					</div>

					<!-- User Profile Data -->
					<div v-for="user in data.userData" :key="user.id"
						class="flex flex-col items-center lg:items-start gap-5">
						<!-- User Information -->
						<div>
							<h2 class="text-2xl font-semibold">{{ user.fullname }}</h2>
							<!-- Verified Indicator -->
							<div v-if="user.is_verified"
								class="flex flex-row justify-center lg:justify-start items-center gap-1">
								<span class="text-clr-primary font-medium">Verified Vendor</span>
								<svg class="w-[18px] h-[18px] text-clr-primary" aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
									<path fill="currentColor"
										d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z" />
									<path fill="#fff"
										d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z" />
								</svg>
							</div>
							<div v-else class="flex flex-row items-center justify-center lg:justify-start gap-1">
								<span class="text-clr-primary font-medium">Unverified Vendor</span>
							</div>
						</div>

						<!-- Data Statistic Number -->
						<div class="flex flex-row flex-nowrap gap-8">
							<!-- Total Post -->
							<div class="flex flex-col items-center text-base">
								<span class="font-semibold text-clr-primary">{{ user.total_post }}</span>
								<span class="font-light">Posts</span>
							</div>

							<!-- Overall Ratings -->
							<div class="flex flex-col items-center text-base">
								<span class="font-semibold text-clr-primary">{{ user.total_ratings }}</span>
								<span class="font-light">Ratings</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Feeds -->
				<div class="flex flex-col justify-center lg:mt-0">
					<!-- Tab Bar -->
					<f7-toolbar position="bottom" tabbar class="z-0">
						<f7-link tab-link="#posts" tab-link-active>
							<div class="flex gap-2 items-center">
								<svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
										stroke-width="1.5"
										d="M6.143 1H1.857A.857.857 0 0 0 1 1.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 6.143V1.857A.857.857 0 0 0 6.143 1Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 17 6.143V1.857A.857.857 0 0 0 16.143 1Zm-10 10H1.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 7 16.143v-4.286A.857.857 0 0 0 6.143 11Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z" />
								</svg>
								<span class="text-base">POSTS</span>
							</div>
						</f7-link>
						<f7-link tab-link="#ratings">
							<div class="flex gap-2 items-center">
								<svg class="w-[14px] h-[14px] text-clr-primary" aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
										stroke-width="1.5"
										d="m11.479 1.712 2.367 4.8a.532.532 0 0 0 .4.292l5.294.769a.534.534 0 0 1 .3.91l-3.83 3.735a.534.534 0 0 0-.154.473l.9 5.272a.535.535 0 0 1-.775.563l-4.734-2.49a.536.536 0 0 0-.5 0l-4.73 2.487a.534.534 0 0 1-.775-.563l.9-5.272a.534.534 0 0 0-.154-.473L2.158 8.48a.534.534 0 0 1 .3-.911l5.294-.77a.532.532 0 0 0 .4-.292l2.367-4.8a.534.534 0 0 1 .96.004Z" />
								</svg>
								<span class="text-base">RATINGS</span>
							</div>
						</f7-link>
					</f7-toolbar>

					<!-- Tabs Content -->
					<f7-tabs>
						<!-- Posts -->
						<f7-tab id="posts" class="page-content mt-2" tab-active>
							<PostContainer />
						</f7-tab>

						<!-- Ratings -->
						<f7-tab id="ratings" class="page-content mt-2">
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