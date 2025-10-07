<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
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
                <div class="form-title">Stages</div>
                <p class="common-text no-margins m-t-4">Time to add stages to your itinerary</p>
            </label>

            <div class="add-stage-button m-t-16" aria-label="Add stage">
                <div class="accordion-title">Add stage</div>
                <img src="@/assets/icons/plus-fill-icon-black.svg" alt="">
            </div>
        </div>

        <Navbar activeNavItem="create-post" />
    </div>
</template>

<style lang="scss" scoped>
.add-stage-button{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px dashed $black;
    border-radius: 0.5rem;
}
</style>