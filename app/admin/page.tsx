"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  Download,
  Search,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  MapPin,
  Calendar,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  usersByRole: {
    job_seeker: number;
    employer: number;
    mentor: number;
    admin: number;
  };
  recentActivity: Array<{
    id: string;
    type: "user_registration" | "job_posted" | "application_submitted";
    description: string;
    timestamp: string;
    userName?: string;
  }>;
}

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  emailVerified: boolean;
  authProvider: string;
  hasPassword: boolean;
  createdAt: string;
  isActive: boolean;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  remote: boolean;
  status: "active" | "inactive" | "closed";
  applicantCount: number;
  createdAt: string;
  employer: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "jobs" | "analytics" | "export"
  >("overview");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchAdminData();
  }, [user, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch admin statistics with credentials
      const statsResponse = await fetch("/api/admin/stats", {
        credentials: "include",
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        const errorData = await statsResponse.json().catch(() => ({}));
        setError(errorData.error || "Failed to load admin statistics");
        console.error("Stats API error:", statsResponse.status, errorData);
      }

      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch jobs
      const jobsResponse = await fetch("/api/admin/jobs", {
        credentials: "include",
      });
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.jobs || []);
      }
    } catch (error) {
      setError("Failed to load admin data");
      console.error("Admin data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: "users" | "jobs" | "applications") => {
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSuccess(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } exported successfully!`
        );
      } else {
        setError(`Failed to export ${type}`);
      }
    } catch (error) {
      setError(`Error exporting ${type}`);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-primary-600 animate-spin" />
          <p className="mt-2 text-sm text-gray-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-8">
      <div className="container space-y-8">
        {/* Header */}
        <div className="card flex flex-col gap-6 px-6 py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-soft">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="pill mb-3 w-fit bg-primary-50/80 text-primary-600">Admin Control Center</p>
              <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                WorkQit Platform Administration
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="card border border-red-200/70 bg-red-50/70 text-sm font-medium text-red-600">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="card border border-emerald-200/70 bg-emerald-50/70 text-sm font-medium text-emerald-600">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              {success}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="card px-4 py-2">
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Tabs">
            {[
              { id: "overview", name: "Overview", icon: BarChart3 },
              { id: "users", name: "Users", icon: Users },
              { id: "jobs", name: "Jobs", icon: Briefcase },
              { id: "analytics", name: "Analytics", icon: TrendingUp },
              { id: "export", name: "Export", icon: Download },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-50/90 text-primary-600 shadow-soft ring-1 ring-primary-100/80"
                    : "text-slate-500 hover:bg-primary-50/60 hover:text-primary-600"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        {/* Main Content */}
        <div className="space-y-10">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {stats && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: "Total Users",
                      value: stats.totalUsers,
                      icon: Users,
                      accent: "from-primary-500/20 via-primary-500/10 to-primary-500/5 text-primary-600",
                    },
                    {
                      label: "Active Jobs",
                      value: stats.activeJobs,
                      icon: Briefcase,
                      accent: "from-violet-500/20 via-violet-500/10 to-violet-500/5 text-violet-600",
                    },
                    {
                      label: "Applications",
                      value: stats.totalApplications,
                      icon: FileText,
                      accent: "from-sky-500/20 via-sky-500/10 to-sky-500/5 text-sky-600",
                    },
                    {
                      label: "Pending",
                      value: stats.pendingApplications,
                      icon: Activity,
                      accent: "from-amber-500/20 via-amber-500/10 to-amber-500/5 text-amber-600",
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="card hover-lift hover-glow px-6 py-7">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-soft`}>
                          <Icon className="h-6 w-6 animate-float-soft" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-500">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {stats?.recentActivity && (
                <div className="card hover-lift hover-glow p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                  <p className="mt-1 text-sm text-slate-500">Latest events happening across the platform.</p>
                  <div className="mt-5 space-y-4">
                    {stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-subtle"
                      >
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-50/80 text-primary-600">
                          {activity.type === "user_registration" && <UserCheck className="h-4 w-4" />}
                          {activity.type === "job_posted" && <Briefcase className="h-4 w-4" />}
                          {activity.type === "application_submitted" && <FileText className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{activity.description}</p>
                          <p className="mt-1 text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="card hover-lift hover-glow p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
                  <p className="text-sm text-slate-500">Monitor user roles, verification status, and onboarding cadence.</p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-white/60">
                <table className="min-w-full divide-y divide-slate-200/70">
                  <thead className="bg-white/80 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left">User</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/70 bg-white/70 text-sm text-slate-600">
                    {users.slice(0, 10).map((user) => (
                      <tr key={user._id} className="transition-colors duration-150 hover:bg-primary-50/40">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                          </div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`badge-soft ${
                              user.role === "admin"
                                ? "border-rose-200/70 bg-rose-50/80 text-rose-600"
                                : user.role === "employer"
                                ? "border-sky-200/70 bg-sky-50/80 text-sky-600"
                                : "border-emerald-200/70 bg-emerald-50/80 text-emerald-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`badge-soft ${
                              user.emailVerified
                                ? "border-emerald-200/70 bg-emerald-50/80 text-emerald-600"
                                : "border-amber-200/70 bg-amber-50/80 text-amber-600"
                            }`}
                          >
                            {user.emailVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="card hover-lift hover-glow p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Job Management</h3>
                  <p className="text-sm text-slate-500">Track job postings, employer ownership, and application volume.</p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-white/60">
                <table className="min-w-full divide-y divide-slate-200/70">
                  <thead className="bg-white/80 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left">Job</th>
                      <th className="px-6 py-3 text-left">Employer</th>
                      <th className="px-6 py-3 text-left">Applications</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/70 bg-white/70 text-sm text-slate-600">
                    {jobs.slice(0, 10).map((job) => (
                      <tr key={job._id} className="transition-colors duration-150 hover:bg-primary-50/40">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{job.title}</div>
                          <div className="text-xs text-slate-400">{job.company}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-700">
                            {job.employer?.firstName && job.employer?.lastName
                              ? `${job.employer.firstName} ${job.employer.lastName}`
                              : job.employer?.email || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          {job.applicantCount || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`badge-soft ${
                              job.status === "active"
                                ? "border-emerald-200/70 bg-emerald-50/80 text-emerald-600"
                                : job.status === "inactive"
                                ? "border-amber-200/70 bg-amber-50/80 text-amber-600"
                                : "border-rose-200/70 bg-rose-50/80 text-rose-600"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="card hover-lift hover-glow p-6">
                <h3 className="text-lg font-semibold text-slate-900">Platform Analytics</h3>
                <p className="text-sm text-slate-500">Snapshot of account distribution and platform health.</p>
                {stats && (
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-subtle">
                      <h4 className="text-sm font-medium text-slate-500">User Distribution</h4>
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Job Seekers</span>
                          <span className="font-semibold text-slate-800">{stats.usersByRole?.job_seeker || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Employers</span>
                          <span className="font-semibold text-slate-800">{stats.usersByRole?.employer || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Mentors</span>
                          <span className="font-semibold text-slate-800">{stats.usersByRole?.mentor || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Admins</span>
                          <span className="font-semibold text-slate-800">{stats.usersByRole?.admin || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-subtle">
                      <h4 className="text-sm font-medium text-slate-500">Platform Health</h4>
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Active Users</span>
                          <span className="font-semibold text-slate-800">{stats.activeUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Jobs</span>
                          <span className="font-semibold text-slate-800">{stats.activeJobs}</span>
                        </div>
                        <div className="flex items-centered justify-between">
                          <span>Pending Applications</span>
                          <span className="font-semibold text-slate-800">{stats.pendingApplications}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div className="card hover-lift hover-glow p-6">
              <h3 className="text-lg font-semibold text-slate-900">Data Export</h3>
              <p className="text-sm text-slate-500">Export structured datasets for compliance or reporting.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Export Users",
                    description: "Download all user data as CSV",
                    action: () => exportData("users"),
                  },
                  {
                    label: "Export Jobs",
                    description: "Download all job postings as CSV",
                    action: () => exportData("jobs"),
                  },
                  {
                    label: "Export Applications",
                    description: "Download all job applications as CSV",
                    action: () => exportData("applications"),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col justify-between rounded-3xl border border-white/70 bg-white/70 p-5 shadow-subtle"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{item.label}</h4>
                      <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                    </div>
                    <button
                      onClick={item.action}
                      className="btn-primary mt-6 inline-flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
