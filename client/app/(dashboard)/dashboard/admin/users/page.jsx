"use client";

import { useEffect, useState, useRef } from "react";
import { getAdminUsers, updateAdminUser, deleteAdminUser } from "@/services/user-service";
import { Pencil, Trash2, Shield, X, Save, Phone, Mail, UserRound } from "lucide-react";
import gsap from "gsap";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Edit Form States
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editRole, setEditRole] = useState("USER");
    const [saveLoading, setSaveLoading] = useState(false);
    const [modalError, setModalError] = useState("");

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef([]);

    const loadUsers = () => {
        setLoading(true);
        getAdminUsers()
            .then(setUsers)
            .catch(() => setError("Failed to fetch platform users list."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (loading || users.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            gsap.fromTo(listRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading, users]);

    // Handle Edit Click
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditPhone(user.phone || "");
        setEditRole(user.role || "USER");
        setModalError("");
        setIsEditOpen(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editName.trim() || !editEmail.trim()) {
            setModalError("Name and Email are required fields.");
            return;
        }

        try {
            setSaveLoading(true);
            setModalError("");
            
            await updateAdminUser(selectedUser.id, {
                name: editName,
                email: editEmail,
                phone: editPhone || null
            }, editRole);

            setIsEditOpen(false);
            loadUsers();
        } catch (err) {
            setModalError(err?.response?.data?.message || "Failed to update user profile.");
        } finally {
            setSaveLoading(false);
        }
    };

    // Handle Delete Click
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    // Handle Delete Action
    const handleDeleteConfirm = async () => {
        try {
            setSaveLoading(true);
            await deleteAdminUser(selectedUser.id);
            setIsDeleteOpen(false);
            loadUsers();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete user from database.");
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="space-y-6" ref={containerRef}>
            {/* Header section */}
            <div className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm" ref={headerRef}>
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">User Management</h1>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Manage accounts, permissions, roles, and profile settings for seekers, owners, and administrators.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Table section */}
            <div className="surface-card overflow-hidden p-0 rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                {error && (
                    <div className="m-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                        <span className="loading loading-spinner loading-md text-indigo-500"></span>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading user profiles...</p>
                    </div>
                ) : users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {users.map((user, i) => (
                                    <tr key={user.id} ref={el => listRef.current[i] = el} className="hover:bg-slate-50/50 transition duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                            {user.phone || "No phone added"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                user.role === "ADMIN" 
                                                    ? "border border-amber-200 bg-amber-50 text-amber-700" 
                                                    : user.role === "OWNER" 
                                                        ? "border border-cyan-200 bg-cyan-50 text-cyan-700" 
                                                        : "border border-slate-200 bg-slate-50 text-slate-700"
                                            }`}>
                                                {user.role === "ADMIN" && <Shield className="size-3 shrink-0" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 shrink-0">
                                                <button 
                                                    onClick={() => handleEditClick(user)}
                                                    className="flex items-center gap-1 rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
                                                    title="Edit user details"
                                                >
                                                    <Pencil className="size-3.5 shrink-0" />
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="flex items-center gap-1 rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-100"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="size-3.5 shrink-0" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center py-12 text-center bg-slate-50">
                        <UserRound className="mx-auto mb-3 size-12 shrink-0 text-slate-300" />
                        <p className="font-medium text-slate-600">No users found.</p>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="surface-card max-w-md w-full p-6 md:p-8 space-y-6 rounded-[24px] border border-slate-200/60 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                <UserRound className="size-5 shrink-0 text-indigo-500" /> Edit User Profile
                            </h2>
                            <button 
                                onClick={() => setIsEditOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                <X className="size-5 shrink-0" />
                            </button>
                        </div>

                        {modalError && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</span>
                                <input 
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    type="text"
                                    required
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</span>
                                <input 
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    type="email"
                                    required
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Mobile Number</span>
                                <input 
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Access Role</span>
                                <select 
                                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                >
                                    <option value="USER">USER (Accommodation Seeker)</option>
                                    <option value="OWNER">OWNER (Property Manager)</option>
                                    <option value="ADMIN">ADMIN (Super Administrator)</option>
                                </select>
                            </label>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="flex-1 rounded-[12px] border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                                    disabled={saveLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                                    disabled={saveLoading}
                                >
                                    <Save className="size-4 shrink-0" />
                                    {saveLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="surface-card max-w-md w-full p-6 md:p-8 space-y-6 rounded-[24px] border border-slate-200/60 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-center space-y-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600 mx-auto">
                                <Trash2 className="size-7 shrink-0" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-extrabold text-slate-900">Confirm User Deletion</h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    Are you sure you want to permanently delete user <span className="font-semibold text-rose-600">&quot;{selectedUser?.name}&quot;</span>?
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 font-semibold text-amber-800">
                            ⚠️ Warning: Deleting this user will immediately remove all properties, inquiries, and subscription listings associated with this account. This action cannot be undone.
                        </div>

                        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                            <button 
                                type="button"
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 rounded-[12px] border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                                disabled={saveLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-rose-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                                disabled={saveLoading}
                            >
                                {saveLoading ? "Deleting..." : "Permanently Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
