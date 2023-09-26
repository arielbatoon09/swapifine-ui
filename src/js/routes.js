import { useAuthStore } from '../js/auth.store';
import useCookies from 'vue-cookies'
import { f7 } from 'framework7-vue';
// Onboarding Pages
import WelcomePage from '../pages/WelcomePage.vue';
import RegisterPage from '../pages/auth/signup.vue';
import LoginPage from '../pages/auth/login.vue';
import VerifyEmailPage from '../pages/auth/verify-email.vue';
import NotFoundPage from '../pages/404.vue';
// User Pages
import HomePage from '../pages/Authenticated/HomePage.vue';
import ChatPage from '../pages/Authenticated/ChatPage.vue';
import NotificationPage from '../pages/Authenticated/NotificationPage.vue';
import StorePage from '../pages/Authenticated/StorePage.vue';
import PostItemPage from '../pages/Authenticated/PostItemPage.vue';
import BrowseItemPage from '../pages/Authenticated/BrowsePostPage.vue';
import ItemDetailsPage from '../pages/Authenticated/ItemDetailsPage.vue';
import SearchPage from '../pages/Authenticated/SearchPage.vue';
import ProfilePage from '../pages/Authenticated/ProfilePage.vue';

const isLoggedIn = useCookies.get('isLoggedIn');

const routes = [
  {
    path: '/',
    component: isLoggedIn ? HomePage : WelcomePage,
    protectedRoute: isLoggedIn,
  },
  {
    path: '/signup',
    component: isLoggedIn ? HomePage : RegisterPage,
    protectedRoute: isLoggedIn,
  },
  {
    path: '/login',
    component: isLoggedIn ? HomePage : LoginPage,
    protectedRoute: isLoggedIn,
  },
  {
    path: '/verify-email',
    component: VerifyEmailPage,
    protectedRoute: false,
  },
  {
    path: '/home',
    component: HomePage,
    protectedRoute: true,
  },
  {
    path: '/chat',
    component: ChatPage,
    protectedRoute: true,
  },
  {
    path: '/store',
    component: StorePage,
    protectedRoute: true,
  },
  {
    path: '/notification',
    component: NotificationPage,
    protectedRoute: true,
  },
  {
    path: '/search',
    component: SearchPage,
    protectedRoute: true,
  },
  {
    path: '/post/item',
    component: PostItemPage,
    protectedRoute: true,
  },
  {
    path: '/view/item/:id',
    component: ItemDetailsPage,
    protectedRoute: true,
  },
  {
    path: '/browse',
    component: BrowseItemPage,
    protectedRoute: true,
  },
  {
    path: '/profile',
    component: ProfilePage,
    protectedRoute: true,
  },
  {
    path: '/(.*)',
    component: NotFoundPage,
  },
];

// BeforeEnter function to handle protectedRoute
function beforeEnter(context) {
  const authStore = useAuthStore();
  const routeTo = context.to.route.protectedRoute;
  if (routeTo) { // Check if the route is protected
    if (!authStore.isAuthenticated) {
      f7.views.main.router.navigate('/');
      context.reject(); // Abort route loading
       // This navigation triggers the beforeEnter function again
    } else {
      context.resolve();
    }    
  } else {
    context.resolve(); // Proceed to the route
  }
}

// Apply the beforeEnter function to all routes
for (const route of routes) {
  route.beforeEnter = beforeEnter;
}

export default routes;