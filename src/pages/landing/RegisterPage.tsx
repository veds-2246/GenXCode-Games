import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDepartments } from "../../hooks";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { departments, loading: deptsLoading } = useDepartments();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp(email, password, {
      name,
      department_id: departmentId,
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Register to join the GenXCode Games Arcade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <Input
              label="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsApp(e.target.value)}
              placeholder="+91 98765 43210"
              required
              autoComplete="tel"
            />
            <Select
              label="Department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              placeholder="Select your department"
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              required
              disabled={deptsLoading}
            />
            <Button type="submit" className="w-full" loading={loading || deptsLoading}>
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-medium text-slate-900 hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}