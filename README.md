# GrabVR

A module for grabbing objects in WebVR Three.js projects

You can download the project and view the examples.

``` bash
git clone https://github.com/Sean-Bradley/GrabVR.git
cd GrabVR
npm install
npm run dev
```

Visit http://127.0.0.1:3000/

## How to import GrabVR

```bash
npm install grabvr
```

Import into your code

``` javascript
import ButtonVR from 'buttonvr'
```

## Instantiate And Use

Create a GrabVR object.

```javascript
const grabVR = new GrabVR()
```

Create some Object3Ds and add then to the GrabVR grabables.

```javascript
let grabable = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1.0, 1.0, 1.0),
    new THREE.MeshBasicMaterial({
        color: 0xff0066,
        wireframe: true
    })
)
scene.add(grabable)
grabVR.grabableObjects().push(grabable);
```

Add VR your controllers to the scene (see example code for better understanding)

```javascript
const controllerGrip0 = renderer.xr.getControllerGrip(0)
controllerGrip0.addEventListener("connected", (e: any) => {
    controllerGrip0.add(lefthand)
    grabVR.add(0, controllerGrip0, e.data.gamepad)
    scene.add(controllerGrip0)
})
```

Update in the render loop.

```javascript
grabVR.update(clock.getDelta());
renderer.render(scene, camera)
```

## Example 1

Basic GrabVR demo.

[![GrabVR Example 1](./dist/client/img/grabvr-1.gif)](https://sbcode.net/threejs/grabvr-1/)

## Example 2

GrabVR demo using Cannonjs.

[![GrabVR Example 2](./dist/client/img/grabvr-2.gif)](https://sbcode.net/threejs/grabvr-2/)

## GrabVR Source Project

This is a typescript project consisting of two sub projects with there own *tsconfigs*.

To edit this example, then modify the files in `./src/client/` or `./src/server/`

The projects will auto recompile if you started it by using *npm run dev*

## Threejs TypeScript Course

Visit https://github.com/Sean-Bradley/Three.js-TypeScript-Boilerplate for a Threejs TypeScript boilerplate containing many extra branches that demonstrate many examples of Threejs.

> To help support this Threejs example, please take a moment to look at my official Threejs TypeScript course at 

[![Threejs TypeScript Course](threejs-course-image.png)](https://www.udemy.com/course/threejs-tutorials/?referralCode=4C7E1DE91C3E42F69D0F)

  [Three.js and TypeScript](https://www.udemy.com/course/threejs-tutorials/?referralCode=4C7E1DE91C3E42F69D0F)<br/>  
  Discount Coupons for all my courses can be found at [https://sbcode.net/coupons](https://sbcode.net/coupons)
