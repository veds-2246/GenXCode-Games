import { useState, useEffect, useCallback, useRef } from 'react';
import type { Card, Difficulty, GameStatus } from './types/game';
import { CARD_SYMBOLS, DIFFICULTY_CONFIG } from './data/cardSymbols';
import MemoryCard from './components/MemoryCard';
import GameHeader from './components/GameHeader';
import GameStats from './components/GameStats';
import DifficultySelector from './components/DifficultySelector';
import GameOver from './components/GameOver';
import './memory-flip.css';

export default function MemoryFlipGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [firstCardId, setFirstCardId] = useState<number | null>(null);
  const [secondCardId, setSecondCardId] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [isLocked, setIsLocked] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const totalPairs = DIFFICULTY_CONFIG[difficulty].pairs;

  const createDeck = useCallback((): Card[] => {
    const symbols = CARD_SYMBOLS.slice(0, totalPairs);
    const pairedSymbols = [...symbols, ...symbols];
    
    // Fisher-Yates shuffle
    for (let i = pairedSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedSymbols[i], pairedSymbols[j]] = [pairedSymbols[j], pairedSymbols[i]];
    }

    return pairedSymbols.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
  }, [totalPairs]);

  const resetGame = useCallback(() => {
    setCards(createDeck());
    setFirstCardId(null);
    setSecondCardId(null);
    setMoves(0);
    setMatchedPairs(0);
    setTime(0);
    setGameStatus('playing');
    setIsLocked(false);
  }, [createDeck]);

  // Initialize game on mount and when difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty, resetGame]);

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStatus]);

  const handleCardClick = useCallback((cardId: number) => {
    if (isLocked || gameStatus !== 'playing') return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (firstCardId === null) {
      setFirstCardId(cardId);
    } else if (secondCardId === null && cardId !== firstCardId) {
      setSecondCardId(cardId);
      setMoves((prev) => prev + 1);
      setIsLocked(true);
    }
  }, [cards, firstCardId, secondCardId, isLocked, gameStatus]);

  // Handle card comparison
  useEffect(() => {
    if (firstCardId !== null && secondCardId !== null) {
      const firstCard = cards.find((c) => c.id === firstCardId);
      const secondCard = cards.find((c) => c.id === secondCardId);

      if (firstCard && secondCard) {
        const isMatch = firstCard.value === secondCard.value;

        if (isMatch) {
          // Mark as matched
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          
          // Check for win
          if (matchedPairs + 1 === totalPairs) {
            setGameStatus('won');
          }
        }

        // Flip back after delay if not matched
        const delay = isMatch ? 300 : 800;
        setTimeout(() => {
          if (!isMatch) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstCardId || c.id === secondCardId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
          }
          setFirstCardId(null);
          setSecondCardId(null);
          setIsLocked(false);
        }, delay);
      }
    }
  }, [firstCardId, secondCardId, cards, matchedPairs, totalPairs]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  const handlePlayAgain = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const stats = {
    time,
    moves,
    matchedPairs,
    totalPairs,
  };

  const boardStyle: React.CSSProperties = {
    '--grid-columns': DIFFICULTY_CONFIG[difficulty].columns,
  } as React.CSSProperties;

  return (
    <div className="memory-flip-game">
      <GameHeader />
      <GameStats stats={stats} />
      <DifficultySelector
        currentDifficulty={difficulty}
        onChange={handleDifficultyChange}
        disabled={gameStatus === 'playing' && matchedPairs > 0}
      />
      
      <div
        className="game-board"
        style={boardStyle}
        role="list"
        aria-label="Memory cards"
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={isLocked || gameStatus !== 'playing'}
          />
        ))}
      </div>

      <button
        type="button"
        className="restart-btn"
        onClick={handleRestart}
        disabled={gameStatus === 'idle'}
      >
        Restart Game
      </button>

      {gameStatus === 'won' && (
        <GameOver
          time={time}
          moves={moves}
          pairs={totalPairs}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}