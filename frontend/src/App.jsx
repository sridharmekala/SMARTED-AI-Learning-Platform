import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Topics from './pages/Topics.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import TopicDetails from './pages/TopicDetails.jsx';
import TopicStatusPage from './pages/TopicStatusPage.jsx';
import SavedTopics from './pages/SavedTopics.jsx';
import Notes from './pages/Notes.jsx';
import DailyPlan from './pages/DailyPlan.jsx';
import Certificate from './pages/Certificate.jsx';
import Search from './pages/Search.jsx';
import Notifications from './pages/Notifications.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Quiz from './pages/Quiz.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Profile from './pages/Profile.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import ManageCourses from './pages/admin/ManageCourses.jsx';
import ManageModules from './pages/admin/ManageModules.jsx';
import ManageTopics from './pages/admin/ManageTopics.jsx';
import ManageNotes from './pages/admin/ManageNotes.jsx';
import ManageQuizzes from './pages/admin/ManageQuizzes.jsx';
import ManageExams from './pages/admin/ManageExams.jsx';
import ManageStudents from './pages/admin/ManageStudents.jsx';
import AddStudent from './pages/admin/AddStudent.jsx';
import ViewStudents from './pages/admin/ViewStudents.jsx';
import EditStudent from './pages/admin/EditStudent.jsx';
import StudentDetails from './pages/admin/StudentDetails.jsx';
import StudentProgress from './pages/admin/StudentProgress.jsx';
import StudentScores from './pages/admin/StudentScores.jsx';
import AdminLeaderboard from './pages/admin/AdminLeaderboard.jsx';
import AdminAITools from './pages/admin/AdminAITools.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import { isAdmin, isAuthenticated } from './services/authService';

function StudentRoutes() {
  const loggedIn = isAuthenticated('student');
  const admin = isAdmin('student');

  return (
    <AppLayout>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/certificate"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/topics/:status"
            element={
              <ProtectedRoute>
                <TopicStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topics"
            element={
              <ProtectedRoute>
                <Topics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topics/status/:status"
            element={
              <ProtectedRoute>
                <TopicStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topics/:id"
            element={
              <ProtectedRoute>
                <TopicDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-topics"
            element={
              <ProtectedRoute>
                <SavedTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-plan"
            element={
              <ProtectedRoute>
                <DailyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:topicId"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={loggedIn ? (admin ? '/admin' : '/dashboard') : '/login'} replace />} />
        </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<Login adminMode />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminOverview />
            </AdminRoute>
          }
        />
        <Route path="/admin/courses" element={<AdminRoute><ManageCourses /></AdminRoute>} />
        <Route path="/admin/courses/add" element={<AdminRoute><ManageCourses /></AdminRoute>} />
        <Route path="/admin/courses/:courseId/edit" element={<AdminRoute><ManageCourses /></AdminRoute>} />
        <Route path="/admin/modules" element={<AdminRoute><ManageModules /></AdminRoute>} />
        <Route path="/admin/modules/add" element={<AdminRoute><ManageModules /></AdminRoute>} />
        <Route path="/admin/modules/:moduleId/edit" element={<AdminRoute><ManageModules /></AdminRoute>} />
        <Route path="/admin/topics" element={<AdminRoute><ManageTopics /></AdminRoute>} />
        <Route path="/admin/topics/add" element={<AdminRoute><ManageTopics /></AdminRoute>} />
        <Route path="/admin/topics/:topicId/edit" element={<AdminRoute><ManageTopics /></AdminRoute>} />
        <Route path="/admin/notes" element={<AdminRoute><ManageNotes /></AdminRoute>} />
        <Route path="/admin/notes/add" element={<AdminRoute><ManageNotes /></AdminRoute>} />
        <Route path="/admin/notes/:noteId/edit" element={<AdminRoute><ManageNotes /></AdminRoute>} />
        <Route path="/admin/quizzes" element={<AdminRoute><ManageQuizzes /></AdminRoute>} />
        <Route path="/admin/quizzes/add" element={<AdminRoute><ManageQuizzes /></AdminRoute>} />
        <Route path="/admin/quizzes/:questionId/edit" element={<AdminRoute><ManageQuizzes /></AdminRoute>} />
        <Route path="/admin/exams" element={<AdminRoute><ManageExams /></AdminRoute>} />
        <Route path="/admin/exams/add" element={<AdminRoute><ManageExams /></AdminRoute>} />
        <Route path="/admin/exams/:examId/edit" element={<AdminRoute><ManageExams /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><ViewStudents /></AdminRoute>} />
        <Route path="/admin/students/add" element={<AdminRoute><AddStudent /></AdminRoute>} />
        <Route path="/admin/students/:studentId/edit" element={<AdminRoute><EditStudent /></AdminRoute>} />
        <Route path="/admin/students/:studentId" element={<AdminRoute><StudentDetails /></AdminRoute>} />
        <Route path="/admin/students/progress" element={<AdminRoute><StudentProgress /></AdminRoute>} />
        <Route path="/admin/students/scores" element={<AdminRoute><StudentScores /></AdminRoute>} />
        <Route path="/admin/students/manage" element={<AdminRoute><ManageStudents /></AdminRoute>} />
        <Route path="/admin/leaderboard" element={<AdminRoute><AdminLeaderboard /></AdminRoute>} />
        <Route path="/admin/ai-tools" element={<AdminRoute><AdminAITools /></AdminRoute>} />
        <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        <Route path="/*" element={<StudentRoutes />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2600} newestOnTop closeOnClick pauseOnHover />
    </>
  );
}

export default App;
