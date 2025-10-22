"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostApiSchema = exports.BasePostApiSchema = exports.StageApiSchema = void 0;
const zod_1 = require("zod");
// Stage types
const StageDbSchema = zod_1.z.object({
    id: zod_1.z.number(),
    type: zod_1.z.enum(['poi', 'restaurant', 'accomodation']),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    images: zod_1.z.array(zod_1.z.string()),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    post_id: zod_1.z.number()
});
// How stage data will be formatted
exports.StageApiSchema = StageDbSchema.transform((data) => ({
    id: data.id,
    type: data.type,
    stageName: data.name,
    stageDescription: data.description,
    images: data.images,
    coordinates: [data.latitude, data.longitude],
    postId: data.post_id
}));
// Base post schema
const BasePostDbSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    author_id: zod_1.z.string(),
    author_name: zod_1.z.string(),
    duration: zod_1.z.string(),
    images: zod_1.z.array(zod_1.z.string()),
});
exports.BasePostApiSchema = BasePostDbSchema.transform((data) => ({
    id: data.id,
    title: data.title,
    authorId: data.title,
    authorName: data.author_name,
    duration: data.duration,
    images: data.images
}));
// Full post schema
const PostDbSchema = BasePostDbSchema.extend({
    stages: zod_1.z.array(exports.StageApiSchema),
    description: zod_1.z.string().optional(),
    what_to_bring: zod_1.z.string().optional(),
    pricing: zod_1.z.string().optional(),
    documents: zod_1.z.string().optional(),
});
// How Post data will be formatted
exports.PostApiSchema = PostDbSchema.transform((data) => ({
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
