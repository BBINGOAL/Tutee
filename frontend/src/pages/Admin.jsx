import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
    const { token, isAdmin } = useAuth();
    
    // User Management State
    const [users, setUsers] = useState([]);
    
    // Tutor Management State
    const [tutors, setTutors] = useState([]);
    const [showTutorForm, setShowTutorForm] = useState(false);
    const [tutorForm, setTutorForm] = useState({
        name: '', subjects: '', skill_level: 'Beginner', price_per_hour: 0, 
        experience_years: 0, bio: '', teaching_style: '', availability: []
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        // ดึงข้อมูลเมื่อ component โหลด
        const fetchData = async () => {
            try {
                const userRes = await fetch('http://localhost:5000/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!userRes.ok) throw new Error('Failed to fetch users');
                const userData = await userRes.json();
                setUsers(userData);

                const tutorRes = await fetch('http://localhost:5000/api/admin/tutors', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!tutorRes.ok) throw new Error('Failed to fetch tutors');
                const tutorData = await tutorRes.json();
                setTutors(tutorData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [token, isAdmin]);

    const handleTutorSubmit = async (e) => {
        e.preventDefault();
        try {
            // แปลง subjects กลับเป็น array
            const payload = {
                ...tutorForm,
                subjects: tutorForm.subjects.split(',').map(s => s.trim()).filter(s => s)
            };

            const res = await fetch('http://localhost:5000/api/admin/tutors', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to create tutor');
            const newTutor = await res.json();
            setTutors([newTutor, ...tutors]);
            setShowTutorForm(false);
            setTutorForm({ name: '', subjects: '', skill_level: 'Beginner', price_per_hour: 0, experience_years: 0, bio: '', teaching_style: '', availability: [] });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTutor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tutor?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/tutors/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete tutor');
            setTutors(tutors.filter(t => t.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSyncAI = async () => {
        setSyncing(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/admin/tutors/sync', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to sync with AI');
            const data = await res.json();
            alert(`Sync successful! Processed ${data.details?.synced_tutors || 0} tutors.`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    // ถ้าไม่ได้ล็อกอิน หรือไม่ใช่ admin ให้เตะกลับไปหน้าหลัก
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-cream p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-6">Admin Dashboard</h1>
                    {error && <div className="text-brand-red mb-4 bg-red-100 p-3 rounded">{error}</div>}
                    
                    <h2 className="text-xl font-bold text-text-main mb-4 border-b pb-2">Users Management</h2>
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
                <div>
                    <div className="flex justify-between items-end mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-text-main">Tutors Management</h2>
                        <div className="space-x-3">
                            <button onClick={() => setShowTutorForm(!showTutorForm)} className="px-4 py-2 bg-text-main text-white rounded hover:opacity-90 font-medium">
                                {showTutorForm ? 'Cancel' : '+ Add Tutor'}
                            </button>
                            <button onClick={handleSyncAI} disabled={syncing} className="px-4 py-2 bg-brand-red text-white rounded hover:opacity-90 font-medium disabled:opacity-50">
                                {syncing ? 'Syncing...' : 'Sync to AI'}
                            </button>
                        </div>
                    </div>

                    {showTutorForm && (
                        <form onSubmit={handleTutorSubmit} className="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
                            <h3 className="font-bold text-lg mb-4 text-brand-red">Add New Tutor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm mb-1">Name</label><input required className="w-full border p-2 rounded" value={tutorForm.name} onChange={e=>setTutorForm({...tutorForm, name: e.target.value})} /></div>
                                <div><label className="block text-sm mb-1">Subjects (comma separated)</label><input required className="w-full border p-2 rounded" value={tutorForm.subjects} onChange={e=>setTutorForm({...tutorForm, subjects: e.target.value})} placeholder="Math, Physics" /></div>
                                <div><label className="block text-sm mb-1">Price per Hour</label><input required type="number" className="w-full border p-2 rounded" value={tutorForm.price_per_hour} onChange={e=>setTutorForm({...tutorForm, price_per_hour: e.target.value})} /></div>
                                <div><label className="block text-sm mb-1">Experience Years</label><input required type="number" className="w-full border p-2 rounded" value={tutorForm.experience_years} onChange={e=>setTutorForm({...tutorForm, experience_years: e.target.value})} /></div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm mb-2">Availability (Days)</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <label key={day} className="flex items-center space-x-2 text-sm">
                                                <input 
                                                    type="checkbox" 
                                                    checked={tutorForm.availability.includes(day)}
                                                    onChange={(e) => {
                                                        const newAvailability = e.target.checked 
                                                            ? [...tutorForm.availability, day]
                                                            : tutorForm.availability.filter(d => d !== day);
                                                        setTutorForm({...tutorForm, availability: newAvailability});
                                                    }}
                                                />
                                                <span>{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2"><label className="block text-sm mb-1">Bio</label><textarea className="w-full border p-2 rounded" value={tutorForm.bio} onChange={e=>setTutorForm({...tutorForm, bio: e.target.value})} /></div>
                                <div className="md:col-span-2"><label className="block text-sm mb-1">Teaching Style</label><textarea className="w-full border p-2 rounded" value={tutorForm.teaching_style} onChange={e=>setTutorForm({...tutorForm, teaching_style: e.target.value})} /></div>
                            </div>
                            <button type="submit" className="px-6 py-2 bg-brand-red text-white rounded font-medium">Save Tutor</button>
                        </form>
                    )}

                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-text-main text-white text-sm">
                                    <th className="py-3 px-4 font-semibold">ID</th>
                                    <th className="py-3 px-4 font-semibold">Name</th>
                                    <th className="py-3 px-4 font-semibold">Subjects</th>
                                    <th className="py-3 px-4 font-semibold">Price/Hr</th>
                                    <th className="py-3 px-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-4 text-center">Loading...</td></tr>
                                ) : tutors.length === 0 ? (
                                    <tr><td colSpan="5" className="py-4 text-center">No tutors found.</td></tr>
                                ) : (
                                    tutors.map(tutor => (
                                        <tr key={tutor.id} className="border-b hover:bg-cream-dark">
                                            <td className="py-3 px-4">#{tutor.id}</td>
                                            <td className="py-3 px-4 font-medium">{tutor.name}</td>
                                            <td className="py-3 px-4">{tutor.subjects?.join(', ')}</td>
                                            <td className="py-3 px-4">{tutor.price_per_hour}</td>
                                            <td className="py-3 px-4 space-x-2">
                                                <button onClick={() => handleDeleteTutor(tutor.id)} className="text-red-500 font-medium hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
