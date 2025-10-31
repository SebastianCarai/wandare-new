<script lang="ts" setup>
import Navbar from '@/components/global/Navbar.vue';
import axios from 'axios';
import { onBeforeMount } from 'vue';


onBeforeMount(async () => {
    const profile = await axios.get('/api/profile/me')
    console.log(profile);
})

</script>

<template>
    <div class="p-absolute-centered">
        <a class="default-button" href="/api/logout">Logout</a>
    </div>

    <Navbar activeNavItem="profile" />
</template>

<style>
</style>