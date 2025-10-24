<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import { useStore } from 'vuex';
import {ref} from 'vue';
import axios from 'axios';
import { createPostFormData } from '@/functions/functions';
import { useRouter } from 'vue-router';
import Loader from '@/components/global/Loader.vue';

const store = useStore();
const router = useRouter();
const description = ref<string>('');
const whatToBring = ref<string>('');
const pricing = ref<string>('');
const documents = ref<string>('');

const createPost = function(){
    store.commit('setLoadingState', true);

    store.commit('saveThirdStepData', {
        description: description.value, 
        whatToBring: whatToBring.value, 
        pricing: pricing.value, 
        documents: documents.value
    });

    // Create formdata to send to the server from the store state with newPost data
    const formData = createPostFormData(store.state.newPost);

    axios.post('/api/posts/create-post', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then((res) => {
        store.commit('setLoadingState', false);
        router.push( { path : `/posts/${res.data.id}` } )
    })
}
</script>

<template>
    <Loader v-if="store.state.isLoading" />

    <div class="view-container">
        <!-- Create Post Header -->
        <div class="create-post-header">
            <div class="d-flex justify-content-between align-items-center p-y-16">
                <router-link type="button" to="/create-post/step-2" class="go-back-button static" aria-label="Go back to the previous page">
                    <img src="@/assets/icons/go-back-icon-black.svg" aria-hidden="true">
                </router-link>

                <router-link class="accordion-title p-8" to="/create-post/step-3" @click="createPost">Create Post</router-link>
            </div>

            <h2 class="main-title text-centered">Create Post</h2>
        </div>

        <!-- Additional Info -->
        <div class="form-item-container m-t-16">
            <div class="form-title">Additional information</div>
            <p class="common-text no-margins m-t-4">This step is optional. But if you want, you can add some more information for this travel. </p>
        </div>


        <label for="post-description" class="m-t-16">
            <div class="accordion-title">Description</div>
            <p class="common-text no-margins m-t-4">Share more details about the trip.</p>
        </label>
        <textarea
            id="post-description" 
            v-model="description"
            placeholder="Type here..."
            class="textarea-input"
        ></textarea>

        <label for="what-to-bring" class="m-t-16">
            <div class="accordion-title">What To Bring</div>
            <p class="common-text no-margins m-t-4">Clothes, technical tools, medicines: what is necessary for this trip?</p>
        </label>
        <textarea
            id="what-to-bring" 
            v-model="whatToBring"
            placeholder="Type here..."
            class="textarea-input"
        ></textarea>

        <label for="what-to-bring" class="m-t-16">
            <div class="accordion-title">Pricing</div>
            <p class="common-text no-margins m-t-4">Share more details aboyt the prices of the trip.</p>
        </label>
        <textarea
            id="what-to-bring" 
            v-model="pricing"
            placeholder="Type here..."
            class="textarea-input"
        ></textarea>


        <label for="what-to-bring" class="m-t-16">
            <div class="accordion-title">Required Documents</div>
            <p class="common-text no-margins m-t-4">What documents are required to make this trip?</p>
        </label>
        <textarea
            id="what-to-bring" 
            v-model="documents"
            placeholder="Type here..."
            class="textarea-input"
        ></textarea>



        <Navbar activeNavItem="create-post" />
    </div>
</template>

<style lang="scss" scoped>
.textarea-input{
    display: block;
    width: 100%;
    resize: none;
    border-radius: 0.5rem;
    height: 120px;
    padding: 0.5rem;
}

</style>