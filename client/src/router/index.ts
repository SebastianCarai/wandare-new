import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PostDetailsPageView from "@/views/PostDetailsPageView.vue";
import Step1 from "@/views/create-post/Step1.vue";
import Step2 from "@/views/create-post/Step2.vue";
import Step3 from "@/views/create-post/Step3.vue";

// Define your routes with strong typing
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/posts/:id',
    name: 'Post Details Page',
    component: PostDetailsPageView 
  },
  {
    path: '/create-post/step-1',
    name: 'Create Post | Step 1',
    component: Step1
  },
  {
    path: '/create-post/step-2',
    name: 'Create Post | Step 2',
    component: Step2
  },  
  {
    path: '/create-post/step-3',
    name: 'Create Post | Step 3',
    component: Step3
  }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router