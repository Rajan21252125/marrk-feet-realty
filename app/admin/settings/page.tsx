'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
                setProfile(prev => ({ ...prev, ...data.profile }));
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
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Profile updated');
                update({
                    name: profile.name,
                    companyName: profile.companyName,
                    image: profile.profileImage
                });
            } else {
                toast.error(data.error || 'Update failed');
            }
        } catch (error) {
            toast.error('Update failed');
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

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="space-y-8 pb-10">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

            {/* Profile Settings */}
            <div className="bg-primary/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" /> Profile Settings
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company Details</label>
                        <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={profile.companyName}
                                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Company Name"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Profile Image URL</label>
                        <input
                            type="text"
                            value={profile.profileImage || ''}
                            onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">New Password (leave blank to keep current)</label>
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={profile.password}
                                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="New Password"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="bg-accent hover:bg-accent/80 text-white mt-4">
                        Save Changes
                    </Button>
                </form>
            </div>

            {/* Admin Management */}
            <div className="bg-primary/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" /> Manage Admins
                </h2>

                {/* Add Admin Form */}
                <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
                    <h3 className="text-lg font-medium text-gray-200 mb-3">Add New Admin</h3>
                    <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={newAdmin.email}
                                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                placeholder="Initial Password"
                            />
                        </div>
                        <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
                            Add Admin
                        </Button>
                    </form>
                    <p className="text-xs text-gray-400 mt-2">* Max 5 admins allowed.</p>
                </div>

                {/* Admins List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="p-3">Profile</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Verified</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300 text-sm">
                            {admins.map((admin) => (
                                <tr key={admin._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                            {admin.profileImage ? (
                                                <img src={admin.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-white bg-accent/50">
                                                    {admin.name ? admin.name[0] : 'A'}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium text-white">{admin.name || 'N/A'}</td>
                                    <td className="p-3">{admin.email}</td>
                                    <td className="p-3 capitalize">{admin.role}</td>
                                    <td className="p-3">
                                        {admin.isVerified ? (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Verified</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">No admins found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
