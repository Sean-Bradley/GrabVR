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

    var GrabVR = (function (scene, usePhysijs) {
        var controllers = [];
        var _grabableDistance = 10;
        var _grabableObjects = [];
        var direction = new THREE.Vector3(0, 0, -1);
        
        var _usePhysijs = false;
        if (!!usePhysijs) {
            _usePhysijs = usePhysijs;
            console.log("usePhysijs = " + _usePhysijs);
        }
        

        return {
            add: function (o) {                
                o.grabVR = {
                    raycaster: new THREE.Raycaster(),
                    quaternion: new THREE.Quaternion(),
                    grabbedObject: null,
                    hasAGrabbedObject: false,
                    mesh: new THREE.Object3D(),
                    line: new THREE.Object3D(),
                    grabberHook: new THREE.Object3D()
                };


                var controllerMesh;
                if (_usePhysijs) {
                    controllerMesh = new Physijs.BoxMesh(
                        //new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true),
                        new THREE.CubeGeometry(.1, .1, .5),
                        new THREE.MeshStandardMaterial({
                            color: 0x00ff88,
                            wireframe: true
                        }),
                        .1
                    );
                } else {
                    controllerMesh = new THREE.Mesh(
                        //new THREE.CylinderGeometry(.05, 0.05, .4, 16, 1, true),
                        new THREE.CubeGeometry(.1, .1, .5),
                        new THREE.MeshStandardMaterial({
                            color: 0x00ff88,
                            wireframe: true
                        })
                    );
                }
                scene.add(controllerMesh);
                o.grabVR.mesh = controllerMesh;

                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 0, 0));
                geometry.vertices.push(new THREE.Vector3(0, 0, -100));
                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x8888ff }));
                line.visible = false;
                controllerMesh.add(line);
                o.grabVR.line = line;

                var grabberHook = new THREE.Mesh(
                    //new THREE.CubeGeometry(.1, .1, 50),
                    new THREE.SphereBufferGeometry(.1, 6, 6),
                    new THREE.MeshStandardMaterial({
                        color: 0x00ff00,
                        wireframe: false,
                        depthTest: false,
                        depthWrite: false,
                        transparent: true,
                        opacity: 0.5
                    })
                );
                var grabberHook
                scene.add(grabberHook);
                grabberHook.visible = false;
                o.grabVR.grabberHook = grabberHook;

                controllers.push(o);
            },
            grabableObjects: _grabableObjects,
            grabableDistance: _grabableDistance,
            grab: function (c) {
                var intersects = c.grabVR.raycaster.intersectObjects(_grabableObjects);
                if (intersects.length > 0) {
                    c.grabVR.grabberHook.matrix.copy(intersects[0].object.matrixWorld);
                    c.grabVR.grabberHook.applyMatrix(new THREE.Matrix4().getInverse(c.matrixWorld));
                    c.grabVR.mesh.add(c.grabVR.grabberHook);

                    //c.grabVR.mesh.add(c.grabVR.tmpMesh);
                    //c.grabVR.tmpMesh.position.copy(c.grabVR.grabbedObject.position);

                    //console.dir(c.grabVR.grabberHook.position);

                    c.grabVR.grabbedObject = intersects[0].object;

                    //console.dir(intersects[0]);
                    // c.grabVR.grabberHook.position.x = intersects[0].point.x;
                    // c.grabVR.grabberHook.position.y = intersects[0].point.y;
                    // c.grabVR.grabberHook.position.z = intersects[0].point.z;
                    c.grabVR.grabberHook.visible = true;
                    c.grabVR.hasAGrabbedObject = true;

                }
            },
            release: function (c) {
                if (c.grabVR.hasAGrabbedObject) {
                    c.grabVR.hasAGrabbedObject = false;
                    c.grabVR.grabberHook.visible = false;
                }
            },
            update: function (dt) {
                controllers.forEach(function (c) {
                    c.getWorldPosition(c.grabVR.raycaster.ray.origin);
                    c.getWorldQuaternion(c.grabVR.quaternion);
                    c.grabVR.raycaster.ray.direction.copy(direction).applyEuler(new THREE.Euler().setFromQuaternion(c.grabVR.quaternion, "XYZ"));

                    var intersects = c.grabVR.raycaster.intersectObjects(_grabableObjects);
                    if (intersects.length > 0) {
                        c.grabVR.line.visible = true;
                    } else {
                        c.grabVR.line.visible = false;
                    }

                    if (c.grabVR.hasAGrabbedObject) {
                        //### for sliding object towards controller
                        var vec = new THREE.Vector3();
                        c.getWorldPosition(vec);
                        c.grabVR.grabberHook.lookAt(c.grabVR.mesh.worldToLocal(vec));

                        //console.dir(c.grabVR.grabberHook);
                        //### end for sliding object towards controller c

                        //     controller.grabVR.grabbedObject.__dirtyPosition = true;
                        //     controller.grabVR.grabbedObject.__dirtyRotation = true;

                        var vec = new THREE.Vector3();
                        c.grabVR.grabberHook.getWorldPosition(vec);

                        //console.dir(vec);


                        vec = c.grabVR.grabbedObject.worldToLocal(vec).multiplyScalar(4);
                        vec.applyEuler(c.grabVR.grabbedObject.rotation);
                        if (_usePhysijs) {
                            c.grabVR.grabbedObject.setLinearVelocity(vec);
                        } else { 
                            c.grabVR.grabberHook.getWorldPosition(c.grabVR.grabbedObject.position);
                        }
                    }

                    c.grabVR.mesh.position.copy(c.grabVR.raycaster.ray.origin);
                    //c.grabVR.mesh.quaternion.copy(c.grabVR.quaternion);
                    c.grabVR.mesh.rotation.copy(new THREE.Euler().setFromQuaternion(c.grabVR.quaternion, "XYZ"));
                    c.grabVR.mesh.__dirtyPosition = true;
                    c.grabVR.mesh.__dirtyRotation = true;
                });
            }
        }
    })

    return GrabVR;
})));