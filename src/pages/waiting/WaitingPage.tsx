import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { cn } from "../../lib/utils";
import type { AccessRequestStatus } from "../../types";

export function WaitingPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [status, setStatus] = useState<AccessRequestStatus>("pending");
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("access_requests")
        .select("status")
        .eq("player_id", user.id)
        .order("requested_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setStatus(data.status);
        if (data.status === "approved") {
          await refreshProfile();
          navigate("/arcade");
        }
      }
    } catch (err) {
      console.error("Failed to check status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const statusConfig = {
    pending: { label: "Pending Approval", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: "✅" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: "❌" },
    expired: { label: "Expired", color: "bg-slate-100 text-slate-800", icon: "⌛" },
  } as const;

  const currentConfig = statusConfig[status as keyof typeof statusConfig];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Loader size="lg" />
            <p className="text-slate-600">Checking your access request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <span className="text-4xl">{currentConfig.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Access Request</h1>
            <p className="mt-2 text-slate-600">Your request is being reviewed by an admin.</p>
          </div>
          <div className={cn("w-full px-4 py-3 rounded-lg text-center font-medium", currentConfig.color)}>
            {currentConfig.label}
          </div>
          {status === "rejected" && (
            <p className="text-sm text-red-600">Your access request was rejected. Please contact an admin for more information.</p>
          )}
          {status === "expired" && (
            <p className="text-sm text-slate-600">Your access request has expired. You can submit a new one.</p>
          )}
          <div className="flex w-full gap-3">
            <Link to="/">
              <Button variant="outline" className="flex-1">Back to Home</Button>
            </Link>
            {status === "rejected" || status === "expired" ? (
              <Link to="/register">
                <Button className="flex-1">Request Again</Button>
              </Link>
            ) : (
              <Button variant="outline" className="flex-1" disabled>Refresh Status</Button>
            )}
          </div>
          <p className="text-xs text-slate-400">This page auto-refreshes every 5 seconds.</p>
        </CardContent>
      </Card>
    </div>
  );
}