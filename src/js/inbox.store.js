import { defineStore } from 'pinia';
import axios from 'axios';

export const useInboxStore = defineStore('inbox', {
    state: () => ({
        stateInitChat: null,
        stateMessageData: null,

        // Firebase Data State
        stateMsgInboxKey: null,

    }),
    // getters: {
    //     getInitChat: (state) => state.stateMessageData,
    // },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async SetMsgInboxKey(msg_inbox_key) {
            return this.stateMsgInboxKey = msg_inbox_key;
        },
        async ComposeMessage(newMessage) {
            try {
                await this.getToken();

                const response = await axios.post('/api/inbox/send-message', {
                    msg_inbox_key: newMessage.msg_inbox_key,
                    from_id: newMessage.from_id,
                    to_id: newMessage.to_id,
                    message: newMessage.message,
                });

                return response.data;
            } catch (error) {
                console.error(error);
            }
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

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async UpdateIsReadStatus(id, auth_id) {
            try {
                await this.getToken();

                const response = await axios.post('/api/inbox/update/is-read', {
                    id: id,
                    auth_id: auth_id,
                });

                return response.data;

            } catch (error) {
                console.error(error);
            }
        },
        async GetChatDetails(id) {
            try {
                const response = await axios.post('/api/inbox/messages', {
                    inbox_id: id,
                });

                this.stateInitChat = id;

                // Get Data
                return this.stateMessageData = response.data.data;

            } catch (error) {
                console.error(error);
            }
        },
    },
});