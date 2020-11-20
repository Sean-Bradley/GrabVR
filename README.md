# GrabVR

A module for grabbing objects in WebVR Three.js projects

You can download the project and view the examples.

```bash
git clone https://github.com/Sean-Bradley/GrabVR.git
cd GrabVR
npm install
npm run dev
```

Visit http://127.0.0.1:3000/

This is a typescript project consisting of two sub projects with there own *tsconfigs*.

To edit this example, then modify the files in `./src/client/` or `./src/server/`

The projects will auto recompile if you started it by using *npm run dev*

or

You can simply just import the generated `./dist/client/grabvr.js` directly into your own project as a module.

```javascript
<script type="module" src="./grabvr.js"></script>
```

or as ES6 import

```javascript
import GrabVR from './grabvr.js'
```

## Example 1

Basic GrabVR demo.

[![GrabVR Example 1](./dist/client/img/grabvr-1.gif)](https://sbcode.net/threejs/grabvr-1/)

## Example 2

GrabVR demo using Cannonjs.

[![GrabVR Example 2](./dist/client/img/grabvr-2.gif)](https://sbcode.net/threejs/grabvr-2/)


