'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { User, Building, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: '',
        companyName: '',
        profileImage: '',
        password: '',
    });
    const [admins, setAdmins] = useState<any[]>([]);
    const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.profile) {
                setProfile(prev => ({ ...prev, ...data.profile, password: '' })); // Ensure password is empty
            }
            if (data.admins) {
                setAdmins(data.admins);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load settings');
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Saving changes...');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.reAuthRequired) {
                    toast.success('Password updated. Please sign in again to verify.', { id: toastId });
                    setTimeout(() => {
                        signOut({ callbackUrl: '/admin/login' });
                    }, 1500);
                } else {
                    toast.success('Profile updated successfully', { id: toastId });
                    update({
                        name: profile.name,
                        image: profile.profileImage
                    });
                    setProfile(prev => ({ ...prev, password: '' }));
                }
            } else {
                toast.error(data.error || 'Update failed', { id: toastId });
            }
        } catch (error) {
            toast.error('Update failed', { id: toastId });
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdmin),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Admin added successfully');
                setNewAdmin({ email: '', password: '' });
                fetchSettings(); // Refresh list
            } else {
                toast.error(data.error || 'Failed to add admin');
            }
        } catch (error) {
            toast.error('Failed to add admin');
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/admins/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Admin deleted successfully');
                fetchSettings(); // Refresh list
            } else {
                toast.error(data.error || 'Failed to delete admin');
            }
        } catch (error) {
            toast.error('Failed to delete admin');
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your profile and admin access</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="bg-primary/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/20 text-accent">
                            <User className="w-5 h-5" />
                        </div>
                        Profile Settings
                    </h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-gray-600"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Profile Image URL</label>
                                <input
                                    type="text"
                                    value={profile.profileImage || ''}
                                    onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-gray-600"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        value={profile.password}
                                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-gray-600"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent/80 text-white py-6 rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                        >
                            Save Changes
                        </Button>
                    </form>
                </div>

                {/* Admin Management */}
                <div className="space-y-6">
                    <div className="bg-primary/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                <User className="w-5 h-5" />
                            </div>
                            Manage Admins
                        </h2>

                        {/* Add Admin Form */}
                        <div className="bg-white/5 rounded-xl border border-white/5 p-5 mb-8">
                            <h3 className="text-sm font-semibold text-gray-200 mb-4 uppercase tracking-wider">Add New Admin</h3>
                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={newAdmin.password}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        placeholder="Initial Password"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                    Add Admin
                                </Button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3 text-center">* Limit of 5 admins per workspace.</p>
                        </div>

                        {/* Admins List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Existing Admins</h3>
                            <div className="space-y-3">
                                {admins.map((admin) => (
                                    <div key={admin._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                                {admin.profileImage ? (
                                                    <img src={admin.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-400">{admin.name ? admin.name[0] : 'A'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-white">{admin.name || 'Unavailable'}</p>
                                                    {admin.isVerified && (
                                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" title="Verified"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400">{admin.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 rounded-full"
                                            disabled={session?.user?.email === admin.email}
                                            // Only show/enable delete if current user is super admin
                                            style={{ display: session?.user?.email === 'grajan408@gmail.com' ? 'inline-flex' : 'none' }}
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
                                                    handleDeleteAdmin(admin._id);
                                                }
                                            }}
                                            title="Delete Admin"
                                        >
                                            <span className="sr-only">Delete</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </Button>
                                    </div>
                                ))}
                                {admins.length === 0 && (
                                    <div className="text-center py-4 text-gray-500 text-sm">No admins found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
