<script lang="ts" setup>
import Navbar from '@/components/global/Navbar.vue';
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
import type { Post } from '@/types';
import Loader from '@/components/global/Loader.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import type { NewPost } from '@/types/state';

const store = useStore();
const router = useRouter();

const userPosts = ref<Post[]>([]);


onBeforeMount(async () => {
    store.commit('setLoadingState', true);

    const profile = await axios.get('/api/profile/me')
    userPosts.value = profile.data.posts;

    store.commit('setLoadingState', false);
    
});

const editProfile = function(post : NewPost){

    store.commit('setPostToEdit', post);
    router.push({path : `/edit-post/${post.id}/step-1`});
}

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('profile');
    window.location.href = "/api/logout";
}

</script>

<template>
    <div class="view-container">
        <div v-for="(post) in userPosts">
            <button @click="editProfile(post as unknown as NewPost)" class="common-button m-t-16"> Edit Pos {{ post.id }}</button>
        </div>
    </div>

    <div class="p-absolute-centered">
        <a class="common-button" @click="logout">Logout</a>
    </div>

    <Loader v-if="store.state.isLoading" />

    <Navbar activeNavItem="profile" />
</template>

<style>
</style>