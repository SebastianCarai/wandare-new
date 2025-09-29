<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import PostCard from '@/components/global/PostCard.vue';
import type { Post } from '@/types';

const posts: Post[] = [
    {
        id: 1,
        postTitle: 'Trip to Paris',
        postAuthor: 'Sebastian Carai',
        images: [
            {
                url: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                altText: 'Senna and Eiffel Tower'
            },
            {
                url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                altText: 'Bridge and Senna'
            }
        ],
        duration: '3 days'
    },
    {
        id: 2,
        postTitle: 'Title 2',
        postAuthor: 'Sebastian Carai',
        images: [
            {
                url: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                altText: 'Senna and Eiffel Tower'
            },
            {
                url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                altText: 'Bridge and Senna'
            }
        ],
        duration: '5 days'
    },
    {
        id: 3,
        postTitle: 'Title 3',
        postAuthor: 'Sebastian Carai',
        images: [
            {
                url: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                altText: 'Senna and Eiffel Tower'
            },
            {
                url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                altText: 'Bridge and Senna'
            }
        ],
        duration: '1 day'
    }
]
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