export interface Stage{
    id: number,
    type: 'poi' | 'restaurant' | 'accommodation',
    name: string,
    description: string,
    images: string[],
    latitude: number,
    longitude: number,
    post_id: number
}

export interface Post{
    id: number,
    title: string,
    duration: string,
    author_id: string,
    author_name: string,
    images: string[],
    stages: Stage[],
    quality?: number,
    description?: string,
    whatToBring?: string,
    pricing?: string,
    documents?: string
}