import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import Dragons from '../pages/dragons.vue';
import News from '../pages/news.vue';
import Gaming from '../pages/gaming.vue';
import Community from '../pages/community.vue';
import Profile from '../pages/profile.vue';
import Login from '../pages/login.vue';
import Register from '../pages/register.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dragons',
    name: 'Dragons',
    component: Dragons
  },
  {
    path: '/news',
    name: 'News',
    component: News
  },
  {
    path: '/gaming',
    name: 'Gaming',
    component: Gaming
  },
  {
    path: '/community',
    name: 'Community',
    component: Community
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
