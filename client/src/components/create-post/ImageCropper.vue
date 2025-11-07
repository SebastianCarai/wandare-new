<script setup lang="ts">
import { useTemplateRef, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import { generateRandomString, resizeWithPica } from '@/functions/functions';

const props = defineProps<{
    maxImages: number,
    previews: File[],
    isWhite?: boolean,
    isError?: boolean
}>();

// Emit updateCroppedImages event to pass the cropped images to the parent component
const emit = defineEmits(["updateCroppedImages", "removePreview"]);

// Image that is passed to the cropper >> It's a base64 string
const pic = ref<string>('');

const previewUrls = ref<string[]>([]);
const buildPreview = function(files: File[]){
    previewUrls.value.forEach(url => URL.revokeObjectURL(url));
    previewUrls.value = files.map(file => URL.createObjectURL(file));
}
onMounted(() => {
    buildPreview(props.previews)
});

onBeforeUnmount(() => {
    previewUrls.value.forEach(url => URL.revokeObjectURL(url));
    previewUrls.value = [];
});

watch(
    () => props.previews,
    (newFiles) => buildPreview(newFiles),
    { deep: true }
)


const croppedImages = ref<File[]>([]);
const cropQueue = ref<string[]>([]);
const activeCropperIndex = ref<number>(0);

// When the page loads the cropper (wrapped in the following modal) has to be closed
const cropperModal = useTemplateRef<HTMLDialogElement>('cropper-modal');
cropperModal.value?.close();

// Function to converrt the files uploaded from the user into base64-strings 
// (the cropper accepts only base64 strings)
const toBase64 = (file : File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
})

// Function that gets called once the user uploaded the images
// 1. Reset the queue, the cropped images (that are stored in the parent component memory), 
// and the previews (they will be re-rendered after the crop)
// 2. Get the images from the input and convert them into base64-strings
// 3. Pass the first base64-image to the cropper
// 4. Open the cropper
const getImageData = async function(e: Event){
    // Reset queue, cropped images and previews
    cropQueue.value.length = 0;
    pic.value = '';
    previewUrls.value.forEach(url => URL.revokeObjectURL(url));
    previewUrls.value = [];
    croppedImages.value = [];

    // Convert the input images from files to base64
    const input = e.target as HTMLInputElement;
    const inputImages = Array.from(input.files || []) as Array<File>;

    // Reject the files if the user doesn't respect the maximum number
    if(inputImages.length > props.maxImages){
        alert(`Error: you can upload maximum ${props.maxImages} images`);
        input.value = '';
        return
    }

    cropQueue.value = await Promise.all(
        inputImages.map(async (image) => await toBase64(image))
    ) 
    
    // Pass the first image to the cropper
    pic.value = cropQueue.value[activeCropperIndex.value]!;
    

    // Open the cropper
    cropperModal.value?.showModal();
}

const cropImage = async function(){

    // Get the file from the cropper
    const file : File | null = await cropper!.getFile({
        fileName: generateRandomString(32),
    });

    // Resize the image and save in the array that will be passed to the parent component
    const resizedImage = await resizeWithPica(file!);
    croppedImages.value.push(resizedImage);    

    // If the cropper has no more images in queue
    // Close the cropper and send the cropped images to the parent component
    if(activeCropperIndex.value === cropQueue.value.length - 1){
        cropperModal.value?.close();
        emit('updateCroppedImages', croppedImages.value);
        activeCropperIndex.value = 0;
    }
    // Otherwise, show the next image to crop
    else{
        activeCropperIndex.value++;
        pic.value = cropQueue.value[activeCropperIndex.value]!;
    }
}

const removeThumbnail = function(index : number){
    emit('removePreview', index);
}
</script>

<template>
    <div> 
        <!-- Image Input and previews -->
        <div class="d-flex flex-wrap justify-content-center gap-16">
            <!-- Image input -->
            <label v-if="previews.length < maxImages" class="file-label" :class="{white : isWhite, error: isError}" for="images">
                <img v-if="isWhite" src="@/assets/icons/plus-fill-icon-white.svg" alt="">
                <img v-if="!isWhite" src="@/assets/icons/plus-fill-icon-gray.svg" alt="">
                <input @change="getImageData" id="images" type="file" name="images" accept="image/*" required multiple hidden>
            </label>
    
            <!-- Previews -->
            <div v-if="previewUrls.length > 0" v-for="(image, index) in previewUrls" :key="index" class="image-thumbnail">
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
                        dragMode: 'move',
                        aspectRatio: 1,
                        cropBoxResizable: false
                    }"
                    :presetMode="{
                        mode: 'fixedSize',
                        width: 300,
                        height: 300,
                    }"
                />
            </div>

            <div class="d-flex justify-content-center align-items-center">
                <button @click="cropImage" class="default-button m-t-8 m-b-8">Crop Image</button>
            </div>
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