import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import RequirementForm from './pages/RequirementForm';
import TutorResults from './pages/TutorResults';
import TuteeChat from './pages/TuteeChat';
import TutorProfile from './pages/TutorProfile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

// Component สำหรับป้องกันการเข้าถึงหน้าที่ต้อง Login
function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isAdmin } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/auth"       element={<Auth />} />
                        
                        {/* Student Routes */}
                        <Route path="/"           element={<ProtectedRoute><Landing /></ProtectedRoute>} />
                        <Route path="/find"       element={<ProtectedRoute><RequirementForm /></ProtectedRoute>} />
                        <Route path="/results"    element={<ProtectedRoute><TutorResults /></ProtectedRoute>} />
                        <Route path="/chat"       element={<ProtectedRoute><TuteeChat /></ProtectedRoute>} />
                        <Route path="/tutor/:id"  element={<ProtectedRoute><TutorProfile /></ProtectedRoute>} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin"      element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </LanguageProvider>
        </AuthProvider>
    );
}
