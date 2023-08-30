import { defineStore } from 'pinia';
import useCookies from 'vue-cookies'
import axios from 'axios';
import { f7 } from 'framework7-vue';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authUser: null,
    }),
    getters: {
        user: (state) => state.authUser,
        isAuthenticated: (state) => {
            console.log('Checking isAuthenticated:', state.authUser !== null);
            return state.authUser !== null;
        },
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },
        async fetchUser() {
            try {
                const response = await axios.get('/api/user');
                const userData = response.data;
                if (userData.id) {
                    this.authUser = userData;
                } else {
                    this.authUser = null;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async register(fullname, email, password) {
            try {
                await this.getToken();
                const response = await axios.post('/api/register', {
                    fullname: fullname,
                    email: email,
                    password: password
                });
                if (response.data.status === 'success') {
                    console.log(response.data);
                    f7.views.main.router.navigate('/login');
                }else{
                    console.log('error');
                }
            } catch (error) {
                console.error(error);
            }
        },
        async login(email, password) {
            try {
                await this.getToken();
                const response = await axios.post('/api/login', {
                    email: email,
                    password: password
                });
                if (response.data.status === 'success') {
                    await this.fetchUser();
                    useCookies.set('isLoggedIn', true);
                    f7.views.main.router.navigate('/home');
                }
            } catch (error) {
                console.error(error);
            }
        },
        async logout() {
            try {
                await axios.get('/api/logout');
                useCookies.remove('isLoggedIn');
                this.authUser = null;
                location.reload();
                f7.views.main.router.navigate('/');
            } catch (error) {
                console.error(error);
            }
        },
    },
});