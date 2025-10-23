import { createStore } from 'vuex';
import type { RootState, FirstStep } from '@/types/state';
import type { Coordinates, Newstage } from '@/types';

export const store = createStore<RootState>({
    state:{
        isAuthenticated: false,
        newPost: {
            title: '',
            duration: '',
            images: [],
            mapCenter: [],
            mapZoom: 0,
            stages: [],
            description: '',
            whatToBring: '',
            pricing: '',
            documents: ''
        },
    },
    mutations: {
        saveFirstStepData(state, firstStepData: FirstStep){
            state.newPost.title = firstStepData.title;
            state.newPost.duration = firstStepData.duration;
        },
        addNewPostImages(state, newImages: File[]){
            if(state.newPost.images.length + newImages.length <= 5){
                newImages.forEach(newImage => {
                    state.newPost.images.push(newImage);
                });
            }
        },
        removePreviewThumbnail(state, indexToDelete: number){
            state.newPost.images.splice(indexToDelete, 1)
        },
        addStage(state, newstage: Newstage){
            state.newPost.stages.push(newstage);
        },
        updateMapCenter(state, newCenter: Coordinates){
            state.newPost.mapCenter = newCenter;
        },
        updateMapZoom(state, newZoom: number){
            state.newPost.mapZoom = newZoom;
        },
        saveThirdStepData(state, thirdStepData: {description?: string, whatToBring?: string, pricing?: string, documents?: string}){
            state.newPost.description = thirdStepData.description || '';
            state.newPost.whatToBring = thirdStepData.whatToBring || '';
            state.newPost.pricing = thirdStepData.pricing || '';
            state.newPost.documents = thirdStepData.documents || '';
        },
        setAuthStatus(state, isAuthenticated: boolean){            
            state.isAuthenticated = isAuthenticated;
        }
    }
});

