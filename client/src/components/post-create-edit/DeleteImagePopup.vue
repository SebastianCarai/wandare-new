<script lang="ts" setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore();
const route = useRoute();

/*
    Function that removes image from the previews 
*/
const deleteImage = function(){
    if((store.state.imageToDelete as string).includes('blob:')){
        store.commit('removePreviewThumbnail', store.state.imageIndexToDelete);
    }else{
        store.commit('removePreviewThumbnail', store.state.imageIndexToDelete);
        const keyToDelete = (store.state.imageToDelete as string).split('https://dh7jufp0oeaok.cloudfront.net/')[1];
        axios.delete(`/api/images/${route.params.id}/${keyToDelete}`)
        .catch(err => console.error(err));
    }

    store.commit('hideDeleteImagePopup');
}
</script>

<template>
    <div 
        v-if="store.state.isImageDeletePopup" 
        class="confirm-delete-popup d-flex align-items-center justify-content-center gap-16"
    >
        <button @click="store.commit('hideDeleteImagePopup', false)" class="common-button ghost-button">Cancel</button>
        <button @click="deleteImage" class="common-button">Delete Image</button>
    </div>
</template>

<style lang="scss" scoped>
.confirm-delete-popup{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    z-index: 50;
    background-color: antiquewhite;
}
</style>