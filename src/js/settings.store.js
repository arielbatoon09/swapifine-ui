import { defineStore } from 'pinia';
import axios from 'axios';

export const useSettingsStore = defineStore('settings', {
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
        async UserChangePassword(current_password, new_password, confirm_password) {
            try {
                const response = await axios.post('/api/user/changePassword', {
                    current_password: current_password,
                    new_password: new_password,
                    confirm_password: confirm_password,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async UpdateUserPersonalInformation(fullname) {
            try {
                const response = await axios.post('/api/user/updateBasic', {
                    fullname: fullname,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async GetVerificationStatus() {
            try {
                const response = await axios.get('/api/user/getVerificationStatus');

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
    },
});