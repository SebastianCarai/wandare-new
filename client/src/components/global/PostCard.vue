<script setup lang="ts">
import type { Post } from '@/types';
import Slider from './Slider.vue';

defineProps<{
  post: Post
}>();
</script>

<template>
    <div class="post-card m-t-40">
        <!-- Title and author -->
        <div>
            <router-link :to="'/posts/'+post.id">
                <h2 class="main-title">{{ post.title }}</h2>
            </router-link>
            <h5 class="gray-text m-t-4">{{ post.authorName }}</h5>
        </div>

        <!-- Image slider and CTAs -->
        <div class="m-t-4 post-card-slider-cta-wrapper d-flex justify-content-between gap-8">

            <Slider :images="post.images" />

            <!-- CTAs (Share, Comment, Save) -->
            <div class="card-cta d-flex flex-column justify-content-end gap-16">
                <div class="d-flex flex-column align-items-center">
                    <img class="cta-icon" src="@/assets/icons/share-icon-black.svg" alt="Share Icon">
                    <span class="small-text">Share</span>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <img class="cta-icon" src="@/assets/icons/comment-icon-black.svg" alt="Comment Icon">
                    <span class="small-text">Comment</span>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <img class="cta-icon" src="@/assets/icons/save-icon-black.svg" alt="Save Icon">
                    <span class="small-text">Save</span>
                </div>
            </div>
        </div>

        <!-- Number of stages and durations -->
        <div class="m-t-4">
            <span class="gray-text"><span class="post-duration">{{ post.numberOfStages }}
            </span> {{post.numberOfStages === 1 ? 'stage' : 'stages'}}</span> - 
            <span class="post-duration">{{ post.duration }}</span>
        </div>
    </div>
</template>

<style lang="scss">
.post-card-slider-cta-wrapper{
    width: 100%;
    max-width: 400px;
}

.swiper-pagination-bullet.swiper-pagination-bullet-active{
    background-color: $white !important;
}
</style>