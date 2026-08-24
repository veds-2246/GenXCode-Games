import { NumberNinja } from './games/number-ninja/NumberNinja';

export default function App() {
  const path = window.location.pathname;

  // Number Ninja page
  if (path === '/number-ninja') {
    return <NumberNinja />;
  }

  // Main Game Arcade page
  return (
    <main className="min-h-screen bg-[#0C0224] text-[#E8E4F2] flex flex-col items-center p-6 sm:p-10">
      <div className="w-full max-w-5xl pt-20 sm:pt-28">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#E8E4F2]">
            GenXCode Games
          </h1>

          <p className="mt-4 text-xl sm:text-2xl text-[#8D82A5]">
            Freshers Game Arcade
          </p>
        </div>

        {/* Number Ninja Card */}
        <div className="w-full rounded-3xl border border-[#622899] bg-[#170C2D] p-8 sm:p-10 shadow-[0_0_30px_rgba(98,40,153,0.15)]">
          
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#E8E4F2]">
            Number Ninja
          </h2>

          <p className="mt-4 text-lg sm:text-xl text-[#8D82A5]">
            Guess the hidden number. Higher or lower?
          </p>

          {/* PLAY GAME */}
          <a
            href="/number-ninja"
            className="inline-flex items-center mt-8 px-6 py-3 rounded-xl
              bg-[#7B37BB]
              text-[#E8E4F2]
              font-semibold text-lg
              transition-all duration-200
              hover:bg-[#622899]
              hover:shadow-[0_0_20px_rgba(194,169,226,0.35)]
              hover:-translate-y-1"
          >
            Play Game →
          </a>

        </div>
      </div>
    </main>
  );
}