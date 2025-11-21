import type { Coordinates, Newstage } from "@/types";
import type { NewPost, RootState } from "@/types/state";

const mutations = {

    /*
        Save title and duration into the newPost state object

        @params firstStepData = {title: string, duration: string}
    */
    saveFirstStepData(state: RootState, firstStepData: {title: string, duration: string}){
        state.newPost.title = firstStepData.title;
        state.newPost.duration = firstStepData.duration;
    },
    /*
        Save cropped file images into the newPost.images state object

        @params newImages >> images cropped from ImageCropper
    */
    addNewPostImages(state: RootState, newImages: File[]){
        if(state.newPost.images.length + newImages.length <= 5){
            newImages.forEach(newImage => {
                state.newPost.images.push(newImage);
            });
        }
    },
    /*
        Remove image from thumbnail previews

        @params indexToDelete >> index of the image to remove
    */
    removePreviewThumbnail(state: RootState, indexToDelete: number){
        state.newPost.images.splice(indexToDelete, 1)
    },
    addStage(state: RootState, newstage: Newstage){
        state.newPost.stages.push(newstage);
    },
    updateMapCenter(state: RootState, newCenter: Coordinates){
        state.newPost.mapCenter = newCenter;
    },
    updateMapZoom(state: RootState, newZoom: number){
        state.newPost.mapZoom = newZoom;
    },
    saveThirdStepData(state: RootState, thirdStepData: {description?: string, whatToBring?: string, pricing?: string, documents?: string}){
        state.newPost.description = thirdStepData.description || '';
        state.newPost.whatToBring = thirdStepData.whatToBring || '';
        state.newPost.pricing = thirdStepData.pricing || '';
        state.newPost.documents = thirdStepData.documents || '';
    },
    emptyNewPostState(state: RootState){
        state.newPost =  {
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
        }
    },
    setStatusAndError(state: RootState, payload: {statusCode: number, errorMessage: string}){
        state.statusCode = payload.statusCode;
        state.errorMessage = payload.errorMessage;
    },
    setLoadingState(state: RootState, isLoading: boolean){
        state.isLoading = isLoading;
    },
    setPostToEdit(state: RootState, postToEdit: NewPost){
        state.newPost = postToEdit;
    },
    updatePostData(state: RootState, payload: {key: string, value: string | number | File[]}){
        state.updatedPostData[payload.key] = payload.value;
    },
    showDeleteImagePopup(state: RootState, payload: {imageToDelete: string, imageIndex: number}){
        state.isImageDeletePopup = true;
        state.imageToDelete = payload.imageToDelete;
        state.imageIndexToDelete = payload.imageIndex
    },
    hideDeleteImagePopup(state: RootState){
        state.isImageDeletePopup = false;
    }
}

export default mutations