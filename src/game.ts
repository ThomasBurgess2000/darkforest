/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import { EcsEngine } from './ecsEngine';
import { PlanetWaveSystem } from './systems/wave.system';
import { Entity } from 'tick-knock/lib/ecs/Entity';
import { WaveComponent } from './components/wave.component';
import { PlanetSystem } from './systems/planet.system';
import { PlanetComponent } from './components/planet.component';

export function startGame() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  window.addEventListener('resize', () => {
    engine.resize();
  });

  const scene = new Scene(engine);
  Inspector.Show(scene, {});

  const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 15, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  engine.runRenderLoop(() => {
    scene.render();
  });

  const ecsEngine = EcsEngine.getInstance();
  addSystems();
  createPlanets();
  scene.onBeforeRenderObservable.add(() => {
    ecsEngine.update(engine.getDeltaTime() / 1000);
  });
}

function createPlanets() {
  const ecsEngine = EcsEngine.getInstance();
  for (let i = 0; i < 10; i++) {
    // Generate a Vector3 with a random distance from the origin (x, y, z all between -1000 and 1000)
    const randomDistance = new Vector3(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
    const planetEntity = new Entity();
    const planetComponent = new PlanetComponent('Ktema' + i, randomDistance);
    planetComponent.isListeningForWaves = true;
    const waveComponent = new WaveComponent();
    planetEntity.add(planetComponent);
    planetEntity.add(waveComponent);
    ecsEngine.addEntity(planetEntity);
  }
}

function addSystems() {
  const ecsEngine = EcsEngine.getInstance();
  ecsEngine.addSystem(new PlanetWaveSystem());
  ecsEngine.addSystem(new PlanetSystem());
}
