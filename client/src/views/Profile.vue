<script lang="ts" setup>
import Navbar from '@/components/global/Navbar.vue';
import axios from 'axios';
import { onBeforeMount } from 'vue';


onBeforeMount(async () => {
    const profile = await axios.get('/api/profile/me')
    console.log(profile);
})

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('profile');
    window.location.href = "/api/logout";
}

</script>

<template>
    <div class="p-absolute-centered">
        <a class="default-button" @click="logout">Logout</a>
    </div>

    <Navbar activeNavItem="profile" />
</template>

<style>
</style>