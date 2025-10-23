<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import PostCard from '@/components/global/PostCard.vue';
import type { Post } from '@/types';
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import Loader from '@/components/global/Loader.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const posts = ref<Post[]>([]);
const isLoading = ref<boolean>(true);

onBeforeMount(async() => {

    try {
        const res = await axios.get('/api/posts')
        posts.value = res.data;

        isLoading.value = false;

    } catch (error: any) {
        console.error(error);
        if(error.status === 401){
            
            router.push({ path: '/login?error=401' });
        }
    }
})
</script>

<template>
    <div class="view-container">

        <Loader v-if="isLoading" />

        <div v-if="!isLoading" class="homepage-feed">
            <div class="feed_container">
                <PostCard v-for="(post, index) in posts" :key="index" :post="post" />
            </div>
        </div>

        <Navbar :activeNavItem="'home'" />
    </div>
</template>

<style lang="scss" scoped>
</style>