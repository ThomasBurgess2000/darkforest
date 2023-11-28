import { Vector3 } from '@babylonjs/core';

export function withinTolerance(positionA: Vector3, positionB: Vector3, tolerance: number) {
  return Vector3.Distance(positionA, positionB) < tolerance;
}
