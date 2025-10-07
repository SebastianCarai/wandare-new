<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import ImageCropper from '@/components/create-post/ImageCropper.vue';
</script>

<template>
    <div class="view-container">
        <div class="create-post-header">
            <div class="d-flex justify-content-between align-items-center p-y-16">
                <button type="button" @click="$router.go(-1)" class="go-back-button static" aria-label="Go back to the previous page">
                    <img src="@/assets/icons/go-back-icon-black.svg" aria-hidden="true">
                </button>

                <router-link class="accordion-title p-8" to="/create-post/step-2">Next</router-link>
            </div>

            <h2 class="main-title text-centered">Create Post</h2>
        </div>

        <div class="form-item-container m-t-16">
            <label for="">
                <div class="form-title">Post Title</div>
                <p class="common-text no-margins m-t-4">Where have you been?</p>
            </label>
            <input type="text" class="form-text-input m-t-8" placeholder="Type here">
        </div>

        <div class="form-item-container m-t-40">
            <label for="">
                <div class="form-title">Trip Duration</div>
                <p class="common-text no-margins m-t-4">How long was the vacation?</p>
            </label>
            <input type="text" class="form-text-input m-t-8" placeholder="Type here">
        </div>

        <div class="m-t-40">
            <div class="form-title">Carousel Images</div>
            <p class="common-text no-margins m-t-4">Choose the best photos (maximum 5) to display on the post carousel</p>
            <ImageCropper :isRound="false" :maxImages="5" class="m-t-16"  />
        </div>

        <Navbar activeNavItem="create-post" />
    </div>
</template>

<style lang="scss">
.create-post-header{
    background-color: $white;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
}
</style>