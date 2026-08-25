import type { GridItem } from "../types";
import { GridItemComponent } from "./GridItem";

interface GameGridProps {
  items: GridItem[];
  gridSize: 3 | 4 | 5;
  oddIndex: number;
  selectedIndex: number | null;
  showFeedback: boolean;
  disabled: boolean;
  onItemPress: (index: number) => void;
}

export function GameGrid({
  items,
  gridSize,
  oddIndex,
  selectedIndex,
  showFeedback,
  disabled,
  onItemPress,
}: GameGridProps) {
  return (
    <div
      className="grid gap-3 md:gap-4"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        maxWidth:
          gridSize === 5
            ? "480px"
            : gridSize === 4
              ? "400px"
              : "320px",
        margin: "0 auto",
      }}
      role="grid"
      aria-label={`Game grid, ${gridSize} by ${gridSize}`}
    >
      {items.map((item, index) => (
        <GridItemComponent
          key={index}
          item={item}
          index={index}
          isSelected={selectedIndex === index}
          isOdd={index === oddIndex}
          showFeedback={showFeedback}
          disabled={disabled}
          onPress={() => onItemPress(index)}
        />
      ))}
    </div>
  );
}