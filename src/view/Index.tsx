import {defineComponent, h} from "vue";
import "./Index.less";
import * as Babylon from "babylonjs";
import "babylonjs-loaders";

export default defineComponent({
    setup() {

        const renderScene = (canvas: HTMLCanvasElement, engine: Babylon.Engine): Babylon.Scene => {
            const scene = new Babylon.Scene(engine);

            const camera = new Babylon.ArcRotateCamera("camera", Babylon.Tools.ToRadians(90), Babylon.Tools.ToRadians(65), 10, Babylon.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);

            const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
            light.intensity = .7;

            // const sphere = Babylon.MeshBuilder.CreateSphere("sphere", {
            //     diameter: 2,
            //     segments: 32
            // }, scene);
            //
            // sphere.position.y = 1;

            const ground = Babylon.MeshBuilder.CreateGround("ground", {
                width: 6,
                height: 6
            }, scene);

            const groundMaterial = new Babylon.StandardMaterial("groundMaterial", scene);
            // groundMaterial.diffuseColor = Babylon.Color3.Red();
            groundMaterial.diffuseTexture = new Babylon.Texture("/src/assets/yepi.jpg", scene);

            ground.material = groundMaterial;

            Babylon.SceneLoader.ImportMesh("", "/src/assets/", "Yeti.gltf", scene, (newMeshes: Babylon.AbstractMesh[]) => {
                newMeshes[0].scaling = new Babylon.Vector3(0.1, 0.1, 0.1);
            });

            return scene;
        }

        const init = () => {
            const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
            const engine = new Babylon.Engine(canvas, true);

            const scene = renderScene(canvas, engine);

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

        return () => {
            return (
                <div class="index-box">
                    {renderSceneVNode()}
                </div>
            )
        }
    }
})