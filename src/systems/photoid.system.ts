import { Entity, IterativeSystem } from 'tick-knock';
import { PhotoidComponent } from '../components/photoid.component';
import { MeshBuilder, Vector3 } from '@babylonjs/core';
import { PlanetComponent } from '../components/planet.component';
import { EARTH_RADIUS, SPEED_OF_LIGHT } from '../constants/universals';
import { withinTolerance } from '../utils/position.utils';

export class PhotoidSystem extends IterativeSystem {
  constructor() {
    super((entity) => entity.hasAll(PhotoidComponent, PlanetComponent));
  }

  updateEntity(entity: Entity, dt: number): void {
    const photoid = entity.get(PhotoidComponent);
    const planet = entity.get(PlanetComponent);
    if (!photoid || !planet) {
      console.error('Photoid || planet component not found');
      return;
    }
    if (photoid.mesh === null && planet.mesh !== null) {
      this.spawnPhotoidMesh(photoid, planet);
    }
    if (!photoid.mesh) {
      return;
    }
    // Move the photoid towards the target planet at the speed of light (SPEED_OF_LIGHT)
    const targetPosition = photoid.target.mesh?.getAbsolutePosition();
    if (!targetPosition) {
      console.error('Target position not found');
      return;
    }
    const direction = targetPosition.subtract(photoid.mesh.getAbsolutePosition()).normalize();
    const distanceToTravel = SPEED_OF_LIGHT * dt * 0.9;
    if (withinTolerance(photoid.mesh.getAbsolutePosition(), targetPosition, EARTH_RADIUS * 2)) {
      photoid.mesh.dispose();
      photoid.mesh = null;
    } else {
      photoid.mesh.position.addInPlace(direction.scale(distanceToTravel));
    }
  }

  spawnPhotoidMesh(photoidComponent: PhotoidComponent, planetComponent: PlanetComponent) {
    const mesh = MeshBuilder.CreateSphere('photoid', { diameter: EARTH_RADIUS * 3 });
    mesh.parent = planetComponent.mesh;
    mesh.position.set(0, 0, 0);
    photoidComponent.mesh = mesh;
  }
}
