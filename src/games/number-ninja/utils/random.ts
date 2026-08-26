export function generateSecret(min: number, max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomValue = array[0] / (0xffffffff + 1);
  return Math.floor(randomValue * (max - min + 1)) + min;
}