import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSession } from "../../contexts/SessionContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { cn } from "../../lib/utils";
import type { AccessRequestStatus } from "../../types";

export function WaitingPage() {
  const { user, requestAccess, isAdmin } = useAuth();
  const { session, fetchSession } = useSession();
  const navigate = useNavigate();
  const [status, setStatus] = useState<AccessRequestStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  // Admins should never be on the waiting page - redirect them to arcade
  useEffect(() => {
    if (isAdmin) {
      navigate("/arcade", { replace: true });
    }
  }, [isAdmin, navigate]);

  const checkStatus = useCallback(async () => {
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
      } else {
        setStatus(null);
      }
    } catch (err) {
      console.error("Failed to check status:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRequestAccess = async () => {
    setRequesting(true);
    const { error } = await requestAccess();
    if (!error) {
      setStatus("pending");
    }
    setRequesting(false);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await checkStatus();
    };
    init();

    const interval = setInterval(() => {
      if (mounted) {
        checkStatus();
      }
    }, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [checkStatus]);

  useEffect(() => {
    if (status === "approved" && !session) {
      fetchSession();
    }
  }, [status, session, fetchSession]);

  const statusConfig = {
    pending: { label: "Pending Approval", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: "✅" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: "❌" },
    expired: { label: "Expired", color: "bg-slate-100 text-slate-800", icon: "⌛" },
  } as const;

  const currentConfig = status ? statusConfig[status as keyof typeof statusConfig] : null;

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

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2H6a2 2 0 002-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">No Access Request</h1>
              <p className="mt-2 text-slate-600">You haven't requested access to the arcade yet.</p>
            </div>
            <Button className="w-full" size="lg" onClick={handleRequestAccess} loading={requesting}>
              Request Access
            </Button>
            <Link to="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
            <p className="text-xs text-slate-400">An admin will review your request and grant access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isApproved = status === "approved";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <span className="text-4xl">{currentConfig!.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Access Request</h1>
            {isApproved ? (
              <p className="mt-2 text-slate-600">Your request has been approved! You can now access the arcade.</p>
            ) : (
              <p className="mt-2 text-slate-600">Your request is being reviewed by an admin.</p>
            )}
          </div>
          <div className={cn("w-full px-4 py-3 rounded-lg text-center font-medium", currentConfig!.color)}>
            {currentConfig!.label}
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
              <Button className="flex-1" onClick={handleRequestAccess} loading={requesting}>
                Request Again
              </Button>
            ) : isApproved ? (
              <Link to="/arcade">
                <Button className="flex-1" size="lg">Enter Arcade</Button>
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