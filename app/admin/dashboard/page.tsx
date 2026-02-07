import Link from 'next/link';
import { Building, Eye, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-dark">Dashboard</h1>
                <Link href="/admin/properties/add">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                            <h3 className="text-2xl font-bold">12</h3>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20">
                            <Building className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-green-600 font-medium">+2 this month</p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                            <h3 className="text-2xl font-bold">8</h3>
                        </div>
                        <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">4 drafted</p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                            <h3 className="text-2xl font-bold">1,240</h3>
                        </div>
                        <div className="rounded-full bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20">
                            <Eye className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-green-600 font-medium">+12% from last week</p>
                </div>
            </div>

            {/* Recent Activity / Properties */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-bold text-primary-dark">Recent Properties</h2>
                    <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="p-6">
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Property</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">Luxury Villa with Sea View</td>
                                    <td className="p-4 align-middle">Beverly Hills, CA</td>
                                    <td className="p-4 align-middle">$1,250,000</td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-9000 dark:text-green-300">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">Modern Downtown Apartment</td>
                                    <td className="p-4 align-middle">New York, NY</td>
                                    <td className="p-4 align-middle">$850,000</td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-9000 dark:text-yellow-300">
                                            Draft
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
