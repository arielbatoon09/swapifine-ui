// Onboarding Pages
import WelcomePage from '../pages/welcome.vue';
import RegisterPage from '../pages/auth/signup.vue';
import LoginPage from '../pages/auth/login.vue';
import NotFoundPage from '../pages/404.vue';
// User Pages
import HomePage from '../pages/home/home.vue';
import ChatPage from '../pages/chat/message.vue';
import NotificationPage from '../pages/notification/notification.vue';
import StorePage from '../pages/store/store.vue';
import Searchpage from '../pages/search.vue';

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
    path: '/chat',
    component: ChatPage,
  },
  {
    path: '/store',
    component: StorePage,
  },
  {
    path: '/notification',
    component: NotificationPage,
  },
  {
    path: '/search',
    component: Searchpage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;