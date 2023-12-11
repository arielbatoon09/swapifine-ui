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
        },
        async GetWishlistByUserID() {
            this.getToken();

            const response = await axios.get('/api/mystore/user-wishlist');
            return response.data;
        },
        async GetWishlistImagesByID(id) {
            this.getToken();

            const response = await axios.post('/api/mystore/getWishlistImagesByID', {
                id: id,
            });

            return response.data;
        },
        async GetRatingsByUserID() {
            this.getToken();

            const response = await axios.get('/api/mystore/user-ratings');
            return response.data;
        },
        async UnlistItem(post_item_id) {
            try {
                await this.getToken();

                const response = await axios.post('/api/post/unlist', {
                    id: post_item_id,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
    },
});