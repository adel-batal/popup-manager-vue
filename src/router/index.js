import { createRouter, createWebHistory } from 'vue-router';

import AppManager from '../pages/AppManager';
import AppTest from '../pages/AppTest';

const routes = [
  {
    path: '/',
    name: 'AppManager',
    component: AppManager,
  },
  {
    path: '/appTest',
    name: 'AppTest',
    component: AppTest,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
