<script setup>
import { ref, computed, watch } from 'vue';
import { f7 } from "framework7-vue";
import SecondaryLayout from "../../Layout/SecondaryLayout.vue";
import {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const kmList = ref([1, 2, 3, 4, 5]);
</script>

<template>
    <f7-page class="post-container">
        <SecondaryLayout>
            <!-- Header -->
            <template v-slot:header-title>
                <h1 class="font-semibold text-lg">Set Location</h1>
            </template>
            <!-- Post Container -->
            <div class="mx-auto lg:w-1/2">
                <div class="bg-white lg:px-4 lg:rounded-lg lg:shadow-md lg:border lg:border-gray-200 mb-12">
                    <div class="set-location-form">
                        <div class="h-600">
                            <f7-block>
                                <div class="bg-blue-100 p-4 mb-4 flex items-center gap-2 rounded-md">
                                    <svg class="w-6 h-6 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor" viewBox="0 0 15 20">
                                        <path
                                            d="M9.092 18h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2Zm-2-18a7.009 7.009 0 0 0-7 7 7.8 7.8 0 0 0 2.219 5.123c.956 1.195 1.781 2.228 1.781 3.877a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1c0-1.7.822-2.7 1.774-3.868A7.63 7.63 0 0 0 14.092 7a7.009 7.009 0 0 0-7-7Zm0 5a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4 1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span>Choose a location where you currently staying.</span>
                                </div>
                                <h2 class="text-lg font-semibold text-gray-700">
                                    Change location
                                </h2>
                            </f7-block>
                            <f7-list class="-mt-7 relative">
                                <f7-list-input outline label="Location"
                                    floating-label type="text" clear-button>
                                </f7-list-input>
                                <f7-list-input outline label="Radius" floating-label type="select">
                                    <option v-for="kilometer in kmList" value="New">{{ kilometer }} {{ kilometer == 1 ?
                                        'kilometer' : 'kilometers' }}</option>
                                </f7-list-input>
                            </f7-list>
                            <f7-block class="flex flex-col gap-4 cta-btn">
                                <f7-link>
                                    <f7-button large fill class="primary-button">Apply</f7-button>
                                </f7-link>
                                <!-- Suggestions -->
                                <!-- <ul v-if="showSuggestions"
                                    class="absolute -top-24 left-4 bg-white shadow-md rounded text-gray-700 border border-gray-200 w-3/4 overflow-y-auto" style="z-index: 99999 !important">
                                    <li v-for="(suggestion, index) in suggestions.slice(0, 10)" :key="index" @click="selectSuggestion(suggestion), showSuggestions = false" class="p-4 cursor-pointer hover:bg-gray-200">
                                        {{ suggestion }}</li>
                                </ul> -->
                                <!-- Map -->
                                <div style="height: 230px; width: 100%;">

                                </div>
                            </f7-block>
                        </div>
                    </div>
                </div>
            </div>
        </SecondaryLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.post-container {
    background: #fff;
    width: 100%;
    height: 100%;

    .set-location-form {
        @media only screen and (max-width: 1023px) {
            margin-top: -20px;
        }
    }

    .cta-btn {
        margin-top: -24px;
    }

    .page-content {
        scrollbar-width: thin;
        scrollbar-color: #ccc transparent;

        &::-webkit-scrollbar {
            width: 5px;
            background-color: #ccc;
            transition: width 0.3s ease;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #003d66;
        }
    }
}
</style>
