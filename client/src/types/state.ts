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

export interface NewPost extends FirstStep, SecondStep, ThirdStep{}

export interface RootState{
    newPost: NewPost,
    isAuthenticated: boolean,
    statusCode: number,
    errorMessage: string,
    isLoading: boolean
}