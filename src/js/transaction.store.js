import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', {
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
        async GetUserTransactions() {
            try {
                const response = await axios.get('/api/transaction/list');

                return response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async OpenTransactions(vendor_id, msg_inbox_key) {
            try {

                const response = await axios.post('/api/transaction/create', {
                    vendor_id: vendor_id,
                    msg_inbox_key: msg_inbox_key,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async ProceedTransactions(transaction_id, status) {
            try {

                const response = await axios.post('/api/transaction/proceed', {
                    transaction_id: transaction_id,
                    status: status,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async AdditionalInformation(transaction_id, payment_method, delivery_address, user_notes) {
            try {

                const response = await axios.post('/api/transaction/additional', {
                    transaction_id: transaction_id,
                    payment_method: payment_method,
                    delivery_address: delivery_address,
                    user_notes: user_notes,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async GetAdditionalInformation(transaction_id) {
            try {
                const response = await axios.post('/api/transaction/additional-info', {
                    transaction_id: transaction_id,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async RateVendor(transaction_id, rated_to_id, scale_ratings, comment) {
            try {
                const response = await axios.post('/api/transaction/rate', {
                    transaction_id: transaction_id,
                    rated_to_id: rated_to_id,
                    scale_ratings: scale_ratings,
                    comment: comment,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        }
    },
});