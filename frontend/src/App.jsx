import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import RequirementForm from './pages/RequirementForm';
import TutorResults from './pages/TutorResults';
import TuteeChat from './pages/TuteeChat';
import TutorProfile from './pages/TutorProfile';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

export default function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/"           element={<Landing />} />
                        <Route path="/find"       element={<RequirementForm />} />
                        <Route path="/results"    element={<TutorResults />} />
                        <Route path="/chat"       element={<TuteeChat />} />
                        <Route path="/tutor/:id"  element={<TutorProfile />} />
                        <Route path="/auth"       element={<Auth />} />
                        <Route path="/admin"      element={<Admin />} />
                    </Routes>
                </BrowserRouter>
            </LanguageProvider>
        </AuthProvider>
    );
}
