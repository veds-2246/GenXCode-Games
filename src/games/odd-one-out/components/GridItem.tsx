import type { GridItem } from "../types";

interface GridItemProps {
  item: GridItem;
  index: number;
  isSelected: boolean;
  isOdd: boolean;
  showFeedback: boolean;
  disabled: boolean;
  onPress: () => void;
}

const shapeClipPaths: Record<GridItem["shape"], string> = {
  circle: "circle(50% at 50% 50%)",
  square: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  triangle: "polygon(50% 0, 100% 100%, 0 100%)",
  diamond: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
};

const patternStyles: Record<GridItem["pattern"], React.CSSProperties> = {
  solid: {},

  striped: {
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 6px, currentColor 6px, currentColor 12px)",
    backgroundSize: "100% 100%",
  },

  dotted: {
    backgroundImage:
      "radial-gradient(currentColor 2px, transparent 2px)",
    backgroundSize: "12px 12px",
  },

  crosshatch: {
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 4px,
        currentColor 4px,
        currentColor 8px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 4px,
        currentColor 4px,
        currentColor 8px
      )
    `,
    backgroundSize: "100% 100%",
  },
};

export function GridItemComponent({
  item,
  index,
  isSelected,
  isOdd,
  showFeedback,
  disabled,
  onPress,
}: GridItemProps) {
  const scale =
    item.size === "small"
      ? 0.65
      : item.size === "large"
        ? 1.35
        : 1;

  const isCorrectSelection =
    showFeedback && isSelected && isOdd;

  const isWrongSelection =
    showFeedback && isSelected && !isOdd;

  const isRevealedOdd =
    showFeedback && !isSelected && isOdd;

  const borderColor = isCorrectSelection
    ? "#22c55e"
    : isWrongSelection
      ? "#ef4444"
      : isRevealedOdd
        ? "#22c55e"
        : "#622899";

  const borderWidth =
    isCorrectSelection ||
    isWrongSelection ||
    isRevealedOdd
      ? 2
      : 1;

  return (
   <button
  type="button"
  onClick={onPress}
  disabled={disabled}
      className="relative aspect-square w-full min-h-[44px] min-w-[44px] touch-manipulation select-none rounded-lg transition-transform duration-150"
      style={{
        transform: `scale(${scale})`,
        borderColor,
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
        backgroundColor: "#170C2D",

        boxShadow: isSelected && !showFeedback
          ? "0 0 0 2px rgba(123,55,187,0.45)"
          : "none",
      }}
      aria-label={`Grid item ${index + 1}`}
      aria-pressed={isSelected}
    >
      {/* Shape / object */}
      <div
        className="absolute inset-3 flex items-center justify-center"
        style={{
          clipPath: shapeClipPaths[item.shape],
          backgroundColor: item.color,
          ...patternStyles[item.pattern],
          opacity:
            disabled && showFeedback && !isOdd
              ? 0.4
              : 1,
        }}
      >
        <span
          className="select-none"
          style={{
            color: "#E8E4F2",
            fontSize:
              item.size === "small"
                ? "1.25rem"
                : item.size === "large"
                  ? "2.5rem"
                  : "1.75rem",
            lineHeight: 1,
            textShadow: "0 1px 4px rgba(0,0,0,0.45)",
          }}
        >
          {item.symbol}
        </span>
      </div>

      {/* Correct indicator */}
      {showFeedback && isOdd && (
        <span
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
          style={{
            backgroundColor: "#22c55e",
            color: "#ffffff",
          }}
        >
          ✓
        </span>
      )}

      {/* Wrong indicator */}
      {isWrongSelection && (
        <span
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
          style={{
            backgroundColor: "#ef4444",
            color: "#ffffff",
          }}
        >
          ×
        </span>
      )}
    </button>
  );
}