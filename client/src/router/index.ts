import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PostDetailsPage from "@/views/PostDetailsPage.vue";
import Step1 from "@/views/create-post/Step1.vue";
import Step2 from "@/views/create-post/Step2.vue";
import Step3 from "@/views/create-post/Step3.vue";
import Login from '@/views/Login.vue';
import CompleteRegistration from "@/views/CompleteRegistration.vue";
import axios from "axios";
import Profile from "@/views/Profile.vue";
import WorldMap from "@/views/search/WorldMap.vue";
import Continent from "@/views/Continent.vue";

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
    component: PostDetailsPage 
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
    component: Login
  },
  {
    path: '/complete-registration',
    name: 'Complete Registration',
    component: CompleteRegistration
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/world-map',
    name: 'World Map',
    component: WorldMap
  },
  {
    path: '/continents/:id',
    name: 'Continent Page',
    component: Continent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to) => {  
  if(!localStorage.getItem('isAuthenticated')){

    if(to.name === 'Login') return true;
    if(localStorage.getItem('isAuthenticated')) return true;
    
    try {
      const response = await axios.get('/api/status');
      localStorage.setItem('profile', JSON.stringify(response.data.profile));

      if(response.data.redirect){
        localStorage.setItem('isAuthenticated', 'true');
        return {name: 'Complete Registration'}
      } 
      localStorage.setItem('isAuthenticated', 'true');

    } catch (error) {
      return { name: 'Login' };
    }
  }else{
    return true
  }
})

export default router