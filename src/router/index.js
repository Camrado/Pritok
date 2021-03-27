import { createRouter, createWebHistory } from 'vue-router';
import { useToast } from 'vue-toastification';
import store from '@/store/index.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      title: 'Pritok - Home page'
    }
  },
  {
    path: '/purchases',
    name: 'Purchases',
    component: () => import(/* webpackChunkName: "purchases" */ '@/views/Purchases.vue'),
    meta: {
      title: 'Pritok - Purchases page'
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import(/* webpackChunkName: "categories" */ '@/views/Categories.vue'),
    meta: {
      title: 'Pritok - Categories page'
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "signup" */ '@/views/SignUp.vue'),
    meta: {
      title: 'Pritok - Sign Up'
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "signin" */ '@/views/SignIn.vue'),
    meta: {
      title: 'Pritok - Sign In'
    }
  },
  {
    path: '/confirm-email',
    name: 'VerifyEmail',
    component: () => import(/* webpackChunkName: "verifyemail" */ '@/views/VerifyEmail.vue'),
    meta: {
      title: 'Pritok - Confirm Your Email'
    }
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: () => import(/* webpackChunkName: "contactUs" */ '@/views/ContactUs.vue'),
    meta: {
      title: 'Pritok - Contact Us'
    }
  },
  {
    path: '/account-settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
    meta: {
      title: 'Pritok - Account settings'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/NotFound.vue'),
    meta: {
      title: 'Pritok - 404 Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.resolve({
  name: 'NotFound',
  params: { pathMatch: ['404'] }
}).href; // '/404'

router.afterEach((to) => {
  document.title = to.meta.title;
});

router.beforeResolve((to, from, next) => {
  const toast = useToast();
  let isConfirmed = store.getters['User/GET_CONFIRMED'];
  let isSignedIn = store.getters['User/GET_SIGNED_IN'];

  if ((to.name === 'Purchases' || to.name === 'Categories') && !isSignedIn) {
    toast.info('You have to sign up before accessing this page');
    next({ name: 'SignUp' });
  } else if ((to.name === 'Purchases' || to.name === 'Categories') && isSignedIn && !isConfirmed) {
    toast.info('You have to confirm your account before accessing this page');
    next({ name: 'VerifyEmail' });
  } else if ((to.name === 'SignIn' || to.name === 'SignUp') && isSignedIn) {
    toast.info("You're already signed in");
    next({ name: 'Home' });
  } else if (to.name === 'VerifyEmail' && !isSignedIn) {
    toast.info('First you must sign up');
    next({ name: 'SignUp' });
  } else if (to.name === 'VerifyEmail' && isConfirmed) {
    toast.info("You've already confirmed your e-mail");
    next({ name: 'Home' });
  } else if (to.name === 'Settings' && !isSignedIn) {
    toast.info('You have to sign up before accessing this page');
    next({ name: 'SignUp' });
  } else {
    next();
  }
});

export default router;
