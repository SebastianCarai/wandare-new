<script setup lang="ts">
import type { Image } from '@/types';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

withDefaults(defineProps<{
  images: Image[],
  isFullScreen?: boolean 
}>(), {
    isFullScreen : false
})
</script>

<template>
    <!-- Image Slider -->
    <Swiper
        :modules="[Pagination]"
        :pagination="true" 
        :loop="true"
        class="post-image-slider flex-grow-1"
        :class="{'full-screen' : isFullScreen}"
    >
        <SwiperSlide class="post-card-slide" v-for="(image, index) in images" :key="index">
            <img :src="image.url" .alt="image.altText">
        </SwiperSlide>
    </Swiper>
</template>

<style lang="scss" scoped>

.post-image-slider{
    box-shadow: 0px 4px 10px 0px rgba($color: #000000, $alpha: 0.5);
    width: 100% !important;
    aspect-ratio: 1 / 1;
    border-radius: 5%;
    overflow: hidden;

    &.full-screen{
        border-radius: 0%;
    }

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
</style>