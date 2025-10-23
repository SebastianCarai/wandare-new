<script setup lang="ts">
import Map from '@/components/global/Map.vue';
import Navbar from '@/components/global/Navbar.vue';
import Slider from '@/components/global/Slider.vue';
import type { Post } from '@/types';
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import Loader from '@/components/global/Loader.vue';

const post = ref<Post>();
const isLoading = ref<boolean>(true);


onBeforeMount(async() => {
    const router = useRoute();

    const postId = router.params.id;

    const postDetails = await axios.get(`/api/posts/${postId}`);
    
    post.value = postDetails.data.data;
    isLoading.value = false;
})


// activeAccordionItem keeps track of which item of the accordion is open (one per time)
// isAccordionOpen checks if any accordion item is open (needed when a user open and than closes the same item)
const activeAccordionItem= ref<string>('');
const isAccordionOpen= ref<boolean>(false);

function switchAccordion(accordionItem: string = ''){    
    // If the clicked accordionItem is the same as the one already open,
    // Close the accordion items (all accordion items are now closed)
    if(activeAccordionItem.value === accordionItem){
        activeAccordionItem.value = '';
        isAccordionOpen.value = false;
    }else{
        // If the clicked accordionItem is different from the one already open,
        // keep the accordion open, but activate the new clicked item
        isAccordionOpen.value = true;
        activeAccordionItem.value = accordionItem;
    }
}
</script>

<template>
    <div>

        <Loader v-if="isLoading" />
        <div v-if="post && !isLoading">
            <!-- Image Slider -->
            <Slider v-if="!isLoading" :isFullScreen="true" :images="post.images" />
        
            <button type="button" @click="$router.go(-1)" class="go-back-button" aria-label="Go back to the previous page">
                <img src="@/assets/icons/go-back-icon.svg" aria-hidden="true">
            </button>
        
            <div class="view-container m-t-16">
        
                <!-- Post title and post author -->
                <h2 class="main-title">{{ post.title }}</h2>
                <div class="gray-text m-t-8">
                    A <span class="post-duration">{{ post.duration }}</span> trip 
                </div>
        
                <!-- Map -->
                <Map v-if="!isLoading" :stages="post.stages" />
        
                <!-- Accordion -->
                <div class="m-t-40" v-if="post?.description || post?.whatToBring || post?.pricing || post?.documents">
                    <h4 class="capitalized-title">More information</h4>
        
                    <div class="pdp-accordion m-t-8 d-flex flex-column gap-16">
                        <div v-if="post?.description" @click="switchAccordion('description')" class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'description'}">
                            <div class="pdp-accordion-header d-flex justify-content-between align-items-center">
                                <div class="accordion-title">Description</div>
                                <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                            </div>
                            <div class="pdp-accordion-body common-text">{{ post.description }}</div>
                        </div>
        
                        <div v-if="post?.whatToBring" class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'what-to-wear'}">
                            <div @click="switchAccordion('what-to-wear')" class="pdp-accordion-header d-flex justify-content-between align-items-center">
                                <div class="accordion-title">What to Bring</div>
                                <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                            </div>
                            <div  class="pdp-accordion-body common-text">{{ post.whatToBring }}</div>
                        </div>
        
                        <div v-if="post?.pricing" class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'pricing'}" >
                            <div @click="switchAccordion('pricing')" class="pdp-accordion-header d-flex justify-content-between align-items-center">
                                <div class="accordion-title">Pricing</div>
                                <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                            </div>
                            <div class="pdp-accordion-body common-text">{{ post.pricing }}</div>
                        </div>
        
        
                        <div v-if="post?.documents" class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'documents'}">
                            <div @click="switchAccordion('documents')" class="pdp-accordion-header d-flex justify-content-between align-items-center">
                                <div class="accordion-title">Documents required</div>
                                <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                            </div>
                            <div class="pdp-accordion-body common-text">{{ post.documents }}</div>
                        </div>
                    </div>
                </div>
        
                <Navbar activeNavItem="none" />
            </div>
        </div>
        <div v-else>
            Post Not Found
        </div>
    </div>
</template>

<style lang="scss" scoped>

.pdp-accordion-item{
    border-top: 1px solid $black;
    border-bottom: 1px solid $black;
    border-radius: 16px;
    max-height: 56px;
    overflow: hidden;

    &.open{
        max-height: 3000px;
        transition: all 0.5s ease-out;  
    }

    .pdp-accordion-header{
        padding: 1rem;
    }

    .pdp-accordion-body{
        // max-height: 0px;
        // visibility: hidden;
        padding: 0.5rem 1rem;

        // &.open{
        //     max-height: 3000px;
        //     visibility: visible;
        //     transition: max-height 0.5s ease-out;
        // }
    }
}
</style>