"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { 
    Calendar, 
    CheckCircle2, 
    Mail, 
    Phone, 
    Shield, 
    UserRound, 
    Save, 
    Lock,
    KeyRound
} from "lucide-react";
import { getProfile, updateProfile, updatePassword } from "@/services/user-service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth-slice";
import gsap from "gsap";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const elementsRef = useRef([]);

    // Profile Edit States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);

    // Password Change States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        getProfile()
            .then((data) => {
                setProfile(data);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone || "");
            })
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(elementsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [loading]);

    const initials = useMemo(() => {
        if (!profile?.name) return "?";
        return profile.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    }, [profile?.name]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            setProfileError("Name and Email are required fields.");
            return;
        }

        try {
            setSavingProfile(true);
            setProfileError("");
            setProfileSuccess("");

            const updated = await updateProfile({ name, email, phone });
            setProfile(updated);
            dispatch(setCredentials(updated));
            setProfileSuccess("Profile updated successfully!");
        } catch (err) {
            setProfileError(err?.response?.data?.message || "Failed to update profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordError("All password fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }

        try {
            setSavingPassword(true);
            setPasswordError("");
            setPasswordSuccess("");

            await updatePassword({ oldPassword, newPassword });
            setPasswordSuccess("Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(err?.response?.data?.message || "Failed to change password. Double check current password.");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-slate-200/60 bg-white shadow-sm">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 surface-card rounded-[24px] border border-dashed border-rose-200 bg-rose-50/50">
                <UserRound className="size-8 text-rose-500" />
                <h1 className="text-xl font-bold text-slate-900">Profile unavailable</h1>
                <p className="text-sm text-slate-600">Login is required to view dashboard details.</p>
            </div>
        );
    }

    const memberSince = new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={containerRef}>
            {/* Profile Overview Header */}
            <div 
                ref={el => elementsRef.current[0] = el}
                className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm flex flex-col md:flex-row items-center gap-6"
            >
                <div className="flex items-center justify-center font-extrabold text-white text-3xl size-20 bg-indigo-600 rounded-[20px] shadow-sm shrink-0">
                    {initials}
                </div>
                <div className="min-w-0 flex-1 space-y-2 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">{profile.name}</h1>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                            <Shield className="size-3.5" /> {profile.role}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Account overview, contact identity, and dashboard access status. Member since {memberSince}.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="size-4 text-emerald-500" /> Active
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Edit Profile Form */}
                <form 
                    ref={el => elementsRef.current[1] = el}
                    onSubmit={handleProfileSubmit} 
                    className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm space-y-6"
                >
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                            <UserRound className="size-5 text-indigo-500 shrink-0" /> Edit Personal Information
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Update your public profile contact settings.</p>
                    </div>

                    {profileSuccess && (
                        <div className="rounded-[16px] border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
                            {profileSuccess}
                        </div>
                    )}
                    {profileError && (
                        <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                            {profileError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">Full Name</span>
                            <input 
                                className="w-full rounded-[12px] border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">Email Address</span>
                            <input 
                                className="w-full rounded-[12px] border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">Mobile Number</span>
                            <input 
                                className="w-full rounded-[12px] border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                type="tel"
                                placeholder="10-digit Indian Mobile Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="landing-primary-button w-full shadow-sm"
                        disabled={savingProfile}
                    >
                        {savingProfile ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <Save className="size-4 shrink-0" />
                        )}
                        {savingProfile ? "Saving Profile..." : "Save Profile Details"}
                    </button>
                </form>

                {/* Change Password Form */}
                <form 
                    ref={el => elementsRef.current[2] = el}
                    onSubmit={handlePasswordSubmit} 
                    className="surface-card p-6 md:p-8 rounded-[24px] border border-slate-200/60 bg-white shadow-sm space-y-6"
                >
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                            <Lock className="size-5 text-indigo-500 shrink-0" /> Update Password
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Change your security password settings to keep your account safe.</p>
                    </div>

                    {passwordSuccess && (
                        <div className="rounded-[16px] border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
                            {passwordSuccess}
                        </div>
                    )}
                    {passwordError && (
                        <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                            {passwordError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">Current Password</span>
                            <input 
                                className="w-full rounded-[12px] border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                type="password"
                                placeholder="Current Security Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">New Password</span>
                            <input 
                                className="w-full rounded-[12px] border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                type="password"
                                placeholder="New Password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold text-slate-700">Confirm New Password</span>
                            <input 
                                className="w-full rounded-[12px] border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="landing-secondary-button w-full shadow-sm bg-slate-900 text-white border-transparent hover:bg-indigo-600"
                        disabled={savingPassword}
                    >
                        {savingPassword ? (
                            <span className="loading loading-spinner loading-sm text-white"></span>
                        ) : (
                            <KeyRound className="size-4 shrink-0" />
                        )}
                        {savingPassword ? "Changing Password..." : "Change Security Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
