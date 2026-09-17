import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
    const { token, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ดึงข้อมูลเมื่อ component โหลด
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }
                
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [token, isAdmin]);

    // ถ้าไม่ได้ล็อกอิน หรือไม่ใช่ admin ให้เตะกลับไปหน้าหลัก
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-cream p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-text-main mb-6">Admin Dashboard</h1>
                
                {error && <div className="text-brand-red mb-4">{error}</div>}
                
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-red text-white text-sm">
                                <th className="py-3 px-4 font-semibold">ID</th>
                                <th className="py-3 px-4 font-semibold">Email</th>
                                <th className="py-3 px-4 font-semibold">Role</th>
                                <th className="py-3 px-4 font-semibold">Registered At</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-text-sub">Loading...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-text-sub">No users found.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="border-b border-border-soft hover:bg-cream-dark transition-colors">
                                        <td className="py-3 px-4 text-text-sub">#{user.id}</td>
                                        <td className="py-3 px-4 font-medium text-text-main">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text-muted">
                                            {new Date(user.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
