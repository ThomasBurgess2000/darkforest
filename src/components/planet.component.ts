import { Mesh, Vector3 } from '@babylonjs/core';

export class PlanetComponent {
  public mesh: Mesh | null = null;
  public isListeningForWaves = false;
  constructor(
    public name: string,
    public position = Vector3.Zero(),
  ) {}
}
