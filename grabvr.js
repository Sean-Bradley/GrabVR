(function (global, factory) {

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.GrabVR = factory());

}(this, (function () {
    'use strict';

    /**
     * @author Sean Bradley /
     * https://www.youtube.com/user/seanwasere
     * https://github.com/Sean-Bradley
     * https://seanwasere.com/
     */

    var GrabVR = (function (scene) {
        var controllers = [];
        var _grabableDistance = 10;
        var _grabableObjects = [];
        var direction = new THREE.Vector3(0, 0, -1);

        return {
            add: function (o) {
                o.grabVR = {
                    raycaster: new THREE.Raycaster(),
                    quaternion: new THREE.Quaternion(),
                    line: new THREE.Object3D(),
                    grabbedObject: null,
                    hasAGrabbedObject: false,
                    grabberHookPoint: new THREE.Object3D(),
                    releaseObject: false,
                    //lastPosition: new THREE.Vector3(0, 0, 0),
                    //lastQuaternion: new THREE.Quaternion(),
                    //velocity: new THREE.Vector3(0, 0, 0),
                    //quaternionDifference: new THREE.Vector4(0, 0, 0, 0)
                };
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 0, 0));
                geometry.vertices.push(new THREE.Vector3(0, 0, -100));
                o.grabVR.line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }));
                o.add(o.grabVR.line);
                controllers.push(o);

                var controllerMesh = new Physijs.BoxMesh(
                    //new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true),
                    new THREE.CubeGeometry(.1, .1, .5),
                    new THREE.MeshStandardMaterial({
                        color: 0x00ff88,
                        wireframe: true
                    }),
                    1
                );

                //controllerMesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
                //    console.log("abc");
                //this.grabbedObjectHeld = true;
                //});
                scene.add(controllerMesh);
                o.grabVR.mesh = controllerMesh;

                var grabberPlaceHolder = new THREE.Mesh(
                    //new THREE.CubeGeometry(.1, .1, 5),
                    new THREE.SphereBufferGeometry(.1, 5, 5),
                    new THREE.MeshStandardMaterial({
                        color: 0x00ff00,
                        wireframe: true
                    })
                );
                scene.add(grabberPlaceHolder);
                // grabberPlaceHolder.visible = false;
                o.grabVR.grabberHookPoint = grabberPlaceHolder;

            },
            grabableObjects: _grabableObjects,
            grabableDistance: _grabableDistance,
            grab: function (c) {
                var intersects = c.grabVR.raycaster.intersectObjects(_grabableObjects);
                if (intersects.length > 0) {
                    c.grabVR.grabberHookPoint.matrix.copy(intersects[0].object.matrixWorld);
                    c.grabVR.grabberHookPoint.applyMatrix(new THREE.Matrix4().getInverse(c.matrixWorld));
                    c.add(c.grabVR.grabberHookPoint);

                    c.grabVR.grabbedObject = intersects[0].object;

                    //console.dir(intersects[0]);
                    // c.grabVR.grabberPlaceHolder.position.x = intersects[0].point.x;
                    // c.grabVR.grabberPlaceHolder.position.y = intersects[0].point.y;
                    // c.grabVR.grabberPlaceHolder.position.z = intersects[0].point.z;
                    c.grabVR.grabberHookPoint.visible = true;
                    c.grabVR.hasAGrabbedObject = true;

                }
            },
            release: function (c) {
                if (c.grabVR.hasAGrabbedObject) {
                    c.grabVR.hasAGrabbedObject = false;
                    c.grabVR.releaseObject = true;
                    //console.dir(c.grabVR.grabbedObject);                    
                    //c.grabVR.grabbedObject.matrix.copy(c.grabVR.grabbedObject.matrixWorld);
                    // c.grabVR.grabbedObject.applyMatrix(new THREE.Matrix4().getInverse(scene.matrixWorld));
                    //scene.add(c.grabVR.grabbedObject);
                    //c.grabVR.grabbedObject.__dirtyRotation = true;
                    //c.grabVR.grabbedObject.__dirtyPosition = true;
                    //c.grabVR.grabbedObject.setAngularVelocity(new THREE.Euler().setFromQuaternion(c.grabVR.lastQuaternion.normalize()));
                    //c.grabVR.grabbedObject.setLinearVelocity(c.grabVR.velocity.multiplyScalar(100));
                    //c.grabVR.grabbedObjectHeld = false;
                    //var tmp = c.grabVR.grabbedObject;
                    //c.grabVR.grabbedObject = null;

                    // setTimeout(function () {
                    //     var vec = new THREE.Vector3();
                    //     c.grabVR.grabberHookPoint.getWorldPosition(vec);
                    //     c.grabVR.grabbedObject.applyCentralImpulse(c.grabVR.grabbedObject.worldToLocal(vec));
                    //     //c.grabVR.grabbedObject.__dirtyPosition = true;
                    //     //c.grabVR.grabbedObject.__dirtyRotation = true;
                    // }, 10);

                    c.grabVR.grabberHookPoint.visible = false;
                }
            },
            update: function (dt) {
                controllers.forEach(function (controller) {
                    controller.getWorldPosition(controller.grabVR.raycaster.ray.origin);

                    controller.getWorldQuaternion(controller.grabVR.quaternion);
                    controller.grabVR.raycaster.ray.direction.copy(direction).applyEuler(new THREE.Euler().setFromQuaternion(controller.grabVR.quaternion, "XYZ"));


                    var intersects = controller.grabVR.raycaster.intersectObjects(_grabableObjects);
                    if (intersects.length > 0) {
                        controller.grabVR.line.visible = true;
                    } else {
                        controller.grabVR.line.visible = false;
                    }

                    if (controller.grabVR.hasAGrabbedObject) {
                        // if (controller.grabVR.releaseObject) {
                        //     controller.grabVR.releaseObject = false;
                        //     controller.grabVR.hasAGrabbedObject = false;
                        //     //controller.grabVR.grabbedObject.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                        //     var vec = new THREE.Vector3();
                        //     controller.grabVR.grabberHookPoint.getWorldPosition(vec);
                        //     //controller.grabVR.grabbedObject.applyCentralImpulse(controller.grabVR.grabbedObject.worldToLocal(vec));
                        //     controller.grabVR.grabbedObject.applyCentralForce(controller.grabVR.grabbedObject.worldToLocal(vec));
                        // } else {
                        //     controller.grabVR.grabbedObject.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                        //     controller.grabVR.grabberHookPoint.getWorldPosition(controller.grabVR.grabbedObject.position);

                        //### for sliding object towards controller
                        var vec = new THREE.Vector3();
                        controller.getWorldPosition(vec);
                        controller.grabVR.grabberHookPoint.lookAt(controller.grabVR.mesh.worldToLocal(vec));
                        //### end for sliding object towards controller


                        //     controller.grabVR.grabbedObject.__dirtyPosition = true;
                        //     controller.grabVR.grabbedObject.__dirtyRotation = true;
                        // }
                        //controller.grabVR.grabberHookPoint.position.copy(intersects[0].point);
                        //controller.grabVR.grabbedObject.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                        var vec = new THREE.Vector3();
                        controller.grabVR.grabberHookPoint.getWorldPosition(vec);
                        vec = controller.grabVR.grabbedObject.worldToLocal(vec).multiplyScalar(4);
                        vec.applyEuler(controller.grabVR.grabbedObject.rotation);
                        controller.grabVR.grabbedObject.setLinearVelocity(vec);
                        //controller.grabVR.grabbedObject.__dirtyPosition = true;
                        //controller.grabVR.grabbedObject.__dirtyRotation = true;
                        //controller.grabVR.grabbedObject.setLinearVelocity (controller.grabVR.grabbedObject.worldToLocal(vec).multiplyScalar(3));

                        //controller.grabVR.grabbedObject.applyImpulse(controller.grabVR.grabbedObject.worldToLocal(vec), controller.grabVR.grabbedObject.getAngularVelocity());
                        //controller.grabVR.grabbedObject.applyCentralForce(controller.grabVR.grabbedObject.worldToLocal(vec));
                        //controller.grabVR.grabbedObject.setLinearVelocity(controller.grabVR.grabbedObject.worldToLocal(vec));
                        //controller.grabVR.grabbedObject.applyTorque  (controller.grabVR.grabbedObject.worldToLocal(vec));

                        //controller.grabVR.grabbedObject.setLinearVelocity();
                        //'applyCentralImpulse'



                        //controller.grabVR.lastPosition.copy(controller.grabVR.grabbedObject.position);
                        //scene.add(c.grabVR.grabbedObject);
                    }
                    //if (controller.grabVR.grabbedObject) {

                    //if (controller.grabVR.grabbedObject.position.z < -0.75) {
                    //if (!controller.grabVR.mesh.grabbedObjectHeld) {
                    //controller.grabVR.grabbedObject.position.z += 20 * dt;
                    //}//else{
                    //controller.grabVR.grabbedObjectHeld = true;
                    //}
                    //if (controller.grabVR.grabbedObject.position.z < -0.75) {
                    //controller.grabVR.grabbedObject.position.z += Math.abs(controller.grabVR.grabbedObject.position.z / 2);
                    //   controller.grabVR.grabbedObject.applyCentralForce(new THREE.Vector3(0, 0, 1));
                    //}
                    // var objectPosition = new THREE.Vector3();
                    // controller.grabVR.grabbedObject.getWorldPosition(objectPosition);
                    // controller.grabVR.velocity.subVectors(objectPosition, controller.grabVR.lastPosition);
                    //controller.grabVR.lastPosition.copy(objectPosition);

                    // var objectQuaternion = new THREE.Quaternion();
                    // controller.grabVR.grabbedObject.getWorldQuaternion(objectQuaternion);
                    // controller.grabVR.quaternionDifference.subVectors(objectQuaternion, controller.grabVR.lastQuaternion);
                    //controller.grabVR.lastQuaternion.copy(objectQuaternion);

                    //}

                    controller.grabVR.mesh.position.copy(controller.grabVR.raycaster.ray.origin);
                    controller.grabVR.mesh.__dirtyPosition = true;
                    //controller.grabVR.mesh.quaternion.copy(controller.grabVR.quaternion);
                    //controller.grabVR.mesh.rotation.copy(controller.rotation);
                    controller.grabVR.mesh.rotation.copy(new THREE.Euler().setFromQuaternion(controller.grabVR.quaternion, "XYZ"));
                    controller.grabVR.mesh.__dirtyRotation = true;
                });
            }
        }
    })

    return GrabVR;
})));