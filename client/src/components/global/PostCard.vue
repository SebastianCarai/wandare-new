<script setup lang="ts">
import type { Post } from '@/types/index.ts';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

defineProps<{
  post: Post
}>();
</script>

<template>
    <div class="post-card m-t-40">
        <!-- Title and author -->
        <div>
            <a href="#">
                <h2 class="post-title">{{ post.postTitle }}</h2>
            </a>
            <h5 class="post-author">{{ post.postAuthor }}</h5>
        </div>

        <!-- Image slider and CTAs -->
        <div class="m-t-4 post-card-slider-cta-wrapper d-flex justify-content-between gap-8">

            <!-- Image Slider -->
            <Swiper
                :modules="[Pagination]"
                :pagination="true" 
                :loop="true"
                class="post-image-slider flex-grow-1"
            >
                <SwiperSlide class="post-card-slide" v-for="(image, index) in post.images" :key="index">
                    <img :src="image.url" .alt="image.altText">
                </SwiperSlide>
            </Swiper>

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
            <span class="post-author">Duration: <span class="post-duration">{{ post.duration }}</span></span>
        </div>
    </div>
</template>

<style lang="scss">
.post-card-slider-cta-wrapper{
    width: 100%;
    max-width: 400px;

    .post-image-slider{
        box-shadow: 0px 4px 10px 0px rgba($color: #000000, $alpha: 0.5);
        width: 100% !important;
        aspect-ratio: 1 / 1;
        border-radius: 5%;
        overflow: hidden;
    
        .post-card-slide{
            width: 100%;
            height: 100%;

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .cta-icon{
        max-width: 40px;
    }
}

.swiper-pagination-bullet.swiper-pagination-bullet-active{
    background-color: $white !important;
}
</style>