<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import PostCard from '@/components/global/PostCard.vue';
import type { Post } from '@/types';
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';

const posts = ref<Post[]>([]);

onBeforeMount(async() => {

    try {
        axios.get('/api/posts')
        .then(res => {
            console.log(res);
            
            posts.value = res.data;
        })        
    } catch (error) {
        console.error(error);
    }
})
</script>

<template>
    <div class="view-container">

        <div class="homepage-feed">
            <div class="feed_container">
                <PostCard v-for="(post, index) in posts" :key="index" :post="post" />
            </div>
        </div>

        <Navbar :activeNavItem="'home'" />
    </div>
</template>

<style lang="scss" scoped>
</style>