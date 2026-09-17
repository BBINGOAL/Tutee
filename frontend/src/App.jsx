import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Landing from './pages/Landing';
import RequirementForm from './pages/RequirementForm';
import TutorResults from './pages/TutorResults';
import TuteeChat from './pages/TuteeChat';
import TutorProfile from './pages/TutorProfile';

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/"           element={<Landing />} />
                    <Route path="/find"       element={<RequirementForm />} />
                    <Route path="/results"    element={<TutorResults />} />
                    <Route path="/chat"       element={<TuteeChat />} />
                    <Route path="/tutor/:id"  element={<TutorProfile />} />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    );
}
