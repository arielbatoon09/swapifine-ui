import { defineStore } from 'pinia';
import axios from 'axios';

export const useMystoreStore = defineStore('mystore', {
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
        async GetPostByUserID() {
            this.getToken();

            const response = await axios.get('/api/mystore/user-post');
            return response.data;
        },
        async GetPostImagesByID(id) {
            this.getToken();

            const response = await axios.post('/api/mystore/getPostImagesByID', {
                id: id,
            });
            return response.data;
        }
    },
});