import WelcomePage from '../pages/welcome.vue';
import RegisterPage from '../pages/auth/signup.vue';
import LoginPage from '../pages/auth/login.vue';
import NotFoundPage from '../pages/404.vue';

const routes = [
  {
    path: '/',
    component: WelcomePage,
  },
  {
    path: '/signup',
    component: RegisterPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;