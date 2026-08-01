import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import CandidateHome from "./pages/CandidateHome.jsx";
import JobEditor from "./pages/JobEditor.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import TrackStatus from "./pages/TrackStatus.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Routes>
          <Route path="/" element={<CandidateHome />} />
          <Route path="/apply/:jobId" element={<ApplyPage />} />
          <Route path="/track" element={<TrackStatus />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs/new" element={<JobEditor />} />
          <Route path="/recruiter/jobs/:jobId/edit" element={<JobEditor />} />
          <Route path="/recruiter/jobs/:jobId/applications" element={<ApplicationsPage />} />
        </Routes>
      </main>
    </div>
  );
}
