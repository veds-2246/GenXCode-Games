import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Select } from "../../components/ui/Select";
import { Loader } from "../../components/ui/Loader";
import { formatDateTime } from "../../lib/utils";
import type { Profile, AccessRequest, ArcadeSession } from "../../types/domain";
import { SESSION_STATUS } from "../../constants/session";

type RequestFilter = "all" | "pending" | "approved" | "rejected" | "expired";

export function AdminDashboard() {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState<AccessRequest[]>([]);
  const [players, setPlayers] = useState<Profile[]>([]);
  const [sessions, setSessions] = useState<ArcadeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"requests" | "players">("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestFilter>("all");

  const mapProfile = (data: Profile): Profile => ({
    id: data.id,
    name: data.name,
    whatsapp_number: data.whatsapp_number,
    role: data.role,
    created_at: data.created_at,
    updated_at: data.updated_at,
  });

  const mapAccessRequest = (data: {
    id: string;
    player_id: string;
    profiles?: Profile;
    status: string;
    requested_at: string;
    approved_at: string | null;
    approved_by: string | null;
    approved_by_profile?: Profile | null;
  }): AccessRequest => ({
    id: data.id,
    player_id: data.player_id,
    player: data.profiles ? mapProfile(data.profiles) : undefined,
    status: data.status as AccessRequest["status"],
    requested_at: data.requested_at,
    approved_at: data.approved_at,
    approved_by: data.approved_by,
    approved_by_profile: data.approved_by_profile ? mapProfile(data.approved_by_profile) : undefined,
  });

  const mapSession = (data: {
    id: string;
    player_id: string;
    profiles?: Profile;
    started_at: string;
    expires_at: string;
    ended_at: string | null;
    status: string;
    granted_by: string;
    granted_by_profile?: Profile;
  }): ArcadeSession => ({
    id: data.id,
    player_id: data.player_id,
    player: data.profiles ? mapProfile(data.profiles) : undefined,
    started_at: data.started_at,
    expires_at: data.expires_at,
    ended_at: data.ended_at,
    status: data.status as ArcadeSession["status"],
    granted_by: data.granted_by,
    granted_by_profile: data.granted_by_profile ? mapProfile(data.granted_by_profile) : undefined,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const mounted = { current: true };
    try {
      const [{ data: requestsData }, { data: playersData }, { data: sessionsData }] = await Promise.all([
        supabase
          .from("access_requests")
          .select("*, profiles!access_requests_player_id_fkey(*), approved_by_profile:profiles!access_requests_approved_by_fkey(*)")
          .order("requested_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .eq("role", "player")
          .order("created_at", { ascending: false }),
        supabase
          .from("arcade_sessions")
          .select("*, profiles!arcade_sessions_player_id_fkey(*), granted_by_profile:profiles!arcade_sessions_granted_by_fkey(*)")
          .order("started_at", { ascending: false }),
      ]);

      if (mounted.current) {
        if (requestsData) {
          setAllRequests(requestsData.map(mapAccessRequest));
        }
        if (playersData) {
          setPlayers(playersData.map(mapProfile));
        }
        if (sessionsData) {
          setSessions(sessionsData.map(mapSession));
        }
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // loadData handles its own mounted flag to prevent state updates after unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleApproveRequest = useCallback(async (requestId: string) => {
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
  }, [user, loadData]);

  const handleRejectRequest = useCallback(async (requestId: string) => {
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
  }, [user, loadData]);

  const handleCreateSession = useCallback(async (playerId: string) => {
    if (!user) return;
    try {
      const startedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("arcade_sessions")
        .insert({
          player_id: playerId,
          started_at: startedAt,
          expires_at: expiresAt,
          granted_by: user.id,
          status: SESSION_STATUS.ACTIVE,
        });

      if (!error) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  }, [user, loadData]);

  const handleEndSession = useCallback(async (sessionId: string) => {
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
  }, [loadData]);

  const filteredRequests = useMemo(() => {
    return allRequests.filter((request) => {
      const matchesSearch = request.player?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.player?.whatsapp_number.includes(searchQuery);
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allRequests, searchQuery, statusFilter]);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.whatsapp_number.includes(searchQuery)
    );
  }, [players, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { label: "Pending", variant: "warning" as const };
      case "approved": return { label: "Approved", variant: "success" as const };
      case "rejected": return { label: "Rejected", variant: "danger" as const };
      case "expired": return { label: "Expired", variant: "secondary" as const };
      default: return { label: status, variant: "secondary" as const };
    }
  };

  const getSessionStatusBadge = (status: string) => {
    switch (status) {
      case "active": return { label: "Active", variant: "success" as const };
      case "ended": return { label: "Ended", variant: "secondary" as const };
      case "expired": return { label: "Expired", variant: "warning" as const };
      default: return { label: status, variant: "secondary" as const };
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-slate-500">Manage access requests and player sessions</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(["requests", "players"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? "bg-white border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "requests" ? "Access Requests" : "Players & Sessions"}
          </button>
        ))}
      </div>

      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search by name or WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestFilter)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "expired", label: "Expired" },
              ]}
              className="w-48"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  {statusFilter === "pending" ? "No pending requests" : `No ${statusFilter} requests`}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0 flex-1">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{request.player?.name || "Unknown"}</p>
                          <p className="text-xs text-slate-400">{request.player?.whatsapp_number || "No WhatsApp"}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span>Requested:</span>
                          <span className="font-mono">{formatDateTime(request.requested_at)}</span>
                        </div>
                        <Badge variant={getStatusBadge(request.status).variant}>
                          {getStatusBadge(request.status).label}
                        </Badge>
                        {request.approved_at && (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Actioned by:</span>
                            <span>{request.approved_by_profile?.name || "Unknown"}</span>
                            <span className="font-mono">{formatDateTime(request.approved_at)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 sm:ml-auto">
                        {request.status === "pending" && (
                          <>
                            <Button variant="primary" size="sm" onClick={() => handleApproveRequest(request.id)}>
                              Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleRejectRequest(request.id)}>
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <Button variant="outline" size="sm" onClick={() => handleCreateSession(request.player_id)}>
                            Create Session
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "players" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search players by name or WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Players & Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPlayers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No players found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Player</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">WhatsApp</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Request Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Active Session</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Joined</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPlayers.map((player) => {
                        const latestRequest = allRequests.find(r => r.player_id === player.id);
                        const activeSession = sessions.find(s => s.player_id === player.id && s.status === SESSION_STATUS.ACTIVE && new Date(s.expires_at) > new Date());
                        const latestSession = sessions.find(s => s.player_id === player.id);

                        return (
                          <tr key={player.id}>
                            <td className="px-4 py-3 font-medium text-slate-900">{player.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{player.whatsapp_number}</td>
                            <td className="px-4 py-3">
                              {latestRequest ? (
                                <Badge variant={getStatusBadge(latestRequest.status).variant}>
                                  {getStatusBadge(latestRequest.status).label}
                                </Badge>
                              ) : (
                                <span className="text-sm text-slate-400">No request</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {activeSession ? (
                                <>
                                  <Badge variant="success">Active</Badge>
                                  <span className="ml-2 text-sm text-slate-500">Expires: {formatDateTime(activeSession.expires_at)}</span>
                                </>
                              ) : latestSession ? (
                                <Badge variant={getSessionStatusBadge(latestSession.status).variant}>
                                  {getSessionStatusBadge(latestSession.status).label}
                                </Badge>
                              ) : (
                                <span className="text-sm text-slate-400">No session</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">{formatDateTime(player.created_at)}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                {latestRequest?.status === "approved" && !activeSession && (
                                  <Button variant="primary" size="sm" onClick={() => handleCreateSession(player.id)}>
                                    Create Session
                                  </Button>
                                )}
                                {activeSession && (
                                  <Button variant="danger" size="sm" onClick={() => handleEndSession(activeSession.id)}>
                                    End Session
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}