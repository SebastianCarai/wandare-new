<script setup>
import axios from 'axios';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useRouter } from 'vue-router';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import Loader from './Loader.vue';
import { useStore } from 'vuex';
import { defaultCameraPositions, moveCameraXYZ } from '@/utils/threejs';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
import getStarfield from '@/utils/threejs';

const store = useStore();
store.commit('setLoadingState', true);

const emit = defineEmits(["showContinentsConfirmModal"]);

const router = useRouter();

// Create scene and give it a black background
// Change BG to stars
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); 

// Create camera, the renderer and render the scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
// Get the last saved position from sessionStorage (is set before the component unMount) or set a default position
const cameraPosition = JSON.parse(sessionStorage.getItem('camera_position')) || {x: 0, y: 3, z: 1};
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// Enable controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;    // <- smooth rotation

// Ambient soft light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
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
    color: 0x0077ff,
}));
scene.add(sphere);

// Load continents 3d model and assign a material to all the meshes
const loader = new GLTFLoader();
loader.load('/models/world-continents-with-text.glb', function(gltf) {
    gltf.scene.traverse(child => {
        
        if(child.isMesh){


            if(child.name.includes('_text')){
                child.material = new THREE.MeshBasicMaterial({ color: 0x0E376F});
            }else{
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xececec,
                });
            }
        }
    });

    scene.add(gltf.scene)

}, undefined, function(error){
    console.error(error)
});

const stars = getStarfield({ numStars: 1000, fog: false });
scene.add(stars);

// Create raycaster and mouse entity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
document.addEventListener( 'click', onMouseClick );

function onMouseClick( event ) {
    // Convert to normalized device coordinates (-1 to +1) (don't know why, but the docs say to do this)
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    raycaster.setFromCamera( mouse, camera );

    let intersects = [];

    intersects = raycaster.intersectObjects( scene.children, true );    

        
    if(intersects.length > 0){

        if(intersects[0].object.name === 'Europe' || intersects[0].object.name === 'europe_text'){
            moveCameraXYZ(camera, defaultCameraPositions.europe);
        }else if (intersects[0].object.name === 'Africa' || intersects[0].object.name === 'africa_text'){
            moveCameraXYZ(camera, defaultCameraPositions.africa);
        }else if (intersects[0].object.name === 'Asia' || intersects[0].object.name === 'asia_text'){
            moveCameraXYZ(camera, defaultCameraPositions.asia);
        }else if (intersects[0].object.name === 'Oceania' || intersects[0].object.name === 'oceania_text'){
            moveCameraXYZ(camera, defaultCameraPositions.oceania);
        }else if (intersects[0].object.name === 'North_and_Central_America' || intersects[0].object.name === 'north_central_america_text'){
            moveCameraXYZ(camera, defaultCameraPositions.northCentralAmerica);
        }else if (intersects[0].object.name === 'South_America' || intersects[0].object.name === 'south_text'){
            moveCameraXYZ(camera, defaultCameraPositions.southAmerica);
        }
        
        
        // router.push({ path: `/continents/${intersects[0].object.name}`});
        return
    }
        
}

function animate(){
    controls.update();
    renderer.render( scene, camera );
    TWEEN.update(); // updates ongoing tweens
    requestAnimationFrame(animate);
}
animate();
store.commit('setLoadingState', false);


onBeforeUnmount(() => {

    const lastCameraPosition = controls.object.position;
    sessionStorage.setItem('camera_position', JSON.stringify(lastCameraPosition));

    function cleanMaterial(material) {
        material.dispose();

        // If the material uses textures, dispose of them too
        for (const key in material) {
            const value = material[key];
            if (value && typeof value === 'object' && 'minFilter' in value) {
                value.dispose();
            }
        }
    }

    // cancelAnimationFrame(animationId);

    window.removeEventListener('click', onMouseClick);
    scene.traverse((child) => {
        if (child.isMesh) {
            child.geometry.dispose();
            if (child.material.isMaterial) child.material.dispose();
        }
    });

    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    renderer.dispose();

    
    renderer.domElement.remove();
    console.log('Scene children count:', scene.children.length);
})



</script>


<template>
    <Loader v-if="store.state.isLoading" />
</template>


<style scoped>
</style>
