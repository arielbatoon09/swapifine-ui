import { defineStore } from 'pinia';
import { f7 } from 'framework7-vue';
import axios from 'axios';

export const usePostStore = defineStore('post', {
    state: () => ({
        postItem: null,
    }),
    getters: {
        user: (state) => state.postItem,
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async getCategoryList() {
            try {
                const response = await axios.get('/api/category/list');
                return response.data;
                
            } catch (error) {
                console.error(error);
            }
        },
        async postNewItem(category_id, location_id,  item_name, item_description, item_price, 
            item_quantity, condition, item_for_type, delivery_type, payment_type, img_file_path) {
            try {
                await this.getToken();

                const response = await axios.post('/api/post/item', {
                    category_id: category_id,
                    location_id: location_id,
                    item_name: item_name,
                    item_description: item_description,
                    item_price: item_price,
                    item_quantity: item_quantity,
                    condition: condition,
                    item_for_type: item_for_type,
                    delivery_type: delivery_type,
                    payment_type: payment_type,
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