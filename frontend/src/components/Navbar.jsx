import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/simcuitLogo.ico";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });

      setAuth(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Simcuits" className="h-8 w-8 object-contain" />

            <span className="font-semibold tracking-tight text-foreground">
              Simcuits
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <NavLink to="/problems" className={navLinkClass}>
              Problems
            </NavLink>

            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/editor" className={navLinkClass}>
              Simulator
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </nav>

          {/* Authentication */}
          <div className="flex items-center gap-2">
            {auth?.accessToken ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
