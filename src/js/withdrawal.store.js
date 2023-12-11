import { defineStore } from 'pinia';
import axios from 'axios';

export const useWithdrawalStore = defineStore('withdrawal', {
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
        async RequestWithdrawal(transfer_to, account_name, account_number, amount) {
            this.getToken();

            const response = await axios.post('/api/withdrawal/requestWithdrawal', {
                transfer_to: transfer_to,
                account_name: account_name,
                account_number: account_number,
                amount: amount,
            });

            return response.data;
        },
        async GetWithdrawalListByUserID() {
            this.getToken();

            const response = await axios.get('/api/withdrawal/getListByUserID');

            return response.data;
        },
        async GetWithdrawalByID(id) {
            const response = await axios.post('/api/withdrawal/getWithdrawalByID', {
                id: id,
            });
            
            return response.data;
        },
        async UpdateWithdrawalStatus(id, status) {
            const response = await axios.post('/api/withdrawal/updateWithdrawalStatus', {
                id: id,
                status: status,
            });

            return response.data;
        },
    },
});