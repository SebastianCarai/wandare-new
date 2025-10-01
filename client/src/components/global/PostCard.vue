<script setup lang="ts">
import type { BasePost } from '@/types';
import Slider from './Slider.vue';

defineProps<{
  post: BasePost
}>();
</script>

<template>
    <div class="post-card m-t-40">
        <!-- Title and author -->
        <div>
            <a href="/posts/2">
                <h2 class="main-title">{{ post.postTitle }}</h2>
            </a>
            <h5 class="gray-text">{{ post.postAuthor }}</h5>
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

        <!-- Post Author -->
        <div class="m-t-4">
            <span class="gray-text">Duration: <span class="post-duration">{{ post.duration }}</span></span>
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