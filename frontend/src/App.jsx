import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AiAssistantPage from "./pages/AiAssistantPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import DashboardPage from "./pages/DashboardPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import LoginPage from "./pages/LoginPage";
import SchedulePage from "./pages/SchedulePage";
import SignupPage from "./pages/SignupPage";
import StudyMaterialsPage from "./pages/StudyMaterialsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assistant" element={<AiAssistantPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/study-materials" element={<StudyMaterialsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
