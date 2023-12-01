import { defineStore } from 'pinia';
import axios from 'axios';

export const useVerificationStore = defineStore('verification', {
    state: () => ({
        // code block

    }),
    getters: {
        // code block
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async PostVerificationRequest(legal_name, address, city, zip_code, dob, files) {
            this.getToken();

            const response = await axios.post('/api/verification-request', {
                legal_name: legal_name,
                address: address,
                city: city,
                zip_code: zip_code,
                dob: dob,
                img_file_path: files,
            });

            return response.data;
        },
    },
});