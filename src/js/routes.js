// Onboarding Pages
import WelcomePage from '../pages/welcome.vue';
import RegisterPage from '../pages/auth/signup.vue';
import LoginPage from '../pages/auth/login.vue';
import NotFoundPage from '../pages/404.vue';
// User Pages
import HomePage from '../pages/dashboard/home.vue';

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
    path: '/home',
    component: HomePage,

  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;