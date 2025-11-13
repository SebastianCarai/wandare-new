<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import ImageCropper from '@/components/create-post/ImageCropper.vue';
import { ref, type Ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const title = ref<string>(store.state.newPost.title || '');
const durationNumber = ref<number | null>(parseInt(store.state.newPost.duration.split(' ')[0]) || null);
const durationTime = ref<string>(store.state.newPost.duration.split(' ')[1] || 'days');
const duration = ref<string>(store.state.newPost.duration || '');

const postTitleError = ref<{isError: boolean, message: string}>({isError: false, message: ''});
const postDurationError = ref<{isError: boolean, message: string}>({isError: false, message: ''});
const postImagesError = ref<{isError: boolean, message: string}>({isError: false, message: ''});

const checkInputLength = function(
    input: string | File[], 
    error: Ref<{isError: boolean, message: string}>, 
    message: string){
    if(typeof(input) === 'string'){
        if(input.trim().length === 0){
            error.value.isError = true;
            error.value.message = message;
        }else{
            error.value.isError = false;
        }
    }else{
        if(input.length === 0){
            error.value.isError = true;
            error.value.message = message;
        }else{
            error.value.isError = false;
        }
    }
}

const goToSecondStep = function(){
    if(
        (durationNumber.value && durationNumber.value > 0) &&
        (durationTime.value && durationTime.value.trim().length > 0)
    ){
        duration.value = `${durationNumber.value} ${durationTime.value}`;
    }
    
    checkInputLength(title.value, postTitleError, 'This field is required');
    checkInputLength(duration.value, postDurationError, 'This field is required');
    checkInputLength(store.state.newPost.images, postImagesError, 'Add at least one image');

    if(!postTitleError.value.isError && !postDurationError.value.isError && !postImagesError.value.isError){
        store.commit('saveFirstStepData', {
            title, duration
        });
        router.push({path: '/create-post/step-2'})
    }else{
        return null
    }
}

const getCroppedImages = function(payload: File[]){    
    store.commit('addNewPostImages', payload);
}

const removePreview = function(index: number){
    store.commit('removePreviewThumbnail', index);
}
</script>

<template>
    <div class="view-container">

        <!-- Create Post Header -->
        <div class="create-post-header">
            <div class="d-flex justify-content-between align-items-center p-y-16">
                <router-link type="button" to="/" class="go-back-button static" aria-label="Go back to the previous page">
                    <img src="@/assets/icons/go-back-icon-black.svg" aria-hidden="true">
                </router-link>

                <div @click="goToSecondStep" aria-label="Next step" class="accordion-title p-8">Next</div>
            </div>

            <h2 class="main-title text-centered">Create Post</h2>
        </div>

        <!-- Title and Duration input -->
        <div class="form-item-container m-t-16">
            <label for="">
                <div class="form-title">Post Title</div>
                <p class="common-text no-margins m-t-4">Where have you been?</p>
            </label>
            <input v-model="title" type="text" class="form-text-input m-t-8" placeholder="Type here">
            <div v-if="postTitleError.isError" class="small-text error-text m-t-4">{{ postTitleError.message}}</div>
        </div>

        <div class="form-item-container m-t-40">
            <label for="">
                <div class="form-title">Trip Duration</div>
                <p class="common-text no-margins m-t-4">How long was the vacation?</p>
            </label>
            <div class="d-flex align-items-end gap-16">
                <input inputmode="numeric" v-model="durationNumber" type="number" class="form-text-input number-input m-t-8" placeholder="Number">
                <select v-model="durationTime" name="pets" id="pet-select">
                    <option value="days">Day(s)</option>
                    <option value="weeks">Week(s)</option>
                </select>
            </div>
            <div v-if="postDurationError.isError" class="small-text error-text m-t-4">{{ postDurationError.message}}</div>
        </div>

        <!-- Images input (with cropper) -->
        <div class="m-t-40">
            <div class="form-title">Carousel Images</div>
            <p class="common-text no-margins m-t-4">Choose the best photos (maximum 5) to display on the post carousel</p>
            <div v-if="postImagesError.isError" class="small-text error-text m-t-4">{{ postImagesError.message}}</div>
            <ImageCropper
                :isError="postImagesError.isError"
                @updateCroppedImages="getCroppedImages" 
                @removePreview="removePreview"
                :isRound="false" :maxImages="5" 
                class="m-t-16"  
                :previews="store.state.newPost.images"
            />
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
    z-index: 2;
}

.number-input{
    width: 80px;
}

select,
::picker(select) {
    font-family: 'Raleway' !important;
    border: none;
    border-bottom: 1px solid $black;
    font-size: 1rem;
    padding-bottom: 2px;
}
</style>