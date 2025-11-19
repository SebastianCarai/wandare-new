<script setup lang="ts">
import Navbar from '@/components/global/Navbar.vue';
import ImageCropper from '@/components/post-create-edit/ImageCropper.vue';
import { ref, type Ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import DeleteImagePopup from '@/components/post-create-edit/DeleteImagePopup.vue';

const router = useRouter();
const route = useRoute();
const store = useStore();
const title = ref<string>(store.state.newPost.title || '');
const durationNumber = ref<number | null>(parseInt(store.state.newPost.duration.split(' ')[0]) || null);
const durationTime = ref<string>(store.state.newPost.duration.split(' ')[1] || 'days');
const duration = ref<string>(store.state.newPost.duration || '');

const postTitleError = ref<{isError: boolean, message: string}>({isError: false, message: ''});
const postDurationError = ref<{isError: boolean, message: string}>({isError: false, message: ''});
const postImagesError = ref<{isError: boolean, message: string}>({isError: false, message: ''});

/*
    Function to check if the title/duration/images field has been populated

    @code
    Check if input is a string (title or duration) or a file array (images)
    If the input length is 0, show error message

    @param input >> can be either the title or duration string, or the array of images
    @param error >> the error object that will be displaying the error message (contains error visibility and message)
    @param message >> error message that will be displayed (pass value to error.message)
*/
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

/*
    Function that checks if inputs are valid and redirects to the second step of the post editing

    @code
    Compose the duration string by combining the number value and the time (days/weeks)
    Check input lenght for title, duration and images
    If there are no errors, save title and duration to root state (images gets always saved in state)
    Go to second step
*/
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

        router.push({path: `/edit-post/${route.params.id}/step-2`});
        
    }else{
        return null
    }
}

/*
    Function that saves images in the root state once the cropper emits the updateCroppedImages event

    @code
    Commit addNewPostImages mutation and pass the image files

    @param payload >> image files returned by the cropper
*/
const getCroppedImages = function(payload: File[]){    
    store.commit('addNewPostImages', payload);
}

/*
    Function that checks for updates for the duration input 

    @code
    If the duration number input is empty, clear the duration variable 
    (this will trigger the checkInputLength function, that will show the error)
    If the input is not empty, save the new duration as key-value pair into the updatedPostData object
*/
const updateDuration = function(){
    if(!durationNumber.value || durationNumber.value == 0){
        duration.value = '';
    }else{
        store.commit('updatePostData', {key: 'duration', value: durationNumber.value + ' ' + durationTime.value});
    }
}

const removePreviewThumbnail = function(index: number, image: string){
    if(image.includes('blob:')){
        store.commit('removePreviewThumbnail', index);
    }else{
        store.commit('showDeleteImagePopup', {imageToDelete: image, imageIndex: index});
    }
}
</script>

<template>
    <div class="view-container">

        <DeleteImagePopup />

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
            <input 
                v-model="title"
                @keyup="store.commit('updatePostData', {key: 'title', value: title});" 
                type="text" 
                class="form-text-input m-t-8" 
                placeholder="Type here"
            >
            <div v-if="postTitleError.isError" class="small-text error-text m-t-4">{{ postTitleError.message}}</div>
        </div>

        <!-- Trip duration input -->
        <div class="form-item-container m-t-40">
            <label for="">
                <div class="form-title">Trip Duration</div>
                <p class="common-text no-margins m-t-4">How long was the vacation?</p>
            </label>
            <div class="d-flex align-items-end gap-16">
                <input
                    inputmode="numeric" 
                    v-model="durationNumber" 
                    type="number" 
                    class="form-text-input number-input m-t-8" 
                    placeholder="Number"
                    @keyup="updateDuration"
                >
                <select 
                    @change="store.commit('updatePostData', {key: 'duration', value: durationNumber + ' ' + durationTime})" 
                    v-model="durationTime" 
                    name="duration-time" 
                    id="duration-time-select"
                >
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
                :isRound="false" :maxImages="5" 
                class="m-t-16"  
                :previews="store.state.newPost.images"
                @removePreview="removePreviewThumbnail"
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