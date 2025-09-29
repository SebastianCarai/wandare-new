export type Image = {
    url: string,
    altText?: string,
}

export interface Post{
    id: number,
    postTitle: string,
    postAuthor: string,
    images: Image[] | [],
    duration: string
}

