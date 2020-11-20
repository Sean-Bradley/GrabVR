import * as THREE from '/build/three.module.js';
import StatsVR from '/statsvr';
import { VRButton } from '/jsm/webxr/VRButton';
import GrabVR from './grabvr.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
const grabVR = new GrabVR();
//grabable objects
//  cubes
for (var i = 0; i < 20; i++) {
    let grabable = new THREE.Mesh(new THREE.BoxBufferGeometry(1.0, 1.0, 1.0), new THREE.MeshBasicMaterial({
        color: 0xff0066,
        wireframe: true
    }));
    grabable.position.x = (Math.random() * 20) - 10;
    grabable.position.y = (Math.random() * 20) - 10;
    grabable.position.z = (Math.random() * 20) - 10;
    grabVR.grabableObjects().push(grabable);
    scene.add(grabable);
}
//  spheres
for (var i = 0; i < 20; i++) {
    let grabable = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 6), new THREE.MeshBasicMaterial({
        color: 0x0099ff,
        wireframe: true
    }));
    grabable.position.x = (Math.random() * 20) - 10;
    grabable.position.y = (Math.random() * 20) - 10;
    grabable.position.z = (Math.random() * 20) - 10;
    grabVR.grabableObjects().push(grabable);
    scene.add(grabable);
}
//  cones
for (var i = 0; i < 20; i++) {
    let grabable = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 1, 5), new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        wireframe: true
    }));
    grabable.position.x = (Math.random() * 20) - 10;
    grabable.position.y = (Math.random() * 20) - 10;
    grabable.position.z = (Math.random() * 20) - 10;
    grabVR.grabableObjects().push(grabable);
    scene.add(grabable);
}
const lefthand = new THREE.Mesh(new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true), new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    wireframe: true
}));
const controllerGrip0 = renderer.xr.getControllerGrip(0);
controllerGrip0.addEventListener("connected", (e) => {
    controllerGrip0.add(lefthand);
    grabVR.add(0, controllerGrip0, e.data.gamepad);
    scene.add(controllerGrip0);
});
// controllerGrip0.addEventListener('grabStart', function (event) {
//     console.log("in grabStart event handler")
// })
const righthand = new THREE.Mesh(new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true), new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    wireframe: true
}));
const controllerGrip1 = renderer.xr.getControllerGrip(1);
controllerGrip1.addEventListener("connected", (e) => {
    controllerGrip1.add(righthand);
    grabVR.add(1, controllerGrip1, e.data.gamepad);
    scene.add(controllerGrip1);
});
const statsVR = new StatsVR(camera);
statsVR.setX(0);
statsVR.setY(0);
statsVR.setZ(-2);
const clock = new THREE.Clock();
function render() {
    statsVR.update();
    grabVR.update(clock.getDelta());
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);
