<template>
  <div class="second-box">
      <div>
          <button @click="playSound">play</button>
      </div>
      <div>
          <canvas id="renderCanvas"></canvas>
      </div>
  </div>
</template>

<script setup lang="ts">
import * as BABYLON from "babylonjs";
import {onMounted} from "vue";

onMounted(() => {
    init();
});

let sound: BABYLON.Sound | null = null;

const playSound = () => {
    console.log(sound);
    sound?.play();
}

const renderScene = (canvas: HTMLCanvasElement, engine: BABYLON.Engine): BABYLON.Scene => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = .7;

    const box1 = BABYLON.MeshBuilder.CreateBox("box1", {width: 2, height: 1.5, depth: 3});
    box1.position.y = -10;
    box1.position.x = -10;
    box1.position.z = -10;

    // box1.position = new BABYLON.Vector3(5, 5, 5);
    // box1.setPositionWithLocalVector(new BABYLON.Vector3(5, 5, 5));

    // box1.translate(new BABYLON.Vector3(5, 5, 5), 1, BABYLON.Space.LOCAL);
    // box1.position.addInPlace(new BABYLON.Vector3(5, 5, 5));
    box1.locallyTranslate(new BABYLON.Vector3(5, 5, 5));

    const box2 = BABYLON.MeshBuilder.CreateBox("box2", {});
    box2.scaling.x = 2;
    box2.scaling.y = 1.5;
    box2.scaling.z = 3;
    box2.position = new BABYLON.Vector3(-3, 0.75, 0);

    const box3 = BABYLON.MeshBuilder.CreateBox("box3", {});
    box3.scaling = new BABYLON.Vector3(2, 1.5, 3);
    box3.position.x  = 3;
    box3.position.y  = 0.75;
    box3.position.z  = 0;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10,
        height: 10
    }, scene);

    sound = new BABYLON.Sound("sound", "/src/assets/qqqg.mp3", scene, () => {

    }, {
        loop: true,
        autoplay: true,
        volume: .3
    });

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
.second-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  > div:nth-of-type(2) {
    width: 100%;
    height: 100%;

    > canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>