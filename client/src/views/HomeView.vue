<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import PostCard from '@/components/global/PostCard.vue';
import type { Post } from '@/types';
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import Loader from '@/components/global/Loader.vue';
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/global/ErrorMessage.vue';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const posts = ref<Post[]>([]);

onBeforeMount(async() => {
    store.commit('setLoadingState', true);
    try {
        const res = await axios.get('/api/posts')
        posts.value = res.data;
        store.commit('setStatusAndError', {statusCode: 200, errorMessage: ''});
        store.commit('setLoadingState', false);

    } catch (error: any) {
        console.error(error);
        if(error.status === 401){
            
            router.push({ path: '/login?error=401' });
        }
        
        store.commit('setStatusAndError', {statusCode: error.status, errorMessage: error.response.data.message});
        store.commit('setLoadingState', false);
    }
})
</script>

<template>
    <div class="view-container">

        <ErrorMessage 
            :errorCode="store.state.statusCode" 
            :errorMessage="store.state.errorMessage" 
        />

        <Loader v-if="store.state.isLoading" />

        <div v-if="!store.state.isLoading" class="homepage-feed">
            <div class="feed_container">
                <PostCard v-for="(post, index) in posts" :key="index" :post="post" />
            </div>
        </div>

        <Navbar :activeNavItem="'home'" />
    </div>
</template>

<style lang="scss" scoped>
</style>