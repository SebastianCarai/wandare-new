import type { newStage } from "./index"


export interface FirstStep{
    title: string,
    duration: string,
    images: File[]
};

export interface SecondStep{
    stages: newStage[]
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
    isAuthenticated: boolean
}