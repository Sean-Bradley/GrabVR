import * as THREE from 'three'
import StatsVR from 'statsvr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import GrabVR from './grabvr'
import * as CANNON from 'cannon'
//import CannonDebugRenderer from './utils/cannonDebugRenderer'

const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.xr.enabled = true
document.body.appendChild(renderer.domElement)

document.body.appendChild(VRButton.createButton(renderer))

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
//world.broadphase = new CANNON.NaiveBroadphase()
//world.solver.iterations = 10
//world.allowSleep = true

const meshes: THREE.Mesh[] = []
const bodies: CANNON.Body[] = []

const grabVR = new GrabVR()
grabVR.addEventListener("grabStart", (id: number) => { console.log("grabStart " + id) })
grabVR.addEventListener("grabEnd", (id: number) => { console.log("grabEnd " + id) })
grabVR.addEventListener("grabMove", (id: number) => { console.log("grabMove " + id) })


//floor
const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(25, 25, 10, 10)
const planeMesh: THREE.Mesh = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({
    color: 0x008800,
    wireframe: true
}))
planeMesh.rotateX(-Math.PI / 2)
scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)


//  cubes
for (var i = 0; i < 20; i++) {
    const grabable = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1.0, 1.0, 1.0),
        new THREE.MeshBasicMaterial({
            color: 0xff0066,
            wireframe: true
        })
    )
    grabable.position.x = (Math.random() * 20) - 10
    grabable.position.y = (Math.random() * 20) + 2
    grabable.position.z = (Math.random() * 20) - 10
    grabable.userData.isGrabbed = false

    grabVR.grabableObjects().push(grabable);

    scene.add(grabable);

    const cubeShape = new CANNON.Box(new CANNON.Vec3(.5, .5, .5))
    const cubeBody = new CANNON.Body({ mass: 1 });
    cubeBody.addShape(cubeShape)
    cubeBody.position.x = grabable.position.x
    cubeBody.position.y = grabable.position.y
    cubeBody.position.z = grabable.position.z
    world.addBody(cubeBody)

    meshes.push(grabable)
    bodies.push(cubeBody)
}
//  spheres
for (var i = 0; i < 20; i++) {
    const grabable = new THREE.Mesh(
        new THREE.SphereGeometry(.5, 6, 6),
        new THREE.MeshBasicMaterial({
            color: 0x0099ff,
            wireframe: true
        })
    )
    grabable.position.x = (Math.random() * 20) - 10
    grabable.position.y = (Math.random() * 20) + 2
    grabable.position.z = (Math.random() * 20) - 10
    grabable.userData.isGrabbed = false

    grabVR.grabableObjects().push(grabable);

    scene.add(grabable);

    const sphereShape = new CANNON.Sphere(.5)
    const sphereBody = new CANNON.Body({ mass: 1 });
    sphereBody.addShape(sphereShape)
    sphereBody.position.x = grabable.position.x
    sphereBody.position.y = grabable.position.y
    sphereBody.position.z = grabable.position.z
    world.addBody(sphereBody)

    meshes.push(grabable)
    bodies.push(sphereBody)
}
//  cones
for (var i = 0; i < 20; i++) {
    const grabable = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 1, 1, 5),
        new THREE.MeshBasicMaterial({
            color: 0xffcc00,
            wireframe: true
        })
    )
    grabable.position.x = (Math.random() * 20) - 10
    grabable.position.y = (Math.random() * 20) + 2
    grabable.position.z = (Math.random() * 20) - 10
    grabable.userData.isGrabbed = false

    grabVR.grabableObjects().push(grabable);

    scene.add(grabable);

    const cylinderShape = new CANNON.Cylinder(.01, 1, 1, 5)
    const cylinderBody = new CANNON.Body({ mass: 1 });
    const cylinderQuaternion = new CANNON.Quaternion()
    cylinderQuaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    cylinderBody.addShape(cylinderShape, new CANNON.Vec3, cylinderQuaternion)
    cylinderBody.position.x = grabable.position.x
    cylinderBody.position.y = grabable.position.y
    cylinderBody.position.z = grabable.position.z
    world.addBody(cylinderBody)

    meshes.push(grabable)
    bodies.push(cylinderBody)
}

const lefthand = new THREE.Mesh(
    new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true),
    new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true
    })
)

const controllerGrip0 = renderer.xr.getControllerGrip(0)
controllerGrip0.addEventListener('connected', (e: any) => {
    controllerGrip0.add(lefthand)
    grabVR.add(0, controllerGrip0, e.data.gamepad)
    scene.add(controllerGrip0)
})

const righthand = new THREE.Mesh(
    new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true),
    new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true
    })
)
const controllerGrip1 = renderer.xr.getControllerGrip(1)
controllerGrip1.addEventListener('connected', (e: any) => {
    controllerGrip1.add(righthand)
    grabVR.add(1, controllerGrip1, e.data.gamepad)
    scene.add(controllerGrip1)
})

const statsVR = new StatsVR(scene, camera)
statsVR.setX(0)
statsVR.setY(0)
statsVR.setZ(-2)

const clock: THREE.Clock = new THREE.Clock()

//const cannonDebugRenderer = new CannonDebugRenderer(scene, world)

function render() {

    statsVR.update()

    let delta = clock.getDelta()
    if (delta > .01) delta = .01
    world.step(delta)
    //cannonDebugRenderer.update()


    meshes.forEach((m, i) => {
        if (!m.userData.isGrabbed) {
            m.position.set(bodies[i].position.x, bodies[i].position.y, bodies[i].position.z)
            m.quaternion.set(bodies[i].quaternion.x, bodies[i].quaternion.y, bodies[i].quaternion.z, bodies[i].quaternion.w)
        } else {
            bodies[i].position.x = m.position.x
            bodies[i].position.y = m.position.y
            bodies[i].position.z = m.position.z
            bodies[i].quaternion.x = m.quaternion.x
            bodies[i].quaternion.y = m.quaternion.y
            bodies[i].quaternion.z = m.quaternion.z
            bodies[i].quaternion.w = m.quaternion.w
            bodies[i].velocity.set(0, 0, 0);
            bodies[i].angularVelocity.set(0, 0, 0);
        }
    })

    grabVR.update(delta)

    renderer.render(scene, camera)

}

renderer.setAnimationLoop(render)