import { defineStore } from 'pinia';
import axios from 'axios';

export const useLocationStore = defineStore('location', {
    state: () => ({
        stateLocation: null,
    }),
    getters: {
        getLocation: (state) => state.stateLocation,
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async GetSearchLocation(location) {
            try {
                await this.getToken();
                const response = await axios.get(`/api/geocoding/${location}`);
                return response.data.features;

            } catch (error) {
                console.error(error);
            }
        },
        async GetUserLocation() {
            try {
                const response = await axios.get('/api/location/list');
                return response.data.data;

            } catch (error) {
                console.error(error);
            }
        },
        async PostLocation(address, latitude, longitude) {
            try {
                await this.getToken();

                const response = await axios.post('/api/post/location', {
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        }
    }
})