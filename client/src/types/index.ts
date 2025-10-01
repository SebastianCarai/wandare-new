export type Coordinates = [number, number];

export type Image = {
    url: string,
    altText?: string,
};

export interface Stage{
    id : number,
    type: 'poi' | 'accomodation',
    stageName: string,
    stageDescription?: string,
    coordinates: Coordinates,
    images: Image[]
};

export interface BasePost{
    id: number,
    postTitle: string,
    postAuthor: string,
    images: Image[],
    duration: string
};

export interface Post extends BasePost{
    id: number,
    postTitle: string,
    postAuthor: string,
    images: Image[] | [],
    duration: string,
    stages: Stage[],
    description?: string,
    whatToWear?: string,
    pricing?: string,
    documents?: string
};




