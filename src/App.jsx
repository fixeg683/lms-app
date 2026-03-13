import { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Icon, Icons, Toast, Spinner } from "./components/ui";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // New Import
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import SubjectsPage from "./pages/SubjectsPage";
import GradesPage from "./pages/GradesPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import ExamInstancesPage from "./pages/ExamInstancesPage";
import CorrectionsPage from "./pages/CorrectionsPage";
import ClassesPage from "./pages/ClassesPage";

// ... (useToast and AdminOnly functions remain the same as your snippet)

function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "info" });
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "info" }), 3500);
  }, []);
  return [toast, showToast];
}

function AdminOnly({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// ── ProtectedLayout ─────────────────────────────────────────────────────────
function ProtectedLayout() {
  const { user, loading, logout, isAdmin } = useAuth();
  const [toast, showToast] = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;

  const adminNav = [
    { path: "/", label: "Dashboard", icon: Icons.dashboard, end: true },
    { path: "/students", label: "Students", icon: Icons.students },
    { path: "/subjects", label: "Subjects", icon: Icons.book },
    { path: "/grades", label: "Grades", icon: Icons.grades },
    { path: "/users", label: "Users", icon: Icons.users },
    { path: "/classes", label: "Classes", icon: Icons.users },
    { path: "/exam-instances", label: "Exam Instances", icon: Icons.clipboard },
    { path: "/corrections", label: "Corrections", icon: Icons.edit },
    { path: "/reports", label: "Reports", icon: Icons.reports },
  ];

  const teacherNav = [
    { path: "/", label: "Dashboard", icon: Icons.dashboard, end: true },
    { path: "/grades", label: "My Grades", icon: Icons.grades },
    { path: "/reports", label: "Reports", icon: Icons.reports },
  ];

  const navItems = isAdmin ? adminNav : teacherNav;

  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Sidebar logic remains same as your original App.jsx */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex-col z-30">
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Icon d={Icons.award} size={20} color="white" />
                </div>
                <div>
                    <p className="text-sm font-black text-gray-900 leading-tight">EduManage Pro</p>
                    <p className="text-xs text-gray-400">Exam Management</p>
                </div>
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <Icon d={item.icon} size={18} color={isActive ? "white" : "currentColor"} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-3">
            <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <Icon d={Icons.logout} size={16} color="#dc2626" /> Logout
            </button>
        </div>
      </aside>

      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-5 lg:p-8 max-w-6xl mx-auto">
          <Outlet context={{ onToast: showToast }} />
        </div>
      </main>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}

// ── Helper Wrappers (Simplified for brevity) ─────────────────────────────────
import { useOutletContext } from "react-router-dom";
const withToast = (Component) => {
    return () => {
        const { onToast } = useOutletContext();
        return <Component onToast={onToast} />;
    };
};

const StudentsRoute = withToast(StudentsPage);
const SubjectsRoute = withToast(SubjectsPage);
const GradesRoute = withToast(GradesPage);
const ReportsRoute = withToast(ReportsPage);
const UsersRoute = withToast(UsersPage);
const ExamInstancesRoute = withToast(ExamInstancesPage);
const CorrectionsRoute = withToast(CorrectionsPage);
const ClassesRoute = withToast(ClassesPage);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthGuard children={<LoginPage />} />} />
          <Route path="/signup" element={<AuthGuard children={<SignupPage />} />} />
          <Route path="/*" element={<ProtectedLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentsRoute />} />
            <Route path="subjects" element={<SubjectsRoute />} />
            <Route path="grades" element={<GradesRoute />} />
            <Route path="reports" element={<ReportsRoute />} />
            <Route path="users" element={<AdminOnly><UsersRoute /></AdminOnly>} />
            <Route path="exam-instances" element={<AdminOnly><ExamInstancesRoute /></AdminOnly>} />
            <Route path="corrections" element={<AdminOnly><CorrectionsRoute /></AdminOnly>} />
            <Route path="classes" element={<AdminOnly><ClassesRoute /></AdminOnly>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}