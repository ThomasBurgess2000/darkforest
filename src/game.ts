/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, UniversalCamera, Vector3 } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import { EcsEngine } from './ecsEngine';
import { PlanetWaveSystem } from './systems/wave.system';
import { Entity } from 'tick-knock/lib/ecs/Entity';
import { WaveComponent } from './components/wave.component';
import { PlanetSystem } from './systems/planet.system';
import { PlanetComponent } from './components/planet.component';
import { PhotoidComponent } from './components/photoid.component';
import { SPEED_OF_LIGHT } from './constants/universals';
import { PhotoidSystem } from './systems/photoid.system';

export function startGame() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  window.addEventListener('resize', () => {
    engine.resize();
  });

  const scene = new Scene(engine);
  Inspector.Show(scene, {});

  const camera = new UniversalCamera('camera', new Vector3(0, 0, 0), scene);
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
  let previousPlanet: PlanetComponent | null = null;
  for (let i = 0; i < 10; i++) {
    const randomDistance = new Vector3(
      Math.random() * SPEED_OF_LIGHT * 10,
      Math.random() * SPEED_OF_LIGHT * 10,
      Math.random() * SPEED_OF_LIGHT * 10,
    );
    const planetEntity = new Entity();
    const planetComponent = new PlanetComponent('Ktema' + i, randomDistance);
    planetComponent.isListeningForWaves = true;
    const waveComponent = new WaveComponent();
    planetEntity.add(planetComponent);
    planetEntity.add(waveComponent);
    ecsEngine.addEntity(planetEntity);
    // Launch a photoid at the previous planet from this planet
    if (previousPlanet) {
      const photoidComponent = new PhotoidComponent(previousPlanet);
      planetEntity.add(photoidComponent);
    }
    previousPlanet = planetComponent;
  }
}

function addSystems() {
  const ecsEngine = EcsEngine.getInstance();
  ecsEngine.addSystem(new PlanetWaveSystem());
  ecsEngine.addSystem(new PlanetSystem());
  ecsEngine.addSystem(new PhotoidSystem());
}
