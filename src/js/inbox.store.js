import { defineStore } from 'pinia';
import axios from 'axios';

export const useInboxStore = defineStore('inbox', {
    state: () => ({
        // 
    }),
    getters: {
        // 
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async TapToInquire(id, post_user_id) {
            try {
                await this.getToken();

                const response = await axios.post('/api/inbox/inquire', {
                    id: id,
                    post_user_id: post_user_id,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async GetAllContacts() {
            try {
                const response = await axios.get('/api/inbox/list');
                return response.data.data;

            } catch (error) {
                console.error(error);
            }
        },
        async UpdateIsReadStatus(id) {
            try {
                await this.getToken();

                const response = await axios.post('/api/inbox/update/is-read', {
                    id: id,
                });
                
                return response.data;

            } catch (error) {
                console.error(error);
            }
        }
    },
});