import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/simcuitLogo.ico";

import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        form,
        {
          withCredentials: true,
        },
      );

      console.log("LOGIN RESPONSE:", res.data);

      const { accessToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);

      setAuth({
        accessToken,
        role: user.role,
        user,
      });

      // Redirect according to role
      if (user.role === "admin") {
        navigate("/");
      } else if (user.role === "author") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 border-r border-border bg-muted/40 overflow-hidden">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="Simcuits" className="h-8 w-8 object-contain" />

          <span className="font-display text-base font-semibold tracking-tight">
            Simcuits
          </span>
        </Link>

        {/* Content */}
        <div className="relative max-w-md">
          <p className="text-xs font-mono text-muted-foreground mb-6">
            — A quieter way to practice
          </p>

          <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-foreground">
            Embedded systems,
            <br />
            <span className="text-muted-foreground">one signal at a time.</span>
          </h2>

          <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
            Write firmware. Inspect waveforms. Validate behavior against real
            hardware models — without leaving your browser.
          </p>

          <figure className="mt-10 border-l-2 border-foreground/80 pl-4">
            <blockquote className="text-sm text-foreground/80 leading-relaxed">
              "Replaced an afternoon at the bench with twenty focused minutes."
            </blockquote>

            <figcaption className="mt-2 text-xs text-muted-foreground">
              Firmware Engineer · Tesla Autopilot
            </figcaption>
          </figure>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2 border px-2 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" />
            simcuits engine online
          </span>

          <span className="font-mono">v1.0.5</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile Brand */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-foreground text-background grid place-items-center font-display text-sm font-semibold">
                <img
                  src={logo}
                  alt="Simcuits"
                  className="h-8 w-8 object-contain"
                />
              </div>

              <span className="font-display text-base font-semibold tracking-tight">
                Pulse
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="text-sm text-muted-foreground">
              Sign in to continue where you left off.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-foreground"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@engineer.dev"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-foreground"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Forgot?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full h-10 mt-2 rounded-md bg-primary text-primary-foreground flex items-center justify-center gap-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && (
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to Pulse?{" "}
            <Link
              to="/register"
              className="text-foreground font-medium hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-10 text-center text-[11px] text-muted-foreground leading-relaxed">
            By continuing you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
