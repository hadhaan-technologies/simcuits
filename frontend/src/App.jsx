import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppSidebar from "./components/AppSideBar";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Index from "./pages/index";
import Problems from "./pages/Problems";
import CreateArticle from "./pages/CreateArticle";

import PrivateRoute from "./components/PrivateRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AuthorDashboard from "./pages/AuthorDashboard";
import UserDashboard from "./pages/UserDashboard";
import Learn from "./pages/Learn";
import ArticlePage from "./pages/ArticlePage";

// ========================================
// APP LAYOUT
// ========================================

function AppLayout() {
  const { auth } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const showNavbar = isHome;
  const showSidebar = auth?.accessToken && !isHome;

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <div className="flex">
        {showSidebar && <AppSidebar />}
        <div className={showSidebar ? "flex-1 min-w-0" : "w-full"}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  {(auth) => {
                    if (auth.user?.role == "admin") {
                      return <AdminDashboard />;
                    }
                    if (auth.user?.role == "author") {
                      return <AuthorDashboard />;
                    }
                    if (auth.user?.role == "user") {
                      return <UserDashboard />;
                    }
                  }}
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* ============================== */}
            {/* FUTURE APP ROUTES               */}
            {/* ============================== */}

            <Route path="/learn" element={<Learn />} />

            <Route path="/learn/:slug" element={<ArticlePage />} />

            <Route
              path="/editor"
              element={
                <PrivateRoute>
                  <div className="p-6">Simulator</div>
                </PrivateRoute>
              }
            />
            <Route
              path="/author/articles/new"
              element={
                <PrivateRoute>
                  <CreateArticle />
                </PrivateRoute>
              }
            />

            <Route path="/problems" element={<Problems />} />

            {/* <Route
              path="/problems/create"
              element={
                <PrivateRoute>
                  <CreateProblem />
                </PrivateRoute>
              }
            />

            <Route
              path="/problems/:id"
              element={
                <PrivateRoute>
                  <ProblemDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/problems/:id/edit"
              element={
                <PrivateRoute>
                  <EditProblem />
                </PrivateRoute>
              }
            /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

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
