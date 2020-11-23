import * as THREE from '/build/three.module.js';
export default class GrabVR {
    private _controller;
    private _raycaster;
    private _quaternion;
    private _grabbedObject;
    private _hasAGrabbedObject;
    private _line;
    private _grabberHook;
    private _gamepad;
    private _grabableObjects;
    private _direction;
    private _eventListeners;
    constructor();
    grabableObjects(): THREE.Object3D[];
    add(id: number, o: THREE.Object3D, gamepad: Gamepad): void;
    update(dt: number): void;
    addEventListener(type: string, eventHandler: any): void;
    dispatchEvent(type: string, id: number): void;
}
