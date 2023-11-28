// Do everything in real terms (speed of light is actually the speed of light, etc.)
// These will be used to scale the values down to a more manageable size for the game engine

export const SPEED_OF_LIGHT = gameScale(299792458);
export const EARTH_RADIUS = gameScale(6371000);

export function gameScale(value: number) {
  return value / 1000000;
}
