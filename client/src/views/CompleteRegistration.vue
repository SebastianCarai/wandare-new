<script lang="ts" setup>
import ImageCropper from '@/components/create-post/ImageCropper.vue';
import { ref } from 'vue';
import axios from 'axios';

const imagePreview = ref<File[]>([]);
const profile = JSON.parse(localStorage.getItem('profile') || '');
const username = ref<string>(profile.preferred_username || '');
const bio = ref<string>('');
const usernameError = ref<boolean>(false);

const updateProfilePicturePreview = function(payload: Array<File>){    
    imagePreview.value.push(payload[0]!);
}

const removeProfilePicturePreview = function(){
    imagePreview.value = [];
}

const completeProfile = async () => {
    const formData = new FormData();

    if(username.value.length === 0){
        usernameError.value = true;
        return
    }

    formData.append('username', username.value);
    if(bio.value.length > 0) formData.append('bio', bio.value);
    if(imagePreview.value[0]) formData.append('profile_picture', imagePreview.value[0]);

    await axios.post('/api/profile/complete-profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
</script>

<template>
    <div class="view-container min-full-height p-y-24">
        <h2 class="main-title text-centered">Complete your profile</h2>

        <div class="form-item-container m-t-40">
            <label for="">
                <div class="form-title">Username*</div>
                <p class="common-text no-margins m-t-4">Only _ and . are allowed as special characters</p>
            </label>
            <input v-model="username" type="text" class="form-text-input m-t-8" placeholder="Type here">
            <div class="small-text error-text m-t-4"></div>
            <div v-if="usernameError" class="small-text error-text m-t-4">Username is required</div>
        </div>


        <label for="bio" class="m-t-24">
            <div class="form-title">Bio</div>
            <p class="common-text no-margins m-t-4">Tell us something about yourself!</p>
        </label>
        <textarea
            id="bio" 
            v-model="bio"
            placeholder="Type here..."
            class="textarea-input"
        ></textarea>

        <div class="form-title text-centered m-t-24 m-b-8">Profile picture</div>
        <ImageCropper @removePreview="removeProfilePicturePreview" @updateCroppedImages="updateProfilePicturePreview" :maxImages="1" :previews="imagePreview" />

        <div class="bottom-buttons d-flex justify-content-center align-items-center gap-16">
            <router-link to="/" class="ghost-button">Remind me later</router-link>
            <button @click="completeProfile" class="common-button">Complete account</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bottom-buttons{
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
}
</style>