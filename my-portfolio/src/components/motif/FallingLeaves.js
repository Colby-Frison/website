import React, { useMemo } from 'react';
import './FallingLeaves.css';

/* Single cherry-blossom petal silhouette */
const PETAL_PATH =
  'M12 3.2C9.2 6.4 6.2 10.2 6.4 14.2C6.6 17.6 9.1 20.2 12 21.2C14.9 20.2 17.4 17.6 17.6 14.2C17.8 10.2 14.8 6.4 12 3.2Z';

const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Home-only cherry blossom petals.
 * layer: "behind" (under UI) | "front" (over UI during gusts)
 */
const FallingLeaves = ({ count = 40, mode = 'ambient', layer = 'behind' }) => {
  const petals = useMemo(() => {
    const seedBase = mode === 'intro' ? 11 : mode === 'exit' ? 29 : 53;
    const rand = mulberry32(seedBase + (layer === 'front' ? 1000 : 0) + count);
    const isGust = mode === 'intro' || mode === 'exit';
    const direction = mode === 'exit' ? -1 : 1;

    return Array.from({ length: count }, (_, i) => {
      const size = isGust ? 14 + rand() * 32 : 10 + rand() * 20;

      let startX;
      let startY;
      let delay;
      let duration;

      if (isGust) {
        // Spawn well off-screen; start higher to match the steeper downward path
        startX =
          direction === 1
            ? -55 - rand() * 55
            : 105 + rand() * 55;
        startY = -45 + rand() * 95;
        delay = rand() * 0.4;
        // Keep gust timing tight so speed reads as constant across petals
        duration = 1.05 + rand() * 0.15;
      } else {
        // Ambient: wide spawn band (beyond viewport) so right edge stays fed;
        // most petals preload across the full screen including top / top-right.
        duration = 7 + rand() * 8;
        const preloadOnScreen = rand() < 0.78;
        if (preloadOnScreen) {
          startX = -10 + rand() * 120; // ~-10% … 110%
          // Extra weight on the top band so the upper edge isn't empty at start
          startY = rand() < 0.42 ? rand() * 32 : 8 + rand() * 86;
          // Negative delay = already mid-fall on first paint
          delay = -(0.1 + rand() * 0.75) * duration;
        } else {
          // Sky spawn much wider than the viewport
          startX = -60 + rand() * 190; // ~-60% … 130%
          startY = -22 - rand() * 30;
          delay = rand() * 2.2;
        }
      }

      const driftX = isGust ? 130 + rand() * 45 : 35 + rand() * 55;
      // ~10% more vertical drop vs previous near-horizontal gust path
      const driftY = isGust ? 48 + rand() * 42 : 105 + rand() * 25;
      const spin = 160 + rand() * 560;
      const tumble = 10 + rand() * 26;
      const opacity =
        layer === 'front'
          ? 0.5 + rand() * 0.45
          : isGust
            ? 0.35 + rand() * 0.4
            : 0.32 + rand() * 0.4;
      const tone = rand() > 0.32 ? 'crimson' : 'deep';

      return {
        id: `${mode}-${layer}-${i}`,
        size,
        startX,
        startY,
        delay,
        duration,
        driftX: driftX * direction,
        driftY,
        spin: spin * direction,
        tumble,
        opacity,
        tone,
      };
    });
  }, [count, mode, layer]);

  return (
    <div
      className={`falling-petals falling-petals--${mode} falling-petals--${layer}`}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className={`falling-petal falling-petal--${petal.tone}`}
          style={{
            '--petal-x': `${petal.startX}${mode === 'ambient' ? '%' : 'vw'}`,
            '--petal-y': `${petal.startY}${mode === 'ambient' ? 'vh' : '%'}`,
            '--petal-size': `${petal.size}px`,
            '--petal-delay': `${petal.delay}s`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-drift-x': `${petal.driftX}vw`,
            '--petal-drift-y': `${petal.driftY}vh`,
            '--petal-spin': `${petal.spin}deg`,
            '--petal-tumble': `${petal.tumble}px`,
            '--petal-opacity': petal.opacity,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={PETAL_PATH} fill="currentColor" />
            <path
              d="M12 8.5C12 8.5 11.2 13 12 19"
              stroke="rgba(245,242,237,0.45)"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  );
};

export default FallingLeaves;
