import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { formatDateTime } from "../../lib/utils";
import type { ArcadeSession, Profile, AccessRequest, UserRole } from "../../types/domain";
import { SESSION_STATUS } from "../../constants";

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ArcadeSession[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [players, setPlayers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sessions" | "requests" | "players">("sessions");
  const [searchQuery, setSearchQuery] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/arcade");
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: sessionsData }, { data: requestsData }, { data: playersData }] = await Promise.all([
        supabase.from("arcade_sessions").select("*, profiles!arcade_sessions_player_id_fkey(*, departments(*)), granted_by_profile:profiles!arcade_sessions_granted_by_fkey(*)").order("started_at", { ascending: false }),
        supabase.from("access_requests").select("*, profiles!access_requests_player_id_fkey(*, departments(*)), approved_by_profile:profiles!access_requests_approved_by_fkey(*)").eq("status", "pending").order("requested_at", { ascending: false }),
        supabase.from("profiles").select("*, departments(*)").eq("role", "player").order("created_at", { ascending: false }),
      ]);

      if (sessionsData) {
        setSessions(sessionsData.map(mapSession));
      }
      if (requestsData) {
        setPendingRequests(requestsData.map(mapAccessRequest));
      }
      if (playersData) {
        setPlayers(playersData.map(mapProfile));
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapSession = (data: any): ArcadeSession => ({
    id: data.id,
    player_id: data.player_id,
    player: data.profiles ? mapProfile(data.profiles) : undefined,
    started_at: data.started_at,
    expires_at: data.expires_at,
    ended_at: data.ended_at,
    status: data.status,
    granted_by: data.granted_by,
    granted_by_profile: data.granted_by_profile ? mapProfile(data.granted_by_profile) : undefined,
  });

  const mapProfile = (data: any): Profile => ({
    id: data.id,
    name: data.name,
    department_id: data.department_id,
    department: data.departments ? {
      id: data.departments.id,
      name: data.departments.name,
      slug: data.departments.slug,
      is_active: data.departments.is_active,
      created_at: data.departments.created_at,
    } : undefined,
    whatsapp_number: data.whatsapp_number,
    role: data.role as UserRole,
    created_at: data.created_at,
    updated_at: data.updated_at,
  });

  const mapAccessRequest = (data: any): AccessRequest => ({
    id: data.id,
    player_id: data.player_id,
    player: data.profiles ? mapProfile(data.profiles) : undefined,
    status: data.status,
    requested_at: data.requested_at,
    approved_at: data.approved_at,
    approved_by: data.approved_by,
    approved_by_profile: data.approved_by_profile ? mapProfile(data.approved_by_profile) : undefined,
  });

  const handleCreateSession = async () => {
    if (!targetPlayerId || !user) return;
    setCreatingSession(true);
    try {
      const startedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("arcade_sessions")
        .insert({
          player_id: targetPlayerId,
          started_at: startedAt,
          expires_at: expiresAt,
          granted_by: user.id,
          status: SESSION_STATUS.ACTIVE,
        });

      if (!error) {
        setTargetPlayerId("");
        loadData();
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: user.id,
        })
        .eq("id", requestId);

      if (!error) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to approve request:", err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({
          status: "rejected",
          approved_at: new Date().toISOString(),
          approved_by: user.id,
        })
        .eq("id", requestId);

      if (!error) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("arcade_sessions")
        .update({
          status: SESSION_STATUS.ENDED,
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (!error) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  if (!isAdmin) return null;
  if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>;

  const filteredSessions = sessions.filter((s) =>
    s.player?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-slate-500">Manage sessions, access requests, and players</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(["sessions", "requests", "players"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? "bg-white border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "sessions" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Arcade Sessions</CardTitle>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Player ID"
                value={targetPlayerId}
                onChange={(e) => setTargetPlayerId(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleCreateSession} loading={creatingSession}>
                Create Session
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Started</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Expires</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Granted By</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{session.player?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-slate-600">{session.player?.department?.name || "N/A"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          session.status === "active" ? "success" :
                          session.status === "ended" ? "secondary" : "warning"
                        }>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDateTime(session.started_at)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDateTime(session.expires_at)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{session.granted_by_profile?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-right">
                        {session.status === "active" && (
                          <Button variant="danger" size="sm" onClick={() => handleEndSession(session.id)}>
                            End
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "requests" && (
        <Card>
          <CardHeader><CardTitle>Pending Access Requests</CardTitle></CardHeader>
          <CardContent className="p-0">
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No pending requests</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{request.player?.name || "Unknown"}</p>
                        <p className="text-sm text-slate-500">{request.player?.department?.name || "N/A"}</p>
                        <p className="text-xs text-slate-400">Requested: {formatDateTime(request.requested_at)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleApproveRequest(request.id)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleRejectRequest(request.id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "players" && (
        <Card>
          <CardHeader><CardTitle>Players</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">WhatsApp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{player.name}</td>
                      <td className="px-4 py-3 text-slate-600">{player.department?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{player.whatsapp_number}</td>
                      <td className="px-4 py-3">
                        <Badge variant={player.role === "admin" ? "success" : "secondary"}>
                          {player.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDateTime(player.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}