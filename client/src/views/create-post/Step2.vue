<script setup lang="ts">
import StageModal from '@/components/create-post/StageModal.vue';
import Navbar from '@/components/global/Navbar.vue';
import { useStore } from 'vuex';
import {ref} from 'vue'

const store = useStore();
const activeAccordionItem = ref<number>(-1);
const isAccordionOpen = ref<boolean>(false);

const switchAccordion = function(index : number){
    // If the clicked accordionItem is the same as the one already open,
    // Close the accordion items (all accordion items are now closed)
    if(activeAccordionItem.value === index){
        activeAccordionItem.value = -1;
        isAccordionOpen.value = false;
    }else{
        // If the clicked accordionItem is different from the one already open,
        // keep the accordion open, but activate the new clicked item
        isAccordionOpen.value = true;
        activeAccordionItem.value = index;
    }
}
</script>

<template>
    <div class="view-container">
        <!-- Create Post Header -->
        <div class="create-post-header">
            <div class="d-flex justify-content-between align-items-center p-y-16">
                <router-link type="button" to="/create-post/step-1" class="go-back-button static" aria-label="Go back to the previous page">
                    <img src="@/assets/icons/go-back-icon-black.svg" aria-hidden="true">
                </router-link>

                <router-link class="accordion-title p-8" to="/create-post/step-3">Next</router-link>
            </div>

            <h2 class="main-title text-centered">Create Post</h2>
        </div>

        <!-- Stages -->
        <div class="form-item-container m-t-16">
            <div class="form-title">Stages</div>
            <p class="common-text no-margins m-t-4">Time to add stages to your itinerary</p>
        </div>

        <StageModal />

        <div :class="{open : isAccordionOpen && activeAccordionItem == index}" class="stage-item m-t-16" v-for="(stage, index) in store.state.newPost.stages" :key="index">
            <div class="d-flex justify-content-between p-16" @click="switchAccordion(index)">
                <div class="d-flex justify-content-start align-items-center gap-8">
                    <img class="stage-icon" v-if="stage.type == 'poi'" src="@/assets/icons/poi-icon-black.svg" alt="">
                    <img class="stage-icon" v-if="stage.type == 'restaurant'" src="@/assets/icons/restaurant-icon-black.svg" alt="">
                    <img class="stage-icon" v-if="stage.type == 'accomodation'" src="@/assets/icons/accomodation-icon-black.svg" alt="">
                    <div class="vertical-divider"></div>
                    <div class="accordion-title">{{ stage.stageName }}</div>
                </div>

                <img src="../../assets/icons/chevron-circle-icon-black.svg" alt="">
            </div>

            <div v-if="isAccordionOpen && activeAccordionItem == index">
                <p class="accordion-body common-text m-t-24 no-margins p-x-16"> {{ stage.stageDescription }}</p>
            
                <div class="view-gallery-button text-white common-text">
                    View gallery
                </div>
            </div>
        </div>


        <Navbar activeNavItem="create-post" />
    </div>
</template>

<style lang="scss" scoped>

.stage-item{
    border: 1px solid $black;
    border-radius: 0.5rem;

    &.open .accordion-body{
        max-height: 30000px;
        transition: all 0.5s ease-out;
    }

    .stage-icon{
        width: 24px;
    }
}

.view-gallery-button{
    text-align: center;
    margin-top: 16px;
    background-color: $mainColor;
    padding: 0.5rem 0;
}

.accordion-body{
    max-height: 0;
}

.vertical-divider{
    height: 100%;
    width: 1px;
    background-color: $black;
}
</style>