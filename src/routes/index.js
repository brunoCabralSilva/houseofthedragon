import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import Dragons from '../pages/dragons.vue';
import News from '../pages/news.vue';
import Gaming from '../pages/gaming.vue';
import Community from '../pages/community.vue';
import Profile from '../pages/profile.vue';
import Login from '../pages/login.vue';
import Register from '../pages/register.vue';
import Matchs from '../pages/matchs.vue';
import EditProfile from '@/pages/editProfile.vue';
import CreateNews from '@/pages/createNews.vue';
import AddDragon from '@/pages/addDragon.vue';
import EditDragon from '@/pages/editDragon.vue';
import ChoosingIaOponent from '@/pages/choosingIaOponent.vue';
import Match from '@/pages/match.vue';

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
  },
  {
    path: '/matchs',
    name: 'Matchs',
    component: Matchs
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile
  },
  {
    path: '/create-news',
    name: 'CreateNews',
    component: CreateNews
  },
  {
    path: '/add-dragon',
    name: 'AddDragon',
    component: AddDragon
  },
  {
    path: '/editDragon/:dragonId',
    name: 'EditDragon',
    component: EditDragon,
    props: true
  },
  {
    path: '/choosing-ia-dragon/:battleId',
    name: 'ChoosingIaOponent',
    component: ChoosingIaOponent,
    props: true
  },
  {
    path: '/match/:battleId',
    name: 'playMatch',
    component: Match,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

export default router;
