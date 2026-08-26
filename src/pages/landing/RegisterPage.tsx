import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp(email, password, {
      name,
      whatsapp_number: whatsapp,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/waiting");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] px-4 py-12 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Brand / Home Link */}
      <Link to="/" className="relative z-10 mb-8 flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900 transition-transform hover:scale-105">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        GenXCode<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Games</span>
      </Link>

      {/* Neo-brutalist Registration Card */}
      <Card className="w-full max-w-md relative z-10 border-2 border-slate-200 border-b-[6px] border-b-indigo-500 rounded-2xl shadow-xl shadow-slate-200/50 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-3xl border-2 border-indigo-100">
            👾
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Create Player Profile</CardTitle>
          <CardDescription className="text-slate-500 font-medium mt-2">
            Register to enter the Freshers Arcade and request your session pass.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 flex items-start gap-3 text-red-600" role="alert">
                <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                label="Player Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. John Doe"
                required
                autoComplete="name"
                className="font-medium"
              />
              <Input
                label="College Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@college.edu"
                required
                autoComplete="email"
                className="font-medium"
              />
              <Input
                label="Secret Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                autoComplete="new-password"
                minLength={6}
                className="font-medium"
              />
              <Input
                label="WhatsApp Number"
                value={whatsapp}
                onChange={(e) => setWhatsApp(e.target.value)}
                placeholder="For session alerts (e.g. +91 9876543210)"
                required
                autoComplete="tel"
                className="font-medium"
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-6 text-lg tracking-wide" loading={loading}>
              {loading ? "Creating Profile..." : "Join the Arcade"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center border-t border-slate-100 py-6 bg-slate-50/50 rounded-b-2xl">
          <p className="text-sm font-medium text-slate-500">
            Already an Arcade Member?{" "}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Sign In here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}