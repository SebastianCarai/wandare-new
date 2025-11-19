import type { Coordinates, Newstage } from "./index"


export interface FirstStep{
    title: string,
    duration: string,
    images: File[]
};

export interface SecondStep{
    stages: Newstage[],
    mapCenter: Coordinates | [],
    mapZoom: number,
};

export interface ThirdStep{
    description?: string,
    whatToBring?: string,
    pricing?: string,
    documents?: string
}

export interface NewPost extends FirstStep, SecondStep, ThirdStep{ id? : number}

export interface RootState{
    newPost: NewPost,
    statusCode: number,
    errorMessage: string,
    isLoading: boolean,
    updatedPostData : Record<string, any>,
    keysToDelete: string[],
    isImageDeletePopup: boolean,
    imageToDelete: string,
    imageIndexToDelete: number | null
}