import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';

import Navbar from './components/Navbar';
import AppSidebar from './components/AppSideBar';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Index from './pages/index';
import Problems from './pages/Problems';
import CreateArticle from './pages/CreateArticle';

import PrivateRoute from './components/PrivateRoute';

import AdminDashboard from './pages/AdminDashboard';
import AuthorDashboard from './pages/AuthorDashboard';
import UserDashboard from './pages/UserDashboard';

import Learn from './pages/Learn';
import ArticlePage from './pages/ArticlePage';

import { SiteFooter } from './components/SiteFooter';

import QuizBuilder from './pages/QuizBuilder';
import QuizTaker from './pages/QuizTaker';

/* ========================================
   QUIZ TAKER WRAPPER
======================================== */

function QuizTakerPage() {
  const { quizId } = useParams();

  return <QuizTaker quizId={quizId} />;
}

/* ========================================
   APP LAYOUT
======================================== */

function AppLayout() {
  const { auth } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const showNavbar = isHome;
  const showSidebar = auth?.accessToken && !isHome;

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}

      <div className="flex">
        {showSidebar && <AppSidebar />}

        <div className={showSidebar ? 'flex-1 min-w-0' : 'w-full'}>
          <Routes>
            {/* ==============================
                PUBLIC ROUTES
            ============================== */}

            <Route path="/" element={<Index />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* ==============================
                DASHBOARD
            ============================== */}

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  {(auth) => {
                    if (auth.user?.role === 'admin') {
                      return <AdminDashboard />;
                    }

                    if (auth.user?.role === 'author') {
                      return <AuthorDashboard />;
                    }

                    if (auth.user?.role === 'user') {
                      return <UserDashboard />;
                    }

                    return <Navigate to="/login" replace />;
                  }}
                </PrivateRoute>
              }
            />

            {/* ==============================
                PROFILE
            ============================== */}

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* ==============================
                LEARN
            ============================== */}

            <Route path="/learn" element={<Learn />} />

            <Route path="/learn/:slug" element={<ArticlePage />} />

            {/* ==============================
                SIMULATOR
            ============================== */}

            <Route
              path="/editor"
              element={
                <PrivateRoute>
                  <div className="p-6">Simulator</div>
                </PrivateRoute>
              }
            />

            {/* ==============================
                ARTICLES
            ============================== */}

            <Route
              path="/author/articles/new"
              element={
                <PrivateRoute>
                  <CreateArticle />
                </PrivateRoute>
              }
            />

            {/* ==============================
                PROBLEMS
            ============================== */}

            <Route path="/problems" element={<Problems />} />

            {/* ==============================
                QUIZ
            ============================== */}

            {/* Faculty → Create Quiz */}
            <Route
              path="/quiz/create"
              element={
                <PrivateRoute>
                  <QuizBuilder />
                </PrivateRoute>
              }
            />

            {/* Student → Take Quiz */}
            <Route
              path="/quiz/:quizId"
              element={
                <PrivateRoute>
                  <QuizTakerPage />
                </PrivateRoute>
              }
            />

            {/* /quiz → send user to appropriate quiz page */}
            <Route
              path="/quiz"
              element={
                <PrivateRoute>
                  {(auth) => {
                    if (auth.user?.role === 'faculty') {
                      return <Navigate to="/quiz/create" replace />;
                    }

                    return (
                      <div className="p-6">
                        <h1 className="text-2xl font-semibold">Quiz</h1>

                        <p className="mt-2 text-gray-500">Enter a quiz ID to start the quiz.</p>
                      </div>
                    );
                  }}
                </PrivateRoute>
              }
            />

            {/* ==============================
                FALLBACK
            ============================== */}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {showNavbar && <SiteFooter />}
    </div>
  );
}

/* ========================================
   APP
======================================== */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
