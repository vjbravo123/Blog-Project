"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  ShieldCheck, 
  PenTool, 
  UserCheck, 
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Lock,
  Mail,
  User as UserIcon,
  Filter,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { format } from "date-fns";

// --- Types ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "author" | "admin";
  isActive: boolean;
  createdAt: string;
  image?: string;
}

interface Stats {
  total: number;
  active: number;
  admins: number;
  authors: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user", isActive: true });
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch Data ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ search, role: roleFilter });
      const res = await fetch(`/api/admin/users?${query}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setStats(data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
        resetForm();
      } else {
        alert("Failed to save user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure? This action cannot be undone.")) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: "", 
      role: user.role,
      isActive: user.isActive 
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "user", isActive: true });
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">User Management</h1>
          <p className="text-sm text-zinc-500">Manage permissions and view user activity.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* --- STATS CARDS --- */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.total} icon={Users} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
          <StatCard label="Active Users" value={stats.active} icon={UserCheck} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" />
          <StatCard label="Administrators" value={stats.admins} icon={ShieldCheck} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" />
          <StatCard label="Authors" value={stats.authors} icon={PenTool} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
        </div>
      )}

      {/* --- FILTERS --- */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="author">Authors</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">User Profile</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-zinc-100 dark:bg-zinc-800 rounded"/></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-800 rounded"/></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-zinc-100 dark:bg-zinc-800 rounded"/></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-800 rounded"/></td>
                    <td className="px-6 py-4"/>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold overflow-hidden">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover"/>
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                          <div className="text-xs text-zinc-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 
                          user.role === 'author' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                          <CheckCircle2 size={14} /> Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                          <XCircle size={14} /> Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(user)} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SLIDE-OVER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {editingUser ? "Edit User" : "Create New User"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-indigo-500" placeholder="Jane Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-indigo-500" placeholder="jane@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex justify-between">
                  Password
                  {editingUser && <span className="text-xs font-normal text-zinc-500">(Leave empty to keep)</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-indigo-500" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {['user', 'author', 'admin'].map((role) => (
                    <button key={role} type="button" onClick={() => setFormData({...formData, role: role})} className={`px-2 py-2 rounded-lg text-sm font-medium border capitalize ${formData.role === role ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white dark:bg-zinc-900 border-zinc-200 text-zinc-600'}`}>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Account Active</span>
                <button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl disabled:opacity-70 mt-4">
                {isSaving ? "Saving..." : "Save User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Sub-component for Stats
function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}