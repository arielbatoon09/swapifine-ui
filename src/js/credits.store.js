import { defineStore } from 'pinia';
import axios from 'axios';

export const useCreditsStore = defineStore('credits', {
    state: () => ({
        // Code
    }),
    getters: {
        // Code
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async CheckoutCredits(purchase_name, description, amount, payment_method) {
            try {
                await this.getToken();

                const response = await axios.post('/api/checkout', {
                    purchase_name: purchase_name,
                    description: description,
                    amount: amount,
                    payment_method: payment_method,
                });
                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async GetAllCheckoutCredits() {
            try {
                await this.getToken();

                const response = await axios.get('/api/checkout/list');
                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async CompletePayment(checkout_session_id) {
            try {
                const response = await axios.post('/api/checkout/completed' , {
                    checkout_session_id: checkout_session_id,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async CancelCheckout(checkout_session_id) {
            try {
                await this.getToken();

                const response = await axios.post('/api/checkout/cancel', {
                    checkout_session_id: checkout_session_id,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async DeleteCheckout(checkout_session_id) {
            try {
                await this.getToken();

                const response = await axios.post('/api/checkout/delete', {
                    checkout_session_id: checkout_session_id,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        }
    },
});