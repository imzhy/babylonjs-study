<template>
  <div class="three-box">
      <canvas id="renderCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as BABYLON from "babylonjs";
import {onMounted} from "vue";

onMounted(() => {
    init();
});

const renderScene = (canvas: HTMLCanvasElement, engine: BABYLON.Engine): BABYLON.Scene => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 0.5;

    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
        diameter: 1.3,
        height: 1.2,
        tessellation: 3
    }, scene);
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22

    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    boxMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");

    roof.material = roofMat;
    box.material = boxMat;


    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10,
        height: 10
    }, scene);

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    ground.material = groundMat;

    return scene;
}

const init = () => {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);

    const scene = renderScene(canvas, engine);

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}
</script>

<style lang="less" scoped>
.three-box {
  width: 100%;
  height: 100%;

  > canvas {
    width: 100%;
    height: 100%;
  }
}
</style>