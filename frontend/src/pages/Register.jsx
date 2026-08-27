import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/simcuitLogo.ico";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check passwords
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
        },
      );

      console.log("REGISTER RESPONSE:", res.data);

      setSuccess("Account created successfully.");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
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
            Pulse
          </span>
        </Link>

        {/* Content */}
        <div className="relative max-w-md">
          <p className="text-xs font-mono text-muted-foreground mb-6">
            — Build. Test. Understand.
          </p>

          <h2 className="font-display text-4xl leading-[1.1] tracking-tight text-foreground">
            Learn embedded systems,
            <br />
            <span className="text-muted-foreground">
              one problem at a time.
            </span>
          </h2>

          <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
            Practice firmware, understand hardware behavior, and sharpen your
            embedded engineering skills through focused challenges.
          </p>

          <figure className="mt-10 border-l-2 border-foreground/80 pl-4">
            <blockquote className="text-sm text-foreground/80 leading-relaxed">
              "The best engineers don't just write code. They understand what
              happens underneath it."
            </blockquote>

            <figcaption className="mt-2 text-xs text-muted-foreground">
              Embedded Systems Engineer
            </figcaption>
          </figure>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-blink" />
            sim engine online
          </span>

          <span className="font-mono">v1.0</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile Brand */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-foreground text-background grid place-items-center font-display text-sm font-semibold">
                P
              </div>

              <span className="font-display text-base font-semibold tracking-tight">
                Pulse
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="text-sm text-muted-foreground">
              Start practicing in under a minute.
            </p>
          </div>

          {/* Social Login */}
          {/* <div className="mt-8 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              className="h-10 w-full border border-border rounded-md flex items-center justify-center gap-2 text-sm hover:bg-muted transition"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="h-10 w-full border border-border rounded-md flex items-center justify-center gap-2 text-sm hover:bg-muted transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              GitHub
            </button>
          </div> */}

          {/* Divider */}
          {/* <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              or
            </span>

            <div className="h-px flex-1 bg-border" />
          </div> */}

          {/* Register Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-medium text-foreground"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="dhanushk"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

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
              <label
                htmlFor="password"
                className="text-xs font-medium text-foreground"
              >
                Password
              </label>

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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-foreground"
              >
                Confirm password
              </label>
              <input
                id="conform password"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Success */}
            {success && <p className="text-sm text-green-600">{success}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full h-10 mt-2 rounded-md bg-primary text-primary-foreground flex items-center justify-center gap-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && (
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>
          </form>

          {/* Login */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-foreground font-medium hover:underline underline-offset-4"
            >
              Sign in
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

export default Register;
