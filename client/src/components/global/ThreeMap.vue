<script lang="ts" setup>
import * as THREE from 'three';
import type { Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { onBeforeUnmount } from 'vue';
import Loader from './Loader.vue';
import { useStore } from 'vuex';
import { defaultCameraPositions, moveCameraXYZ } from '@/utils/threejs';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
import getStarfield from '@/utils/threejs';
import { ref } from 'vue';

const isModalOpen = ref<boolean>(false);
const selectedContinent = ref<string>('');
const selectedPath = ref<string>('');


const handleModal = function(openModal: boolean){
    isModalOpen.value = openModal;
}

const store = useStore();
store.commit('setLoadingState', true);

// Create scene and give it a black background
// Change BG to stars
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); 

// Create camera, the renderer and render the scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
// Get the last saved position from sessionStorage (is set before the component unMount) or set a default position
const cameraPosition = JSON.parse(sessionStorage.getItem('camera_position') || '{"x": 0, "y": 3, "z": 1}');

camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// Enable controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;    // <- smooth rotation

// Ambient soft light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 10);
scene.add(ambientLight);


// Directional light that points to the screen
// const directionalLight = new THREE.DirectionalLight(0x0000FF, 3);
// directionalLight.position.set(-5, 5, -3);
// scene.add(directionalLight);

// Globe shape and material (water with shininess and reflection)
const RADIUS = 1.025;
const sphereGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);

// -- ADD THIS SPHERE AS OCEAN
const sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({
    color: 0x0E376F,
}));
scene.add(sphere);

// Load continents 3d model and assign a material to all the meshes
const loader = new GLTFLoader();
loader.load('/models/world-continents-with-text.glb', function(gltf) {
    gltf.scene.traverse( child => {
        
        if((child as Mesh).isMesh){


            if(child.name.includes('_text')){
                (child as Mesh).material = new THREE.MeshBasicMaterial({ color: 0x0E376F});
            }else{
                (child as Mesh).material = new THREE.MeshStandardMaterial({
                    color: 0xffffff
                });
            }
        }
    });

    scene.add(gltf.scene);

}, undefined, function(error){
    console.error(error)
});

const stars = getStarfield({ numStars: 1000});
scene.add(stars);

// Create raycaster and mouse entity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
document.addEventListener( 'click', onMouseClick );

function onMouseClick( event: any ) { 
    if(isModalOpen.value) return   

    selectedContinent.value = '';
    selectedPath.value = '';
    
    // Convert to normalized device coordinates (-1 to +1) (don't know why, but the docs say to do this)
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    raycaster.setFromCamera( mouse, camera );

    let intersects = [];

    intersects = raycaster.intersectObjects( scene.children, true );    

    if(intersects.length > 0){
        switch (intersects[0]!.object.name) {
            case 'Europe':
            case 'europe_text':
                selectedContinent.value = 'Europe';
                selectedPath.value = 'europe';
                moveCameraXYZ(camera, defaultCameraPositions.europe);
                break;
            case 'Africa': 
            case 'africa_text':
                selectedContinent.value = 'Africa';
                selectedPath.value = 'africa';
                moveCameraXYZ(camera, defaultCameraPositions.africa);
                break;
            case 'Asia': 
            case 'asia_text':
                selectedContinent.value = 'Asia';
                selectedPath.value = 'asia';
                moveCameraXYZ(camera, defaultCameraPositions.asia);
                break;
            case 'Oceania':
            case 'oceania_text':
                selectedContinent.value = 'Oceania';
                selectedPath.value = 'oceania';
                moveCameraXYZ(camera, defaultCameraPositions.oceania);
                break;
            case 'North_and_Central_America': 
            case 'north_central_america_text':
                selectedContinent.value = 'North and Central America';
                selectedPath.value = 'north-central-america';
                moveCameraXYZ(camera, defaultCameraPositions.northCentralAmerica);
                break;
            case 'South_America': 
            case 'south_america_text':
                selectedContinent.value = 'South America';
                selectedPath.value = 'south-america';
                moveCameraXYZ(camera, defaultCameraPositions.southAmerica);
                break;
    
            default:
                break;
        }
    }

    if(selectedContinent.value.length > 0 && selectedPath.value.length > 0) handleModal(true);
        
}

function animate(){
    controls.update();
    renderer.render( scene, camera );
    TWEEN.update(); // updates ongoing tweens
    requestAnimationFrame(animate);
}
animate();
store.commit('setLoadingState', false);


// Dispose scene before leaving the page
onBeforeUnmount(() => {

    const lastCameraPosition = controls.object.position;
    sessionStorage.setItem('camera_position', JSON.stringify(lastCameraPosition));

    window.removeEventListener('click', onMouseClick);
    scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material;

        if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose());
        } else {
            if (material && material.isMaterial) material.dispose();
        }
    });

    while (scene.children.length > 0) {
        scene.remove(scene.children[0]!);
    }

    renderer.dispose();

    
    renderer.domElement.remove();
});



</script>


<template>
    <div v-if="isModalOpen" class="continent-overlay d-flex justify-content-center align-items-end">
        <div class="d-flex justify-content-center gap-16 m-b-40 p-16">
            <button @click="handleModal(false)" class="common-button ghost-button">Cancel</button>
            <router-link :to="`/continents/${selectedPath}`">
                <button class="common-button">View posts for <div style="display: inline-block;">{{ selectedContinent }}</div></button>
            </router-link>
        </div>
    </div>

    <Loader v-if="store.state.isLoading" />
</template>

<style scoped>
.continent-overlay{
    height: calc(100dvh - 80px);
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    position: fixed;
    z-index: 80;
}
</style>

