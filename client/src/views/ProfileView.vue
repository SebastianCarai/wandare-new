<script lang="ts" setup>
import Navbar from '@/components/global/Navbar.vue';
</script>

<template>
    <div class="p-absolute-centered">
        <a class="default-button" href="/api/logout">Logout</a>
    </div>

    <Navbar activeNavItem="profile" />
</template>

<style>
</style>