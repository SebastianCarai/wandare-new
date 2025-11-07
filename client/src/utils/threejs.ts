import * as THREE from 'three';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';


export type CameraPosition = {
    x: number,
    y: number,
    z: number
}


export const defaultCameraPositions = {
    europe: {
        x : 1.2834614248702283,
        y : 1.395625064803742,
        z : -0.2575416325899698
    },
    northCentralAmerica: {
        x : -0.21994787699537016,
        y : 1.3979750095955654,
        z : 1.557114756512616
    },
    southAmerica: {
        x: 1.0251369158387855,
        y: -0.49826384151002856,
        z: 1.7686562721529668
    },
    africa: {
        x: 2.256997799765468,
        y: 0.22830463967979803,
        z: -0.7571898452285813
    },
    asia: {
        x: 0.1788866167978929,
        y: 1.310612011432457,
        z: -1.9924342579323244
    },
    oceania: {
        x: -1.8103159776138438,
        y: -0.7934158618478292,
        z: -1.3463825124113387
    }
}

export function moveCameraXYZ(camera: THREE.PerspectiveCamera, position: CameraPosition, duration = 500) {
  new TWEEN.Tween(camera.position)
    .to({ x: position.x, y: position.y, z: position.z }, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

export default function getStarfield({ numStars = 500 } = {}) {
    function randomSpherePoint() {
        const radius = Math.random() * 25 + 25;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.sin(phi) * Math.sin(theta);
        let z = radius * Math.cos(phi);

        return {
            pos: new THREE.Vector3(x, y, z),
            hue: 0.6, // radius * 0.02 + 0.5
            minDist: radius,
            };
    }
    
    const verts = [];
    const colors = [];
    const positions = [];
    let col;
    for (let i = 0; i < numStars; i += 1) {
        let p = randomSpherePoint();
        const { pos, hue } = p;
        positions.push(p);
        col = new THREE.Color().setHSL(hue, 0.2, Math.random());
        verts.push(pos.x, pos.y, pos.z);
        colors.push(col.r, col.g, col.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        fog: false,
        // map: sprite,
    });
    const points = new THREE.Points(geo, mat);
    return points;
}