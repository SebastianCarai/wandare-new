import { z } from 'zod';

// Stage types
const StageDbSchema = z.object({
    id: z.number(),
    type: z.enum(['poi', 'restaurant', 'accomodation']),
    name: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    latitude: z.number(),
    longitude: z.number(),
    post_id: z.number()
});

// How stage data will be formatted
export const StageApiSchema = StageDbSchema.transform((data) => ({
    id: data.id,
    type: data.type,
    stageName: data.name,
    stageDescription: data.description,
    images: data.images,
    coordinates: [data.latitude, data.longitude],
    postId: data.post_id
}));


// Base post schema
const BasePostDbSchema = z.object({
    id: z.number(),
    title: z.string(),
    author_id: z.string(),
    author_name: z.string(),
    duration: z.string(),
    images: z.array(z.string()),
});

export const BasePostApiSchema = BasePostDbSchema.transform((data) => ({
    id: data.id,
    title: data.title,
    authorId: data.title,
    authorName: data.author_name,
    duration: data.duration,
    images: data.images
}));

// Full post schema
const PostDbSchema = BasePostDbSchema.extend({
    stages: z.array(StageApiSchema),
    description: z.string().optional(),
    what_to_bring: z.string().optional(),
    pricing: z.string().optional(),
    documents: z.string().optional(),
});

// How Post data will be formatted
export const PostApiSchema = PostDbSchema.transform((data) => ({
    id: data.id,
    title: data.title,
    authorId: data.author_id,
    authorName: data.author_name,
    images: data.images,
    stages: data.stages,
    duration: data.duration,
    description: data.description,
    whatToBring: data.what_to_bring,
    pricing: data.pricing,
    documents: data.documents
}));
