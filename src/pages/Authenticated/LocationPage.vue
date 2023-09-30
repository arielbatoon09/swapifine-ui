<script setup>
import { f7 } from 'framework7-vue';
import { ref, watch, onMounted } from 'vue';
import { useLocationStore } from '../../js/location.store';
import SecondaryLayout from "../../Layout/SecondaryLayout.vue";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

const locationStore = useLocationStore();
const isRequest = ref(false);
const toastWithButton = ref(null);
const searchQuery = ref('');
const suggestions = ref([]);
const zoom = ref(10);
const mapTileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const isLoadMapSearch = ref(false);
const suggestionSelected = ref(false);
let searchTimeout = null;

const form = ref({
    address: '',
    latitude: null,
    longitude: null,
});

// Define ref variables for mapCenter and markers with default values
const mapCenter = ref([14.59489140757233, 120.97826153039932]);
const markers = ref([
    {
        latLng: [14.59489140757233, 120.97826153039932],
        popupText: 'Philippines',
    },
]);

// Once the DOM is mounted
onMounted(async () => {
    const response = await locationStore.GetUserLocation();

    if (response.id) {
        searchQuery.value = response.address;
        form.value.address = response.address;
        form.value.latitude = response.latitude;
        form.value.longitude = response.longitude;

        // Update the map with the return data of the user
        markers.value = [
            {
                latLng: [response.latitude, response.longitude],
            },
        ];
        mapCenter.value = markers.value[0].latLng;
    } else {
        searchQuery.value = null;
    }
});

const handlePostLocation = async () => {
    // Init Loading Request
    isRequest.value = true;

    // Get Value of form data
    const { address, latitude, longitude } = form.value;

    // Distribute data to PostItem store
    const response = await locationStore.PostLocation(address, latitude, longitude,);

    // Cancel loading state if the response is true
    if (response) {
        isRequest.value = false;
    }

    // Success State
    if (response.status == 'success') {
        form.value.address = null;
        form.value.latitude = null;
        form.value.longitude = null;

        // Show the toast
        if (!toastWithButton.value) {
            toastWithButton.value = f7.toast.create({
                text: 'Successfully set the location!',
                position: 'top',
                closeButton: true,
                closeButtonText: 'Okay',
                closeButtonColor: 'green',
                closeTimeout: 3000,
            });
        }

        // Open the toast
        toastWithButton.value.open();

        // Redirect the user to Login page
        f7.views.main.router.navigate('/');
    }

    console.log(response);
};

const updateSuggestions = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (!searchQuery.value) {
            searchQuery.value = null;
        } else {
            fetchSuggestions(searchQuery.value);
        }
    }, 2000);
};

const clearSuggestions = () => {
    suggestions.value = [];
    suggestionSelected.value = false;
};

const selectSuggestion = (suggestion) => {
    searchQuery.value = suggestion.name;
    suggestions.value = [];
    suggestionSelected.value = false;

    // Update the map with the selected suggestion
    markers.value = [
        {
            latLng: [suggestion.latitude, suggestion.longitude],
            popupText: suggestion.name,
        },
    ];

    form.value.address = suggestion.name;
    form.value.latitude = suggestion.latitude;
    form.value.longitude = suggestion.longitude;

    // Set the map center to the position of the selected marker
    mapCenter.value = markers.value[0].latLng;
};

const fetchSuggestions = async (location) => {
    try {
        isLoadMapSearch.value = true;
        if (location) {
            const response = await locationStore.GetSearchLocation(location);

            if (response) {
                suggestions.value = response.map((feature) => ({
                    name: feature.place_name,
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                }));
            }
        }
        isLoadMapSearch.value = false;

    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
};

// Watch for changes in the searchQuery and update suggestions accordingly
watch(searchQuery, updateSuggestions);
</script>

<template>
    <f7-page class="post-container">
        <SecondaryLayout @click="clearSuggestions">
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
                                <f7-list-input v-model:value="searchQuery" @input="updateSuggestions"
                                    @keydown.escape="clearSuggestions" outline label="Location" floating-label type="text"
                                    clear-button>
                                </f7-list-input>
                            </f7-list>
                            <f7-block class="flex flex-col gap-4 cta-btn">
                                <f7-link>
                                    <f7-button preloader :loading="isRequest" @click="handlePostLocation" large fill
                                        class="primary-button">Save
                                        Changes
                                    </f7-button>
                                </f7-link>
                                <!-- Suggestions -->
                                <ul v-show="suggestions.length > 0"
                                    class="absolute -top-4 left-4 bg-white shadow-md rounded text-gray-700 border border-gray-200 w-3/4 overflow-y-auto"
                                    :class="!isLoadMapSearch ? 'h-[300px]' : 'h-[70px]'" style="z-index: 99999 !important">
                                    <!-- Display Suggestions -->
                                    <li v-if="!isLoadMapSearch" v-for="(suggestion, index) in suggestions" :key="index"
                                        @click="selectSuggestion(suggestion)" class="p-4 cursor-pointer hover:bg-gray-200">
                                        {{ suggestion.name }}
                                    </li>
                                    <li v-else class="p-4">
                                        <f7-preloader />
                                    </li>
                                </ul>
                                <!-- Loading Request Suggestions -->
                                <ul v-if="isLoadMapSearch && !suggestions.length > 0"
                                    class="absolute -top-4 left-4 bg-white shadow-md rounded text-gray-700 border border-gray-200 w-3/4 overflow-y-auto h-auto"
                                    style="z-index: 99999 !important">
                                    <li class="p-4">
                                        <f7-preloader />
                                    </li>
                                </ul>
                                <!-- Map -->
                                <div class="mt-2 h-[300px] w-full">
                                    <l-map :zoom="zoom" :center="mapCenter">
                                        <l-tile-layer :url="mapTileLayerUrl"></l-tile-layer>
                                        <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker.latLng">
                                            <l-popup>{{ marker.popupText }}</l-popup>
                                        </l-marker>
                                    </l-map>
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
