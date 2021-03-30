import { createRouter, createWebHistory } from 'vue-router';

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

export default router;
