import { supabase } from "./lib/supabase";

function App() {
  const testConnection = async () => {
    const { error } = await supabase.from("games").select("id").limit(1);

    console.log(error ?? "Supabase connection successful");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">GenXCode Games</h1>
        <p className="mt-2 text-lg text-slate-300">Freshers Game Arcade</p>
      </div>
      <button
        onClick={testConnection}
        className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
      >
        Test Supabase
      </button>
    </main>
  );
}

export default App;
