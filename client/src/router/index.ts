import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PostDetailsPageView from "@/views/PostDetailsPageView.vue";
import Step1 from "@/views/create-post/Step1.vue";
import Step2 from "@/views/create-post/Step2.vue";
import Step3 from "@/views/create-post/Step3.vue";
import LoginView from '@/views/Login.vue';
import axios from "axios";
import { useStore } from "vuex";

// Define your routes with strong typing
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
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
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to) => {
  const store = useStore();

  if(!store.state.isAuthenticated){
    if(to.name === 'Login') return true;

    const response = await axios.get('/api/status');

    if(!response.data.isAuthenticated){
      return { name: 'Login' };
    }else{
      store.commit('setAuthStatus', true);
    }
  }else{
    return true
  }
})

export default router