import { Mesh } from '@babylonjs/core';
import { PlanetComponent } from './planet.component';

export class PhotoidComponent {
  public mesh: Mesh | null = null;
  constructor(public target: PlanetComponent) {}
}
