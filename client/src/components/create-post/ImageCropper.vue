<script setup lang="ts">
import { useTemplateRef, ref } from 'vue';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import { generateRandomString, resizeWithPica } from '@/functions/functions'

defineProps<{
    maxImages: number
}>();


// Image that is passed to the cropper >> It's a base64 string
const pic = ref<string>('');


const croppedImages = ref<File[]>([])
const croppedImagesUrl = ref<string[]>([]);
const cropQueue = ref<string[]>([]);
const activeCropperIndex = ref<number>(0);

// When the page loads the cropper (wrapped in the following modal) has to be closed
const cropperModal = useTemplateRef<HTMLDialogElement>('cropper-modal');
cropperModal.value?.close();

// Function to convert a file in a base64 string
// Is used to convert the files uploaded from the user into base64-strings (that will be passed to the "pic" value)
const toBase64 = (file : File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
})

// Function that gets called once the user uploaded the images
// 1. Get the images from the input and convert them into base64-strings
// 2. Pass the first base64-image to the cropper
// 3. Open the cropper
const getImageData = async function(e: Event){
    cropQueue.value.length = 0;
    pic.value = '';

    // Convert the input images from files to base64
    const input = e.target as HTMLInputElement;
    const inputImages = Array.from(input.files || []) as Array<File>;
    cropQueue.value = await Promise.all(
        inputImages.map(async (image) => await toBase64(image))
    ) 
    
    console.log('before: ', pic.value);
    
    // Pass the first image to the cropper
    pic.value = cropQueue.value[activeCropperIndex.value]!;
    
    console.log('after: ', pic.value);

    // Open the cropper
    cropperModal.value?.showModal();
}

const cropImage = async function(){

    const file : File | null = await cropper!.getFile({
        fileName: generateRandomString(32),
    });

    const resizedImage = await resizeWithPica(file!);

    croppedImagesUrl.value.push(URL.createObjectURL(file!));
    croppedImages.value.push(resizedImage);    

    if(activeCropperIndex.value === cropQueue.value.length - 1){
        cropperModal.value?.close();
        activeCropperIndex.value = 0;
    }else{
        activeCropperIndex.value++;
        pic.value = cropQueue.value[activeCropperIndex.value]!;
    }
}

const removeThumbnail = function(index : number){
    croppedImagesUrl.value.splice(index, 1);
    croppedImages.value.splice(index, 1);
}
</script>

<template>
    <div> 
        <!-- Image Input and previews -->
        <div class="d-flex flex-wrap justify-content-center gap-16">
            <!-- Image input -->
            <label v-if="croppedImages.length < 5" class="file-label" for="images">
                <img src="../../assets/icons/plus-fill-icon-gray.svg" alt="">
                <input @change="getImageData" id="images" type="file" name="images" accept="image/*" required multiple hidden>
            </label>
    
            <!-- Previews -->
             <div v-if="croppedImagesUrl.length > 0" v-for="(image, index) in croppedImagesUrl" :key="index" class="image-thumbnail">
                 <img :src="image" alt="Thumbnail">
                 <img @click="removeThumbnail(index)" class="remove-thumbnail-icon" src="../../assets/icons/close-icon-white-bg-black-stroke.svg" alt="Remove thumbnail image">
             </div>
        </div>           
    
        <!-- Cropper Modal -->
        <dialog class="cropper-modal" ref="cropper-modal">
            <div class="cropper-container">
                <VuePictureCropper
                    v-if="pic.length > 0 && cropQueue.length > 0"

                    :boxStyle="{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8f8f8',
                        margin: 'auto',
                    }"
                    :img="pic"
                    :options="{
                        viewMode: 1,
                        dragMode: 'crop',
                        aspectRatio: 1,
                    }"
                />
            </div>

            <button @click="cropImage" class="m-t-8 m-b-8">Crop</button>
        </dialog>
    </div>

</template>

<style scoped lang="scss">
.cropper-modal{
    width: 100%;
    max-height: 80dvh;
    background-color: $white;
    opacity: 100;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 300;
    flex-direction: column;
    align-items: center;

    &:focus-visible{
        outline: 1px solid $mainColor;
    }

    & *{
        max-height: calc(80dvh - 60px) !important;
    }

    .cropper-container{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
}

.image-thumbnail{
    width: calc(50% - 0.5rem);
    aspect-ratio: 1/1;
    border-radius: 10px;
    box-shadow: 0px 2px 4px 0px rgba($color: #000000, $alpha: 0.5);
    position: relative;
    overflow: hidden;

    img{
        width: 100%;
    }

    .remove-thumbnail-icon{
        position: absolute;
        width: 2.5rem;
        height: 2.5rem;
        top: 0.25rem;
        right: 0.25rem;
    }
}


</style>