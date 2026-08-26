export type GameState =
  | 'start'
  | 'countdown'
  | 'lights'
  | 'waiting'
  | 'signal'
  | 'result'
  | 'falseStart';

export interface GameResult {
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
}

export interface LightState {
  index: number;
  isActive: boolean;
}

export interface CountdownState {
  value: number;
  isActive: boolean;
}