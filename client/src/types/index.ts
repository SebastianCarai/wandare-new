export type Coordinates = [number, number];

export type Image = {
    url: string,
    altText?: string,
};
export interface Newstage{
    type: 'poi' | 'restaurant' | 'accommodation',
    stageName: string,
    stageDescription?: string,
    coordinates: Coordinates,
    images: File[]
}

export interface Stage{
    id: number
    type: 'poi' | 'restaurant' | 'accommodation',
    stageName: string,
    stageDescription?: string,
    coordinates: Coordinates,
    images: string[]
};


export interface BasePost{
    id: number,
    title: string,
    authorId: string,
    authorName: string,
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




