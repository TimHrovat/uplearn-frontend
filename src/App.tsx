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
import ManageGrades from "./pages/dashboard/employee/ManageGrades";
import GradesPage from "./pages/dashboard/student/GradesPage";
import ResetPasswordPromptPage from "./pages/ResetPasswordPromptPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpcomingGradings from "./pages/dashboard/student/UpcomingGradings";
import UpcomingEvents from "./pages/dashboard/student/UpcomingEvents";
import Absences from "./pages/dashboard/student/Absences";
import ManageAbsences from "./pages/dashboard/employee/ManageAbsences";
import EmployeeGrades from "./pages/dashboard/student/EmployeeGrades";
import MyPerformance from "./pages/dashboard/employee/MyPerformance";
import EmployeePerformance from "./pages/dashboard/admin/EmployeePerformance";
import ExcelUserImport from "./pages/dashboard/admin/ExcelUserImport";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HeroPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password-prompt" element={<ResetPasswordPromptPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/auth/replace-first-password" element={<ProtectedRoute outlet={<ReplaceFirstPasswordPage />} />} />

          <Route path="/dashboard" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Dashboard />} />} />} />
          <Route path="/dashboard/settings" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Settings />} />} />} />

          <Route
            path="/dashboard/my-grades"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<GradesPage />} />} authorizedRoles={["student"]} />}
          />
          <Route
            path="/dashboard/upcoming-gradings"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<UpcomingGradings />} />} authorizedRoles={["student"]} />}
          />
          <Route
            path="/dashboard/upcoming-events"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<UpcomingEvents />} />} authorizedRoles={["student"]} />}
          />
          <Route path="/dashboard/absences" element={<ProtectedRouteRole outlet={<DashboardRoute element={<Absences />} />} authorizedRoles={["student"]} />} />
          <Route
            path="/dashboard/grade-employees"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<EmployeeGrades />} />} authorizedRoles={["student"]} />}
          />

          <Route
            path="/dashboard/my-timetable"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<EmployeeTimetablePage />} />} authorizedRoles={["employee"]} />}
          />
          <Route
            path="/dashboard/my-performance"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<MyPerformance />} />} authorizedRoles={["employee"]} />}
          />
          <Route
            path="/dashboard/manage-grades"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageGrades />} />} authorizedRoles={["employee", "admin"]} />}
          />
          <Route
            path="/dashboard/manage-absences"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageAbsences />} />} authorizedRoles={["employee", "admin"]} />}
          />

          <Route
            path="/dashboard/manage-classrooms"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClassrooms />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-classrooms/create"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClassroomsCreate />} />} authorizedRoles={["admin"]} />}
          />

          <Route
            path="/dashboard/manage-classes"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClasses />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-classes/create"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageClassesCreate />} />} authorizedRoles={["admin"]} />}
          />

          <Route
            path="/dashboard/manage-school-hours"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSchoolHours />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-school-hours/create"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSchoolHoursCreate />} />} authorizedRoles={["admin"]} />}
          />

          <Route
            path="/dashboard/manage-subjects"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjects />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-subjects/create"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjectsCreate />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-subjects/lists"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjectLists />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-subjects/create-list"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageSubjectsCreateList />} />} authorizedRoles={["admin"]} />}
          />

          <Route
            path="/dashboard/manage-users"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageUsers />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-users/create"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ManageUsersCreate />} />} authorizedRoles={["admin"]} />}
          />
          <Route
            path="/dashboard/manage-users/excel-import"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<ExcelUserImport />} />} authorizedRoles={["admin"]} />}
          />

          <Route
            path="/dashboard/employee-performance"
            element={<ProtectedRouteRole outlet={<DashboardRoute element={<EmployeePerformance />} />} authorizedRoles={["admin"]} />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
