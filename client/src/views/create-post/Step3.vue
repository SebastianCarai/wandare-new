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

                <div class="accordion-title p-8">Create Post</div>
            </div>
        </div>
    

        <Navbar activeNavItem="create-post" />
    </div>
</template>

<style lang="scss" scoped>

</style>