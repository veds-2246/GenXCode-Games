import { COLOR_VALUES, DIFFICULTY_TIERS } from '../constants';
import type { BaseColor, ColorChallenge, ColorOption } from '../types';
import { getRandomElement, getDifferentColor, shuffleArray } from '../utils';

export function useColorGenerator() {
  function generateChallenge(round: number): ColorChallenge {
    const tier = DIFFICULTY_TIERS.find(t => round >= t.rounds[0] && round <= t.rounds[1]) ?? DIFFICULTY_TIERS[0];
    const colors = tier.colors;
    const word = getRandomElement(colors);
    const shouldMismatch = Math.random() < tier.mismatchProb;
    const color = shouldMismatch ? getDifferentColor(word, colors) : word;
    return {
      word,
      color,
      colorValue: COLOR_VALUES[color],
    };
  }

  function generateOptions(correctColor: BaseColor, round: number): ColorOption[] {
    const tier = DIFFICULTY_TIERS.find(t => round >= t.rounds[0] && round <= t.rounds[1]) ?? DIFFICULTY_TIERS[0];
    const colors = tier.colors;
    const options: ColorOption[] = [
      { color: correctColor, colorValue: COLOR_VALUES[correctColor] },
    ];

    const otherColors = colors.filter(c => c !== correctColor);
    const distractors = shuffleArray(otherColors).slice(0, 3).map(c => ({
      color: c,
      colorValue: COLOR_VALUES[c],
    }));

    options.push(...distractors);
    return shuffleArray(options);
  }

  return { generateChallenge, generateOptions };
}