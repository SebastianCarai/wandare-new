<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";
import type { Coordinates, Stage } from "@/types";
import { ref, nextTick } from 'vue';
import Slider from "./Slider.vue";

const props = withDefaults(defineProps<{
    stages: Stage[],
    center?: Coordinates,
    zoom?: number, 
    hasBorders?: boolean
}>(), {
    hasBorders : true
});

const emit = defineEmits(["updateZoom", "updateCenter"]);

const isMapExpanded = ref<boolean>(false);
const leafletMap = ref();

const toggleMapFullScreen = function(){
    isMapExpanded.value = !isMapExpanded.value;    

    nextTick(() => {
        leafletMap.value?.leafletObject.invalidateSize();
    });
}

const zoom = ref<number>(props.zoom || 12);
const center = ref<number[]>(props.center || props.stages[0]?.coordinates!);

const updateCenter = function(newCenter: Record<string, number>){       
    center.value = [newCenter.lat!, newCenter.lng!];
    emit('updateCenter', center.value);
}

const updateZoom = function(newZoom: number){
    zoom.value = newZoom;
    emit('updateZoom', zoom.value);
}


</script>

<template>
    <div class="vue-leaflet-map" :class="{full : isMapExpanded, 'm-t-16 m-b-16' : hasBorders}">

    <!-- Expand Map Icon >> At click call toggleMapFullScreen() -->
    <div class="expand-map-button" @click="toggleMapFullScreen">
        <img src="@/assets/icons/expand-icon-black.svg" alt="Expand Map">
    </div>

    <!-- Leaflet Map -->
    <LMap
        :center="center as Coordinates"
        :use-global-leaflet="false"
        :zoom="zoom"
        ref="leafletMap"
        @update:center="updateCenter"
        @update:zoom="updateZoom"
    >
        <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
        >
        </LTileLayer>

        <!-- Render markers for each stage -->
        <div v-for="(stage, index) in stages" :key="index">
            <LMarker :latLng="stage.coordinates as Coordinates">

                <LIcon>
                    <img v-if="stage.type === 'poi'" class="map-marker" src="@/assets/icons/poi-marker-icon.svg"  :alt="stage.stageName">
                    <img v-if="stage.type === 'restaurant'" class="map-marker" src="@/assets/icons/restaurant-marker-icon.svg"  :alt="stage.stageName">
                    <img v-if="stage.type === 'accommodation'" class="map-marker" src="@/assets/icons/accommodation-marker-icon.svg"  :alt="stage.stageName">
                </LIcon>

                <!-- Marker popup, populated with stag content -->
                <LPopup>
                    <h4 class="main-title" 
                        :class="{'m-b-8' : stage.images.length > 0 && stage.stageDescription}"
                    >{{ stage.stageName }}</h4>

                    <Slider v-if="stage.images.length > 0" :images="stage.images" />

                    <p class="map-popup-description small-text">{{ stage.stageDescription }}</p>
                </LPopup>

            </LMarker>
        </div>

    </LMap>

  </div>
</template>

<style lang="scss" scoped>

.vue-leaflet-map{
    height:100%; 
    aspect-ratio: 1/1; 
    border-radius: 20px; 
    overflow: hidden; 
    border: 2px solid $black;
    position: relative;

    &.full{
        height:100dvh;
        aspect-ratio: auto;
        width: 100%;
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 200;
        overflow: visible;
        border: none;
        margin: 0;
    }

    .expand-map-button{
        width: 40px;
        height: 40px;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 10px;
        bottom: 16px;
        z-index: 100;
        background-color: white;
        border: 2px solid rgba(0,0,0,0.2);
        border-radius: 4px;
    }
    
    & *{
        z-index: 5;
    }
}

.leaflet-marker-icon.leaflet-div-icon {
    background: none !important;
    border: none !important;
}

.leaflet-popup-content{
    margin: 0;
    padding: 0.5rem;

    .map-popup-description{
        margin: 1rem 0 0 0;
        min-width: 280px;
    }
}

.map-marker{
    height: 40px;
    position: relative;
    right: 11px;
    bottom: 325%;
}

.leaflet-marker-icon.leaflet-div-icon.leaflet-zoom-animated.leaflet-interactive{
    border: none !important;
    background: none !important;
}
</style>

