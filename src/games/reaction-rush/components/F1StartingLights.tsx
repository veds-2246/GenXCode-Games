import { lightsStyles } from '../reaction-rush.css.ts';

interface F1StartingLightsProps {
  lights: boolean[];
  gameState: 'lights' | 'waiting' | 'signal' | 'result' | 'falseStart';
}

const NUM_HOUSINGS = 5;
const LIGHTS_PER_COLUMN = 4;

export function F1StartingLights({ lights, gameState }: F1StartingLightsProps) {
  const isSignalPhase = gameState === 'signal';
  const isResultOrFalseStart = gameState === 'result' || gameState === 'falseStart';

  const activeLights = lights.slice(0, NUM_HOUSINGS);

  return (
    <div className={lightsStyles.container} role="status" aria-live="polite">
      {activeLights.map((isColumnActive, columnIndex) => (
        <div key={columnIndex} className={lightsStyles.column}>
          <div className={lightsStyles.housing}>
            {Array.from({ length: LIGHTS_PER_COLUMN }, (_, lightIndex) => (
              <div
                key={lightIndex}
                className={`${lightsStyles.light} ${
                  isColumnActive ? lightsStyles.active : lightsStyles.inactive
                } ${isSignalPhase ? lightsStyles.signal : ''} ${isResultOrFalseStart ? lightsStyles.dimmed : ''}`}
                aria-label={`Column ${columnIndex + 1}, light ${lightIndex + 1} ${isColumnActive ? 'on' : 'off'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}