// Generate random string
export function generateRandomString(length: number) : string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Resize images with pica. Max size: 1000px
import Pica from 'pica';
const pica = Pica();

export async function resizeWithPica(file: File, maxSize = 1000, quality = 0.8): Promise<File> {
    // load image from file
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = e.target!.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // compute target dimensions while keeping aspect ratio
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    const targetWidth = Math.round(img.width * scale);
    const targetHeight = Math.round(img.height * scale);

    // source + target canvases
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = img.width;
    srcCanvas.height = img.height;
    srcCanvas.getContext('2d')!.drawImage(img, 0, 0);

    const destCanvas = document.createElement('canvas');
    destCanvas.width = targetWidth;
    destCanvas.height = targetHeight;

    // do resize
    await pica.resize(srcCanvas, destCanvas);

    // export to JPEG (or WebP)
    const blob = await pica.toBlob(destCanvas, 'image/jpeg', quality);

    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
}

import type { NewPost } from '@/types/state';
import type { Newstage } from '@/types/index'

export const createPostFormData = (post: NewPost): FormData => {
    const formData = new FormData();
    

    for (const [key, value] of Object.entries(post)){
        if(key !== 'images' && key !== 'stages'){
            formData.append(key, value as string)
        }
    }

    post.images.forEach(image => {
        formData.append('postImages', image)
    });

    post.stages.forEach((stage: Newstage, index: number) => {        

        formData.append(`stageData_${index}`, JSON.stringify({
            type: stage.type,
            stageName: stage.stageName,
            stageDescription: stage.stageDescription,
            coordinates: stage.coordinates
        }));

        stage.images.forEach(image => {
            formData.append(`stageImages${index}`, image);
        });
    });

    return formData;
}




