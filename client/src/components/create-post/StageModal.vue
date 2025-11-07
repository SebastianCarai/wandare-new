<script setup lang="ts">
import { ref } from 'vue';
import type { Newstage } from '@/types';
import VueGoogleAutocomplete from "vue-google-autocomplete";
import ImageCropper from './ImageCropper.vue';
import { useStore } from 'vuex';

const stageFormStep = ref<number>(1);
const isModalOpen = ref<boolean>(false);
const modalHeader = ref<string>('Choose Stage Type');

defineProps<{
    isError: boolean
}>()

const store = useStore();

const stage = ref<Newstage>({
    type: 'poi',
    stageName: '',
    stageDescription: '',
    coordinates: [0,0],
    images:[]
});

const setStageType = function(type: 'poi' | 'restaurant' | 'accommodation'){
    stage.value.type = type;
    stageFormStep.value = 2;
    modalHeader.value = 'Stage detials'
}

const closeStageModal = function(){
    stageFormStep.value = 1;
    isModalOpen.value = false;
    stage.value = {
        type: 'poi',
        stageName: '',
        stageDescription: '',
        coordinates: [0,0],
        images:[]
    }
}

const getAddressData = function(addressData: any, placeResultData: any){
    console.log('addressData: ', addressData);
    console.log('placeResultData: ', placeResultData);
    
    stage.value.stageName = placeResultData.name;
    stage.value.coordinates = [addressData.latitude, addressData.longitude];
}

const updateStageImages = function(payload: Array<File>){
    if(stage.value.images.length + payload.length <= 3){
        payload.forEach(newImage => {
            stage.value.images.push(newImage);
        });
    }
}

const saveStage = function(){
    store.commit('addStage', stage.value);
    closeStageModal();
}

</script>

<template>
    <div :class="{error : isError}" class="add-stage-button m-t-16" aria-label="Add stage" @click="isModalOpen = true">
        <div class="accordion-title">Add stage</div>
        <img src="@/assets/icons/plus-fill-icon-black.svg" alt="">
    </div>
    <div v-if="isError" class="small-text error-text m-t-4">Add at least one stage</div>

    <dialog v-if="isModalOpen" open class="stage-form-modal">
        <!-- Stage Header -->
        <div class="stage-modal-header">
            <img v-if="stageFormStep === 1" class="m-t-8 m-l-16" src="@/assets/icons/close-icon-white.svg" alt="Close modal" @click="isModalOpen = false">

            <div v-if="stageFormStep > 1" class="d-flex justify-content-between align-items-center">
                <img src="@/assets/icons/go-back-icon.svg" alt="Go to previous step" @click="closeStageModal">
                <div class="accordion-title text-white" @click="saveStage">Save</div>
            </div>

            <h4 class="main-title text-white text-centered m-t-8">{{ modalHeader }}</h4>
        </div>

        <!-- Stage Type Choice -->
        <div v-if="stageFormStep == 1" class="d-flex flex-column align-items-center m-t-16">
            <div class="stage-type-button" @click="setStageType('poi')">
                <img src="@/assets/icons/poi-icon-white.svg" aria-hidden="true">
                <div class="form-title text-white">Point of Interest</div>
            </div>

            <div class="stage-type-button" @click="setStageType('restaurant')">
                <img src="@/assets/icons/restaurant-icon-white.svg" aria-hidden="true">
                <div class="form-title text-white">Restaurant</div>
            </div>

            <div class="stage-type-button" @click="setStageType('accommodation')">
                <img src="@/assets/icons/accommodation-icon-white.svg" aria-hidden="true">
                <div class="form-title text-white">accommodation</div>
            </div>
        </div>

        <!-- Stage Details -->
        <div v-if="stageFormStep == 2">
            <div class="d-flex flex-column align-items-center justify-content-stretch m-t-16 gap-16">
                <div style="width: 100%;">
                    <label for="google-autocomplete">Stage name and location</label>
                    <VueGoogleAutocomplete
                        v-model="stage.stageName"
                        id="google-autocomplete"
                        :value="stage.stageName"
                        types="establishment"
                        classname="form-control"
                        placeholder="Enter the name of the stage"
                        v-on:placechanged="getAddressData"
                        class="google-input"
                    />
                </div>
                
                <div style="width: 100%;">
                    <label for="stage-description">
                        Stage description
                    </label>
                    <textarea 
                        id="stage-description" 
                        v-model="stage.stageDescription"
                        placeholder="Describe your stage"
                        class="stage-modal-textarea"
                    ></textarea>
                </div>

                <div style="width: 100%;">
                    <label for="stage-images" class="m-b-8">Stage images (max. 3)</label>
                    <ImageCropper id="stage-images" :previews="stage.images" @updateCroppedImages="updateStageImages" :maxImages="3" :isWhite="true" />
                </div>
            </div>

        </div>

    </dialog>

</template>

<style scoped lang="scss">
.add-stage-button{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px dashed $black;
    border-radius: 0.5rem;

    &.error{
        border: 1px dashed red;
    }
}


.stage-form-modal{
    position: fixed;
    top: 50%;
    left: 50%;
    max-height: 80dvh;
    overflow: auto;
    transform: translate(-50%, -50%);
    width: calc(100% - 2rem);
    max-width: 480px;
    background-color: #767676;
    color: $white;
    padding: 1rem 1rem 2.5rem 1rem;
    border-radius: 2.5rem;
    z-index: 300;

    .stage-type-button{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80%;
        row-gap: 0.5rem;
        margin-top: 1rem;
        background-color: rgba($color: $white, $alpha: 0.4);
        padding: 1rem 0;
        border-radius: 1rem;
    }
}

.google-input{
    width: 100%;
}
.stage-modal-textarea{
    width: 100%;
    min-height: 160px;
    border-radius: 1rem;
    padding: 0.5rem;
    &:focus-visible{
        outline: none;
    }
}
</style>