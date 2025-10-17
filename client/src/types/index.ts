export type Coordinates = [number, number];

export type Image = {
    url: string,
    altText?: string,
};

export interface Stage{
    id: number
    type: 'poi' | 'restaurant' | 'accomodation',
    stageName: string,
    stageDescription?: string,
    coordinates: Coordinates,
    images: string[]
};

export interface Newstage{
    type: 'poi' | 'restaurant' | 'accomodation',
    stageName: string,
    stageDescription?: string,
    coordinates: Coordinates,
    images: File[]
}

export interface BasePost{
    id: number,
    title: string,
    author: string,
    images: string[],
    duration: string
};

export interface Post extends BasePost{
    stages: Stage[],
    description?: string,
    whatToBring?: string,
    pricing?: string,
    documents?: string
};




