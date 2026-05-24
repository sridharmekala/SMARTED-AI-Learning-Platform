import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import { isAdmin, isAuthenticated } from './services/authService';

const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Topics = lazy(() => import('./pages/Topics.jsx'));
const Courses = lazy(() => import('./pages/Courses.jsx'));
const CourseDetails = lazy(() => import('./pages/CourseDetails.jsx'));
const TopicDetails = lazy(() => import('./pages/TopicDetails.jsx'));
const TopicStatusPage = lazy(() => import('./pages/TopicStatusPage.jsx'));
const SavedTopics = lazy(() => import('./pages/SavedTopics.jsx'));
const Notes = lazy(() => import('./pages/Notes.jsx'));
const DailyPlan = lazy(() => import('./pages/DailyPlan.jsx'));
const Certificate = lazy(() => import('./pages/Certificate.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const Notifications = lazy(() => import('./pages/Notifications.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const Quiz = lazy(() => import('./pages/Quiz.jsx'));
const Chatbot = lazy(() => import('./pages/Chatbot.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const ManageCourses = lazy(() => import('./pages/admin/ManageCourses.jsx'));
const ManageModules = lazy(() => import('./pages/admin/ManageModules.jsx'));
const ManageTopics = lazy(() => import('./pages/admin/ManageTopics.jsx'));
const ManageNotes = lazy(() => import('./pages/admin/ManageNotes.jsx'));
const ManageQuizzes = lazy(() => import('./pages/admin/ManageQuizzes.jsx'));
const ManageExams = lazy(() => import('./pages/admin/ManageExams.jsx'));
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents.jsx'));
const AddStudent = lazy(() => import('./pages/admin/AddStudent.jsx'));
const ViewStudents = lazy(() => import('./pages/admin/ViewStudents.jsx'));
const EditStudent = lazy(() => import('./pages/admin/EditStudent.jsx'));
const StudentDetails = lazy(() => import('./pages/admin/StudentDetails.jsx'));
const StudentProgress = lazy(() => import('./pages/admin/StudentProgress.jsx'));
const StudentScores = lazy(() => import('./pages/admin/StudentScores.jsx'));
const AdminLeaderboard = lazy(() => import('./pages/admin/AdminLeaderboard.jsx'));
const AdminAITools = lazy(() => import('./pages/admin/AdminAITools.jsx'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'));

function RouteFallback() {
  return <LoadingSpinner label="Loading page..." />;
}

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
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
      <ToastContainer position="top-right" autoClose={2600} newestOnTop closeOnClick pauseOnHover />
    </>
  );
}

export default App;
