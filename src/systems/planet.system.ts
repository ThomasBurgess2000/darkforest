import { IterativeSystem } from 'tick-knock/lib/ecs/IterativeSystem';
import { PlanetComponent } from '../components/planet.component';
import { Entity } from 'tick-knock/lib/ecs/Entity';
import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';
import { WaveComponent } from '../components/wave.component';

export class PlanetSystem extends IterativeSystem {
  private redMaterial: StandardMaterial;
  private whiteMaterial: StandardMaterial;
  public constructor() {
    super((entity) => entity.has(PlanetComponent));
    this.redMaterial = new StandardMaterial('redMaterial');
    this.redMaterial.emissiveColor = Color3.Red();
    this.whiteMaterial = new StandardMaterial('whiteMaterial');
    this.whiteMaterial.emissiveColor = Color3.White();
  }

  updateEntity(entity: Entity, dt: number): void {
    const planet = entity.get(PlanetComponent);
    if (!planet) {
      console.error('Planet component not found');
      return;
    }
    if (planet.mesh === null) {
      this.spawnPlanetMesh(planet);
    }
    if (!planet.mesh) {
      console.error('Planet mesh not found');
      return;
    }

    if (planet.isListeningForWaves) {
      const collidedWithWave = this.checkForWaveCollision(planet);
      if (collidedWithWave) {
        planet.mesh.material = this.redMaterial;
      } else {
        planet.mesh.material = this.whiteMaterial;
      }
    }
  }

  spawnPlanetMesh(planetComponent: PlanetComponent) {
    const mesh = MeshBuilder.CreateSphere(planetComponent.name, { diameter: 2 });
    mesh.position = planetComponent.position;
    mesh.material = this.whiteMaterial;
    planetComponent.mesh = mesh;
  }

  checkForWaveCollision(planet: PlanetComponent): boolean {
    let anyWaveCollidedWithPlanet = false;
    const waveEntities = this.engine.entities.filter((entity) => entity.has(WaveComponent));
    for (const waveEntity of waveEntities) {
      const wave = waveEntity.get(WaveComponent);
      if (!wave) {
        console.error('Wave component not found');
        continue;
      }
      if (!wave.mesh) {
        console.error('Wave mesh not found');
        continue;
      }
      if (!planet.mesh) {
        console.error('Planet mesh not found');
        continue;
      }
      const correspondingPlanet = waveEntity.get(PlanetComponent);
      const isWaveFromThisPlanet = correspondingPlanet && correspondingPlanet.name === planet.name;
      if (!isWaveFromThisPlanet && wave.mesh.intersectsMesh(planet.mesh, true, false)) {
        console.log('Wave ' + wave.mesh.name + ' collided with planet ' + planet.name);
        anyWaveCollidedWithPlanet = true;
      }
    }
    return anyWaveCollidedWithPlanet;
  }
}
