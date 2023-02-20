import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/protected_routes/ProtectedRoute";
import ProtectedRouteAuthenticated from "./components/protected_routes/ProtectedRouteAuthenticated";
import ReplaceFirstPasswordPage from "./pages/ReplaceFirstPasswordPage";
import HeroPage from "./pages/HeroPage";
import DashboardRoute from "./components/DashboardRoute";
import Settings from "./pages/dashboard/Settings";
import ProtectedRouteRole from "./components/protected_routes/ProtectedRouteRole";
import Dashboard from "./pages/dashboard/Dashboard";
import ManageClasses from "./pages/dashboard/admin/ManageClasses";
import ManageStudents from "./pages/dashboard/admin/ManageStudents";
import ManageEmployees from "./pages/dashboard/admin/ManageEmployees";
import ManageUsers from "./pages/dashboard/admin/ManageUsers";
import ManageUsersCreate from "./pages/dashboard/admin/ManageUsersCreate";
import ManageClassesCreate from "./pages/dashboard/admin/ManageClassesCreate";
import ManageSubjects from "./pages/dashboard/admin/ManageSubjects";
import ManageSubjectsCreate from "./pages/dashboard/admin/ManageSubjectsCreate";
import ManageSubjectsCreateList from "./pages/dashboard/admin/ManageSubjectsCreateList";
import ManageClassrooms from "./pages/dashboard/admin/ManageClassrooms";
import ManageClassroomsCreate from "./pages/dashboard/admin/ManageClassroomsCreate";
import ManageSchoolHours from "./pages/dashboard/admin/ManageSchoolHours";
import ManageSchoolHoursCreate from "./pages/dashboard/admin/ManageSchoolHoursCreate";
import ManageSubjectLists from "./pages/dashboard/admin/ManageSubjectLists";
import EmployeeTimetablePage from "./components/timetable/EmployeeTimetablePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HeroPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/replace-first-password" element={<ProtectedRoute outlet={<ReplaceFirstPasswordPage />} />} />

          <Route path="/dashboard" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Dashboard />} />} />} />
          <Route path="/dashboard/settings" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Settings />} />} />} />

          <Route path="/dashboard/my-timetable" element={<ProtectedRouteRole outlet={<DashboardRoute element={<EmployeeTimetablePage />} />} authorizedRoles={["employee"]} />} />

          <Route path="/dashboard/manage-classrooms" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClassrooms />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-classrooms/create" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClassroomsCreate />} />} authorizedRoles={["admin"]} />} />

          <Route path="/dashboard/manage-classes" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClasses />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-classes/create" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClassesCreate />} />} authorizedRoles={["admin"]} />} />

          <Route path="/dashboard/manage-school-hours" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSchoolHours />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-school-hours/create" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSchoolHoursCreate />} />} authorizedRoles={["admin"]} />} />

          <Route path="/dashboard/manage-students" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageStudents />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-employees" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageEmployees />} />} authorizedRoles={["admin"]} />} />

          <Route path="/dashboard/manage-subjects" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjects />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-subjects/create" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjectsCreate />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-subjects/lists" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjectLists />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-subjects/create-list" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjectsCreateList />} />} authorizedRoles={["admin"]} />} />

          <Route path="/dashboard/manage-users" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageUsers />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/manage-users/create" element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageUsersCreate />} />} authorizedRoles={["admin"]} />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
