import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code2, LayoutDashboardIcon, Library, ListTodo, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/simcuitLogo.ico';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/problems', label: 'Problems', icon: ListTodo },
  { to: '/learn', label: 'Learn', icon: Library },
  { to: '/editor', label: 'Simulator', icon: Code2 },
  { to: '/profile', label: 'Profile', icon: User },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

  const path = location.pathname;

  const user = auth?.user;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setAuth(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/5 bg-sidebar/60 backdrop-blur-xl">
      <div className="h-screen ">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-white/5">
          <img src={logo} alt="Simcuits" className="h-8 w-8 object-contain" />

          <span className="font-semibold">Simcuits</span>
        </Link>
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = path === item.to || (item.to !== '/' && path.startsWith(item.to));

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? 'bg-primary/10 text-foreground border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <span className="w-4 text-center">
                  <Icon size={16} />
                </span>
                {item.label}

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-blink" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/5 space-y-0.5">
          {/* User */}
          <div className="mt-3 mx-1 rounded-xl glass p-3 flex items-center gap-3">
            {/* User Avatar */}
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* User Information */}
            <div className="text-xs leading-tight min-w-0">
              <div className="font-medium truncate">{user?.username || 'User'}</div>

              <div className="text-muted-foreground">
                {user?.role === 'admin'
                  ? 'Admin'
                  : user?.role === 'author'
                    ? 'Author'
                    : `Level ${user?.level || 1} · ${user?.xp || 0} XP`}
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition"
            >
              ↪
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
