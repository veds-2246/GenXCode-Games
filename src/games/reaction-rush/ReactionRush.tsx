import { useGameState } from './hooks/useGameState';
import { GameArea } from './components/GameArea';
import { StartScreen } from './components/StartScreen';
import { Countdown } from './components/Countdown';
import { F1StartingLights } from './components/F1StartingLights';
import { ResultScreen } from './components/ResultScreen';
import { FalseStartScreen } from './components/FalseStartScreen';
import './reaction-rush.css';

export function ReactionRush() {
  const {
    gameState,
    countdownValue,
    lights,
    reactionTime,
    score,
    bestTime,
    handleTap,
    playAgain,
  } = useGameState();

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleTap} />;

      case 'countdown':
        return <Countdown value={countdownValue} isActive={true} />;

      case 'lights':
      case 'waiting':
      case 'signal':
        return <F1StartingLights lights={lights} gameState={gameState} />;

      case 'result':
        return (
          <ResultScreen
            reactionTime={reactionTime ?? 0}
            score={score ?? 0}
            bestTime={bestTime}
            onPlayAgain={playAgain}
          />
        );

      case 'falseStart':
        return <FalseStartScreen onPlayAgain={playAgain} />;

      default:
        return null;
    }
  };

  return (
    <GameArea gameState={gameState} onPointerDown={handleTap}>
      {renderContent()}
    </GameArea>
  );
}

export default ReactionRush;