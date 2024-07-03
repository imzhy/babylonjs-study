import earCut from "earcut";
import {defineComponent, h, ref} from "vue";
import "./City.less";
import {ArcRotateCamera} from "@babylonjs/core/Cameras/arcRotateCamera";
import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import {Axis, Color3, Quaternion, Space, Vector3, Vector4} from "@babylonjs/core/Maths/math";
import {CreateBox} from "@babylonjs/core/Meshes/Builders/boxBuilder";
import {CreateGround, CreateGroundFromHeightMap} from "@babylonjs/core/Meshes/Builders/groundBuilder";
import {CreateSphere} from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import {CreateCylinder} from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import {ExtrudePolygon} from "@babylonjs/core/Meshes/Builders/polygonBuilder";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture";
import {Mesh} from "@babylonjs/core/Meshes/mesh";
import {Animation} from "@babylonjs/core/Animations/animation";

import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ/objFileLoader";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
// import "@babylonjs/loaders/legacy";
// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";
// import "@babylonjs/core/Collisions/collisionCoordinator";
import "@babylonjs/core/Animations/animatable";

export default defineComponent({
    setup() {

        const jueProgress = ref("0");
        const shuProgress = ref("0");
        const himProgress = ref("0");

        const createGround = (scene: Scene) => {
            const ground = CreateGroundFromHeightMap("ground", "/src/assets/heightmap.png", {
                width: 150,
                height: 150,
                subdivisions: 30,
                minHeight: 0,
                maxHeight: 10
            }, scene);
            const groundMaterial = new StandardMaterial("groundMaterial", scene);
            groundMaterial.diffuseTexture = new Texture("/src/assets/valleygrass.png", scene);
            ground.material = groundMaterial;
        }

        const createHouse = async (scene: Scene, width: number): Promise<Mesh> => {
            const roof = CreateCylinder("roof", {
                tessellation: 3,
                height: 1.2,
                diameter: 1.3
            }, scene);
            roof.scaling = new Vector3(0.75, width, 1);
            roof.position.y = 1.25;
            roof.rotation = new Vector3(0, 0, Math.PI / 2);
            let roofMaterial = new StandardMaterial("roofMaterial");
            roofMaterial.diffuseTexture = new Texture("src/assets/roof.jpg", scene);
            roof.material = roofMaterial;

            const box = CreateBox("box", {
                width: width,
                faceUV: width === 1 ? [
                    new Vector4(0.5, 0, 0.75, 1),
                    new Vector4(0, 0, 0.25, 1),
                    new Vector4(0.25, 0, 0.5, 1),
                    new Vector4(0.75, 0, 1, 1)
                ] : [
                    new Vector4(0.6, 0, 1, 1),
                    new Vector4(0, 0, 0.4, 1),
                    new Vector4(0.4, 0, 0.6, 1),
                    new Vector4(0.4, 0, 0.6, 1)
                ],
                wrap: true
            }, scene);
            box.position.y = 0.5;
            let boxMaterial = new StandardMaterial("boxMaterial");
            boxMaterial.diffuseTexture = new Texture(width === 1 ? "src/assets/cubehouse.png" : "src/assets/semihouse.png", scene);
            box.material = boxMaterial;

            return await Mesh.MergeMeshesAsync([box, roof], true, false, undefined, false, true);
        }

        const createCar = async (scene: Scene): Promise<Mesh> => {
            const shape = [
                new Vector3(0, 0, 0),
                new Vector3(0.5, 0, 0)
            ];

            for (let i = 0; i < 90; i++) {
                shape.push(new Vector3(
                    0.2 * Math.cos(Math.PI / 180 * i) + 0.3,
                    0,
                    0.2 * Math.sin(Math.PI / 180 * i)
                ));
            }

            shape.push(new Vector3(0.3, 0, 0.2));
            shape.push(new Vector3(0, 0, 0.2))

            let car = ExtrudePolygon("car", {
                shape: shape,
                depth: 0.2,
                faceUV: [
                    new Vector4(0, 0.5, 0.38, 1),
                    new Vector4(0, 0, 1, 0.5),
                    new Vector4(0.38, 1, 0, 0.5)
                ],
                wrap: true
            }, scene, earCut);

            const carMat = new StandardMaterial("carMat");
            carMat.diffuseTexture = new Texture("/src/assets/car.png");
            car.material = carMat;

            const carAnimation = new Animation("carAnimation", "position.z", 60,
                Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            const carKeys = [
                {
                    frame: 0,
                    value: 0
                }, {
                    frame: 60,
                    value: 6
                }, {
                    frame: 180,
                    value: -6
                }, {
                    frame: 240,
                    value: 0
                }
            ];
            carAnimation.setKeys(carKeys);
            car.animations = [carAnimation];


            const wheelRB = CreateCylinder("wheelRB", {
                diameter: 0.15,
                height: 0.04,
                tessellation: 32,
                faceUV: [
                    new Vector4(0, 0, 1, 1),
                    new Vector4(0.1, 0.5, 0.1, 0.5),
                    new Vector4(0, 0, 1, 1)
                ]
            });
            const wheelMat = new StandardMaterial("wheelMat");
            wheelMat.diffuseTexture = new Texture("/src/assets/wheel.png");
            wheelRB.material = wheelMat;
            wheelRB.setParent(car);
            wheelRB.position = new Vector3(0.1, 0.02, 0);

            let wheelAnimation = new Animation("wheelAnimation", "rotation.y", 60,
                Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            const wheelKeys = [
                {
                    frame: 0,
                    value: 0
                }, {
                    frame: 60,
                    value: 3 * Math.PI
                }
            ];
            wheelAnimation.setKeys(wheelKeys);
            wheelRB.animations = [wheelAnimation];

            let wheelLB = wheelRB.clone("wheelLB");
            wheelLB.position.y = -0.22;

            let wheelLF = wheelLB.clone("wheelLF");
            wheelLF.position.x = 0.35;

            let wheelRF = wheelLF.clone("wheelRF");
            wheelRF.position.y = 0.02;

            return car;
        }

        const renderScene = async (canvas: HTMLCanvasElement, engine: Engine): Promise<Scene> => {
            const scene = new Scene(engine);
            // await scene.debugLayer.show();

            // 相机
            // const camera = new ArcRotateCamera("camera", 0, Math.PI / 2.5, 20, new Vector3(0, 0, 0), scene);
            const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 15, new Vector3(0, 0, 0), scene);
            camera.wheelDeltaPercentage = 0.01;
            camera.attachControl(canvas, true);

            // 灯光
            const lightPosition = new Vector3(1, 5, 1);
            const light = new HemisphericLight("light", lightPosition, scene);
            light.intensity = 0.7;
            const sphere = CreateSphere("light", {
                segments: 64,
                diameter: 0.5
            }, scene);
            sphere.position = lightPosition;

            // 天空盒
            // const skybox = CreateBox("skybox", {
            //     size: 500
            // }, scene);
            // // skybox.position.y = 250;
            // const skyboxMaterial = new StandardMaterial("skyboxMaterial", scene);
            // skyboxMaterial.backFaceCulling = false;
            // skyboxMaterial.disableLighting = true;
            // skyboxMaterial.reflectionTexture = new CubeTexture("src/assets/skybox/skybox", scene);
            // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            // skybox.material = skyboxMaterial;
            // skybox.infiniteDistance = true;

            createGround(scene);

            // 碰撞检测框
            const intersectBoxMat = new StandardMaterial("intersectBoxMat");
            intersectBoxMat.wireframe = true;
            let intersectBox = CreateBox("intersectBox", {
                depth: 3
            });
            intersectBox.position = new Vector3(3, 0.5, 0);
            intersectBox.material = intersectBoxMat;

            // 一批房子
            let smallHouse = await createHouse(scene, 1);
            smallHouse.rotation.y = Math.PI / 4;
            let bigHouse = await createHouse(scene, 2);
            bigHouse.position.x = -2;

            let copyConf = [
                [1, -4, 0.1, 0],
                [1, -6, -0.3, 0],
                [2, -8, 0, 0],

                [1, 6, 0.1, -Math.PI / 4],
                [1, 7.5, 0.5, 0],
                [2, 9.5, -0.5, 0],
                [2, 12, 0.1, 0],
                [2, 15, 0, 0],

                [1, -10, 6, Math.PI],
                [1, -8.4, 6, Math.PI],
                [1, -6.5, 6.3, Math.PI],
                [2, -4, 5.8, Math.PI],
                [2, -1.2, 6, Math.PI],
                [2, 1.5, 6.4, Math.PI],
                [1, 3.8, 6.2, Math.PI],
                [2, 6, 6.2, Math.PI],
                [1, 8.5, 6, Math.PI],
                [1, 10.1, 5.7, Math.PI],
                [1, 12.1, 5.9, Math.PI],
                [2, 14.2, 6.2, Math.PI],
                [2, 16.9, 5.4, Math.PI],

                [2, 0, -2, Math.PI / 2],
                [2, 0.2, -4.8, Math.PI / 2],

                [1, 6, -2, -Math.PI / 2],
                [2, 6.2, -4.6, -Math.PI / 2]
            ]
            for (let i = 0; i < copyConf.length; i++) {
                let _cf = copyConf[i];
                let house = _cf[0] === 1
                    ? smallHouse.createInstance("small_house_" + i)
                    : bigHouse.createInstance("big_house_" + i);

                house.position.x = _cf[1];
                house.position.z = _cf[2];
                house.rotation.y = _cf[3];
            }

            // 小车
            let car = await createCar(scene);
            car.position.x = 3;
            car.position.y = 0.075;
            car.rotation.y = -Math.PI / 2;
            car.rotation.x = -Math.PI / 2;

            scene.beginAnimation(car, 0, 240, true);
            let wheels = car.getChildMeshes();
            for (let wheel of wheels) {
                scene.beginAnimation(wheel, 0, 60, true);
            }

            // camera.setTarget(car.position);


            // 加载草
            SceneLoader.ImportMeshAsync("", "src/assets/jue/", "jue.glb", scene, (progress: any) => {
                jueProgress.value = (progress.loaded / progress.total * 100).toFixed(2);
            }).then((jueMeshes: any) => {
                jueMeshes.meshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
                jueMeshes.meshes[0].position = new Vector3(-1.8, 0, -1.8);
            });

            // 加载人物
            SceneLoader.ImportMeshAsync("", "src/assets/Duty/", "dude.babylon", scene, (progress: any) => {
                himProgress.value = (progress.loaded / progress.total * 100).toFixed(2);
            }).then((meshes: any) => {
                let scaling = 1;
                let speed = 1.5;

                meshes.meshes[0].scaling = new Vector3(0.01 * scaling, 0.01 * scaling, 0.01 * scaling);
                meshes.meshes[0].position = new Vector3(1.5, 0, 0);

                meshes.meshes[0].rotate(Axis.Y, -Math.PI / 2, Space.LOCAL);
                let rotation = meshes.meshes[0].rotationQuaternion.clone();

                scene.beginAnimation(meshes.skeletons[0], 0, 100, true, speed);

                const walk = [
                    {turn: -Math.PI, distance: 3},
                    {turn: -Math.PI, distance: 3},
                ];
                const step = 0.005 * scaling * speed;
                let distance = 0;
                let index = 0;

                scene.onBeforeRenderObservable.add(() => {
                    if (!meshes.meshes[0].intersectsMesh(intersectBox) && car.intersectsMesh(intersectBox)) {
                        return;
                    }
                    meshes.meshes[0].movePOV(0, 0, step);
                    distance += step;

                    if (distance >= walk[index].distance) {
                        meshes.meshes[0].rotate(Axis.Y, walk[index].turn, Space.LOCAL);
                        index++;
                        distance = 0;

                        if (index === walk.length) {
                            index = 0;
                            meshes.meshes[0].position = new Vector3(1.5, 0, 0);
                            meshes.meshes[0].rotationQuaternion = rotation.clone();
                        }
                    }
                });
            });

            return scene;
        }

        const init = async () => {
            const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
            const engine = new Engine(canvas);

            const scene = await renderScene(canvas, engine);

            engine.runRenderLoop(() => {
                scene.render();
            });

            window.addEventListener("resize", () => {
                engine.resize();
            });
        }

        const renderSceneVNode = () => {
            return h("canvas", {
                id: "renderCanvas",
                onVnodeMounted: init
            })
        }

        const renderInfoVNode = () => {
            return h("div", {
                class: "info-box"
            }, [
                <div>加载进度</div>,
                <div>草：{jueProgress.value}%</div>,
                <div>树：{shuProgress.value}%（暂无）</div>,
                <div>树：{himProgress.value}%</div>
            ])
        }

        return () => {
            return (
                <div class="index-box">
                    {renderInfoVNode()}
                    {renderSceneVNode()}
                </div>
            )
        }
    }
})