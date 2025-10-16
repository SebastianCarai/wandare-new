import { createStore } from 'vuex';
import type { RootState, FirstStep } from '@/types/state';
import type { newStage } from '@/types';

export const store = createStore<RootState>({
    state:{
        isAuthenticated: false,
        newPost: {
            title: '',
            duration: '',
            images: [],
            stages: [
                {
                    type: 'poi',
                    stageName: 'Colosseo',
                    stageDescription: 'Il più bello de Roma',
                    images: [],
                    coordinates: [41.890210, 12.492231]
                },
                {
                    type: 'accomodation',
                    stageName: 'Colosseo',
                    stageDescription: 'Il più bello de Roma',
                    images: [],
                    coordinates: [41.890210, 12.492231]
                },
                {
                    type: 'restaurant',
                    stageName: 'Colosseo',
                    stageDescription: 'Il più bello de Roma',
                    images: [],
                    coordinates: [41.890210, 12.492231]
                }
            ],
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
        addStage(state, newStage: newStage){
            state.newPost.stages.push(newStage);
        },
        saveThirdStepData(state, thirdStepData: {description?: string, whatToBring?: string, pricing?: string, documents?: string}){
            state.newPost.description = thirdStepData.description || '';
            state.newPost.whatToBring = thirdStepData.whatToBring || '';
            state.newPost.pricing = thirdStepData.pricing || '';
            state.newPost.documents = thirdStepData.documents || '';
        },
        setAuthStatus(state, isAuthenticated: boolean){
            console.log('before:', state.isAuthenticated);
            
            state.isAuthenticated = isAuthenticated;
            console.log('after:', state.isAuthenticated);

        }
    }
});

