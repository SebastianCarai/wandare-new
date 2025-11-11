<script lang="ts" setup>
import ThreeMap from '@/components/global/ThreeMap.vue';
import Navbar from '@/components/global/Navbar.vue';
</script>

<template>
    <div>
        <ThreeMap />
    
        <Navbar active-nav-item="search" />
    </div>
</template>

<style>
#world-map{
    width: 100%;
    height: 100dvh;
    touch-action: none;
}
</style>