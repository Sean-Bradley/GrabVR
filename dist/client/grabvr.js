//MIT License
//Copyright (c) 2020 Sean Bradley
//https://github.com/Sean-Bradley/GrabVR/blob/master/LICENSE
import * as THREE from '/build/three.module.js';
export default class GrabVR {
    constructor() {
        this._controller = {};
        this._raycaster = {};
        this._quaternion = {};
        this._grabbedObject = {};
        this._hasAGrabbedObject = {};
        this._line = {};
        this._grabberHook = {};
        this._gamepad = {};
        this._grabableObjects = [];
        this._direction = new THREE.Vector3(0, -1, 0);
        this._eventListeners = new Array();
    }
    grabableObjects() {
        return this._grabableObjects;
    }
    add(id, o, gamepad) {
        this._controller[id] = o;
        this._raycaster[id] = new THREE.Raycaster();
        this._quaternion[id] = new THREE.Quaternion();
        this._gamepad[id] = gamepad;
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, -100, 0));
        this._line[id] = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x8888ff }));
        this._line[id].visible = false;
        o.add(this._line[id]);
        this._grabberHook[id] = new THREE.Mesh(new THREE.SphereBufferGeometry(.1, 6, 6), new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: false,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            opacity: 0.5
        }));
        o.add(this._grabberHook[id]);
        this._grabberHook[id].visible = false;
    }
    update(dt) {
        for (let key in Object.keys(this._controller)) {
            this._controller[key].getWorldPosition(this._raycaster[key].ray.origin);
            this._controller[key].getWorldQuaternion(this._quaternion[key]);
            this._raycaster[key].ray.direction.copy(this._direction).applyEuler(new THREE.Euler().setFromQuaternion(this._quaternion[key], "XYZ"));
            let intersects = this._raycaster[key].intersectObjects(this._grabableObjects);
            if (intersects.length > 0) {
                this._line[key].visible = true;
                if (this._gamepad[key].buttons[1].pressed) {
                    if (!this._hasAGrabbedObject[key]) {
                        this._grabberHook[key].position.copy(this._controller[key].worldToLocal(intersects[0].object.position));
                        this._grabbedObject[key] = intersects[0].object;
                        this._grabbedObject[key].userData.isGrabbed = true;
                        this._grabberHook[key].visible = true;
                        this._hasAGrabbedObject[key] = true;
                        this.dispatchEvent("grabStart", Number(key));
                    }
                    if (this._gamepad[key].axes[3] > 0.25) {
                        if (this._grabberHook[key].position.y <= -1) {
                            this._grabberHook[key].translateY(this._gamepad[key].axes[3] * dt * 10);
                        }
                    }
                    else {
                        this._grabberHook[key].translateY(this._gamepad[key].axes[3] * dt * 10);
                    }
                    this.dispatchEvent("grabMove", Number(key));
                }
            }
            else {
                this._line[key].visible = false;
            }
            if (!this._gamepad[key].buttons[1].pressed) {
                if (this._hasAGrabbedObject[key]) {
                    if (this._hasAGrabbedObject[key]) {
                        this._hasAGrabbedObject[key] = false;
                        this._grabberHook[key].visible = false;
                        this._grabbedObject[key].userData.isGrabbed = false;
                        this.dispatchEvent("grabEnd", Number(key));
                    }
                }
            }
            if (this._hasAGrabbedObject[key]) {
                this._grabberHook[key].getWorldPosition(this._grabbedObject[key].position);
            }
        }
    }
    addEventListener(type, eventHandler) {
        const listener = { type: type, eventHandler: eventHandler };
        this._eventListeners.push(listener);
    }
    dispatchEvent(type, id) {
        for (let i = 0; i < this._eventListeners.length; i++) {
            if (type === this._eventListeners[i].type) {
                this._eventListeners[i].eventHandler(id);
            }
        }
    }
}
