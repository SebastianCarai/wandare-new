export interface Stage{
    id: number,
    type: 'poi' | 'restaurant' | 'accomodation',
    name: string,
    description: string,
    images: string[],
    coordinates: [number, number]
}

export interface Post{
    id: number,
    title: string,
    duration: string,
    author: string,
    images: string[],
    stages: Stage[],
    description?: string,
    whatToBring?: string,
    pricing?: string,
    documents?: string
}