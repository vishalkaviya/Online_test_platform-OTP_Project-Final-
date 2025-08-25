import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home/HomePage";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import ForgotPassword from "./pages/Auth/Forgotpassword";
import EditProfile from "./pages/Profile/EditProfile";
import ViewProfile from "./pages/Profile/ViewProfile";
import TestPage from './pages/Test/TestPage';
import ResultPage from './pages/Result/ResultPage';
import AddQuestionPage from './pages/Admin/AddQuestionPage';
import EditQuestionPage from './pages/Admin/EditQuestionPage';
import SubjectsPage from './pages/Subject/SubjectsPage';

import PrivateRoute from "./components/PrivateRoute";
import './index.css';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageSubjectsPage from "./pages/Admin/ManageSubjectsPage";
import ViewAnalyticsPage from "./pages/Admin/ViewAnalyticsPage";
import FAQPage from "./pages/FAQ/FAQPage";
import AboutUsPage from "./pages/US/AboutUsPage";
import ContactUsPage from "./pages/US/ContactUsPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Protected Routes */}
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/view-profile" element={<PrivateRoute><ViewProfile /></PrivateRoute>} />
        <Route path="/subjects" element={<PrivateRoute><SubjectsPage /></PrivateRoute>} />
        <Route path="/test/:subjectId" element={<PrivateRoute><TestPage /></PrivateRoute>} />
        <Route path="/result" element={<PrivateRoute><ResultPage /></PrivateRoute>} />

        {/* Optional Admin Pages (can protect later if needed) */}
        <Route path="/admin/add-question" element={<AddQuestionPage />} />
        <Route path="/admin/edit-question/:id" element={<EditQuestionPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/subjects" element={<ManageSubjectsPage />} />
      <Route path="/admin/view-analytics" element={<ViewAnalyticsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
      </Routes>
    </Router>
  );
}
