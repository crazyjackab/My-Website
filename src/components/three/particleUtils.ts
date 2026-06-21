const SPREAD = 18;

export function createParticleData(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);

  const cyan = { r: 0, g: 0.94, b: 1 };
  const purple = { r: 0.66, g: 0.33, b: 0.97 };

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * SPREAD;
    const y = (Math.random() - 0.5) * SPREAD * 0.7;
    const z = (Math.random() - 0.5) * SPREAD;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    const mix = Math.random() * 0.4;
    colors[i3] = cyan.r + (purple.r - cyan.r) * mix;
    colors[i3 + 1] = cyan.g + (purple.g - cyan.g) * mix;
    colors[i3 + 2] = cyan.b + (purple.b - cyan.b) * mix;
  }

  return { positions, colors, basePositions };
}

export function updateParticlePositions(
  basePositions: Float32Array,
  positions: Float32Array,
  count: number,
  spread: number,
  time: number,
) {
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const bx = basePositions[i3];
    const by = basePositions[i3 + 1];
    const bz = basePositions[i3 + 2];

    positions[i3] = bx * spread + Math.sin(time * 0.3 + i * 0.1) * 0.15;
    positions[i3 + 1] = by * spread + Math.cos(time * 0.25 + i * 0.08) * 0.12;
    positions[i3 + 2] = bz * spread + Math.sin(time * 0.2 + i * 0.05) * 0.1;
  }
}
