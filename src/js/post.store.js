import { defineStore } from 'pinia';
import { f7 } from 'framework7-vue';
import axios from 'axios';

export const usePostStore = defineStore('post', {
    state: () => ({
        postItem: null,
        getPost: null,
    }),
    getters: {
        getItemDetails: (state) => state.getPost,
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async GetCategoryList() {
            try {
                const response = await axios.get('/api/category/list');
                return response.data.data;
                
            } catch (error) {
                console.error(error);
            }
        },
        async GetAllPostItem() {
            try {
                const response = await axios.get('/api/browse');
                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async GetTop3PostCategory() {
            try {
                const response = await axios.get('/api/browse/top-post');
                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async GetRecentViewedPost(id) {
            try {
                const response = await axios.post('/api/browse/recent-post', {
                    id: id,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async GetPostDetails(id) {
            try {
                const response = await axios.post(`/api/view/item`, {
                    id: id,
                });

                return this.getPost = response.data.data;

            } catch (error) {
                console.error(error);
            }
        },
        async PostItem(category_id, location_id, item_name, item_description, 
            item_stocks, condition, item_for_type, item_cash_value, img_file_path) {
            try {
                await this.getToken();

                const response = await axios.post('/api/post/item', {
                    category_id: category_id,
                    location_id: location_id,
                    item_name: item_name,
                    item_description: item_description,
                    item_stocks: item_stocks,
                    condition: condition,
                    item_for_type: item_for_type,
                    item_cash_value: item_cash_value,
                    img_file_path: img_file_path,
                });

                const postData = response.data;

                if (postData){
                    this.postItem = postData;

                    return this.postItem;
                } else {
                    console.log('Error posting item!');
                }

            } catch (error) {
                console.error(error);
            }
        }
    }
})