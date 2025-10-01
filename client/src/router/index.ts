import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PostDetailsPage from "@/views/PostDetailsPageView.vue";

// Define your routes with strong typing
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/posts/:id',
    name: 'pdp',
    component: PostDetailsPage
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router