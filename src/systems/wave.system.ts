import { Entity } from 'tick-knock/lib/ecs/Entity';
import { IterativeSystem } from 'tick-knock/lib/ecs/IterativeSystem';
import { WaveComponent } from '../components/wave.component';
import { MeshBuilder } from '@babylonjs/core';
import { PlanetComponent } from '../components/planet.component';

export class PlanetWaveSystem extends IterativeSystem {
  public constructor() {
    super((entity: Entity) => entity.hasAll(PlanetComponent, WaveComponent));
  }

  protected updateEntity(entity: Entity, dt: number): void {
    const wave = entity.get(WaveComponent)!;
    const planet = entity.get(PlanetComponent)!;
    if (planet.mesh === null) {
      return;
    }
    if (wave.mesh === null) {
      this.spawnWaveMesh(wave, planet);
    }
    wave.time += dt;
    if (!wave.mesh) {
      console.error('Wave mesh not found');
      return;
    }
    // Make the wave mesh grow over time
    wave.mesh.scaling.setAll(1 + wave.time / 2);
  }

  private spawnWaveMesh(waveComponent: WaveComponent, planetComponent: PlanetComponent) {
    const mesh = MeshBuilder.CreateSphere(planetComponent.name + ':wave', { diameter: 2 });
    mesh.parent = planetComponent.mesh;
    mesh.visibility = 0.5;
    waveComponent.mesh = mesh;
  }
}
