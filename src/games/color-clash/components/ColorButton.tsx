type ColorName = "RED" | "BLUE" | "GREEN" | "YELLOW";

interface ColorButtonProps {
  color: ColorName;
  onClick: (color: ColorName) => void;
  disabled: boolean;
}

const colorStyles: Record<ColorName, string> = {
  RED: "bg-red-500 hover:bg-red-400 active:bg-red-600",
  BLUE: "bg-blue-500 hover:bg-blue-400 active:bg-blue-600",
  GREEN: "bg-green-500 hover:bg-green-400 active:bg-green-600",
  YELLOW: "bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500",
};

export default function ColorButton({
  color,
  onClick,
  disabled,
}: ColorButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(color)}
      className={`
        min-h-20
        w-full
        rounded-2xl
        px-4
        py-5
        text-lg
        font-bold
        tracking-wide
        text-slate-950
        shadow-lg
        transition
        duration-150
        hover:-translate-y-0.5
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${colorStyles[color]}
      `}
    >
      {color}
    </button>
  );
}