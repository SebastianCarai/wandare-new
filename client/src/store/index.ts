import { createStore } from 'vuex';
import type { RootState } from '@/types/state';
import mutations from './mutations';

export const store = createStore<RootState>({
    state:{
        statusCode: 200,
        errorMessage: '',
        isLoading: false,
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
        updatedPostData : {},
        keysToDelete: [],
        isImageDeletePopup: false,
        imageToDelete: '',
        imageIndexToDelete: null,
    },
    mutations
});

