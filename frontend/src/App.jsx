import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import FaceRegister from "./pages/FaceRegister";
import AttendancePage from "./pages/AttendancePage";

import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profilepage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/face-register" element={<FaceRegister />} />

      {/* Dashboard Layout Wrapper */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>

      <Route path="/profile" element={<DashboardLayout />}>
        <Route index element={<ProfilePage />} />
      </Route>

      <Route path="/settings" element={<DashboardLayout />}>
        <Route index element={<SettingsPage />} />
      </Route>

      <Route path="/attendance" element={<DashboardLayout />}>
        <Route index element={<AttendancePage />} />
      </Route>

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}

export default App;