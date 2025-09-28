import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// Define your routes with strong typing
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router