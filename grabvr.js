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
                    grabbedObject: null
                };
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 0, 0));
                geometry.vertices.push(new THREE.Vector3(0, 0, -100));
                o.grabVR.line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }));
                o.add(o.grabVR.line);
                controllers.push(o);
            },
            grabableObjects: _grabableObjects,
            grabableDistance: _grabableDistance,
            grab: function (c) {
                var intersects = c.grabVR.raycaster.intersectObjects(_grabableObjects);
                if (intersects.length > 0) {
                    intersects[0].object.matrix.copy(intersects[0].object.matrixWorld);
                    intersects[0].object.applyMatrix(new THREE.Matrix4().getInverse(c.matrixWorld));
                    c.add(intersects[0].object);
                    c.grabVR.grabbedObject = intersects[0].object;
                }
            },
            release: function (c) {
                if (c.grabVR.grabbedObject != null) {
                    c.grabVR.grabbedObject.matrix.copy(c.grabVR.grabbedObject.matrixWorld);
                    c.grabVR.grabbedObject.applyMatrix(new THREE.Matrix4().getInverse(scene.matrixWorld));
                    scene.add(c.grabVR.grabbedObject);
                    c.grabVR.grabbedObject = null;
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

                    if (controller.grabVR.grabbedObject && controller.grabVR.grabbedObject.position.z < -0.5) {
                        controller.grabVR.grabbedObject.position.z += 20 * dt;
                    }

                });
            }
        }
    })

    return GrabVR;
})));