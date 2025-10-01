<script setup lang="ts">
import Map from '@/components/global/Map.vue';
import Navbar from '@/components/global/Navbar.vue';
import Slider from '@/components/global/Slider.vue';
import type { Post } from '@/types';
import { ref } from 'vue';

const post: Post = {
    id: 1,
    postTitle: 'Trip in Paris',
    postAuthor: 'Sebastian Carai',
    images: [
        {
            url: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Senna and Eiffel Tower'
        },
        {
            url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            altText: 'Bridge and Senna'
        }
    ],
    duration: '3 days',
    stages: [
        {
            id: 1,
            type: 'poi',
            stageName: 'Eiffel Tower',
            stageDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            coordinates: [48.858370, 2.294481],
            images: [
                {
                    url: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    altText: 'Senna and Eiffel Tower'
                },
                {
                    url: 'https://images.unsplash.com/photo-1603378995290-8d4ce0495ddd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    altText: 'Arco di Trionfo'
                }
            ]
        },
        {
            id: 2,
            type: 'accomodation',
            stageName: 'Arco di Trionfo',
            stageDescription: 'Largo',
            coordinates: [48.873756, 2.294946],
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1603378995290-8d4ce0495ddd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    altText: 'Arco di Trionfo'
                },
                {
                    url: 'https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    altText: 'Senna and Eiffel Tower'
                }
            ]
        }
    ],
    description: 'bla bla',
    whatToWear: 'bla bla bla',
    pricing: 'gratis',
    documents: 'nessuno'
}

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
    <!-- Image Slider -->
    <Slider :isFullScreen="true" :images="post.images" />

    <button type="button" @click="$router.go(-1)" class="go-back-button" aria-label="Go back to the previous page">
        <img src="@/assets/icons/go-back-icon.svg" aria-hidden="true">
    </button>

    <div class="view-container m-t-16">

        <!-- Post title and post author -->
        <h2 class="main-title">{{ post.postTitle }}</h2>
        <div class="gray-text m-t-8">
            A <span class="post-duration">{{ post.duration }}</span> trip 
        </div>

        <!-- Map -->
        <Map :stages="post.stages" />

        <!-- Accordion -->
        <div class="m-t-40">
            <h4 class="capitalized-title">More information</h4>

            <div class="pdp-accordion m-t-8 d-flex flex-column gap-16">
                <div @click="switchAccordion('description')" class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'description'}">
                    <div class="pdp-accordion-header d-flex justify-content-between align-items-center">
                        <div class="accordion-title">Description</div>
                        <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                    </div>
                    <div class="pdp-accordion-body common-text">{{ post.description }}</div>
                </div>

                <div class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'what-to-wear'}">
                    <div @click="switchAccordion('what-to-wear')" class="pdp-accordion-header d-flex justify-content-between align-items-center">
                        <div class="accordion-title">What to Wear</div>
                        <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                    </div>
                    <div  class="pdp-accordion-body common-text">{{ post.whatToWear }}</div>
                </div>

                <div class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'pricing'}" >
                    <div @click="switchAccordion('pricing')" class="pdp-accordion-header d-flex justify-content-between align-items-center">
                        <div class="accordion-title">Pricing</div>
                        <img src="@/assets/icons/chevron-circle-icon-black.svg" aria-hidden="true">
                    </div>
                    <div class="pdp-accordion-body common-text">{{ post.pricing }}</div>
                </div>


                <div class="pdp-accordion-item" :class="{open : isAccordionOpen && activeAccordionItem === 'documents'}">
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
</template>

<style lang="scss" scoped>
.go-back-button{
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 50;
    background: none;
    border: none;
    img{
        width: 100%;
    }
}

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