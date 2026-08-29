import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const categories = [
  "All",
  "GPIO",
  "UART",
  "PWM",
  "Digital Logic",
  "Timers",
  "Interrupts",
  "ADC",
  "Protocols",
];

// Temporary dummy problems.
// These will be used only when the API returns no problems.
const dummyProblems = [
  {
    _id: "dummy-001",
    title: "Blink LED at 2 Hz",
    category: "GPIO",
    difficulty: "easy",
    estimatedTime: "5 min",
    status: "done",
  },
  {
    _id: "dummy-002",
    title: "Debounce Mechanical Switch",
    category: "GPIO",
    difficulty: "easy",
    estimatedTime: "10 min",
    status: "done",
  },
  {
    _id: "dummy-003",
    title: "PWM Dimmer — 1 kHz, 60% Duty",
    category: "PWM",
    difficulty: "easy",
    estimatedTime: "8 min",
    status: "done",
  },
  {
    _id: "dummy-004",
    title: "UART Echo @ 115200 8N1",
    category: "UART",
    difficulty: "medium",
    estimatedTime: "20 min",
    status: "attempt",
  },
  {
    _id: "dummy-005",
    title: "ADC Moving Average Filter",
    category: "ADC",
    difficulty: "medium",
    estimatedTime: "18 min",
    status: "done",
  },
  {
    _id: "dummy-006",
    title: "ISR-Driven Millisecond Timer",
    category: "Interrupts",
    difficulty: "medium",
    estimatedTime: "25 min",
    status: "todo",
  },
  {
    _id: "dummy-007",
    title: "I²C EEPROM Page Write",
    category: "Protocols",
    difficulty: "hard",
    estimatedTime: "40 min",
    status: "todo",
  },
  {
    _id: "dummy-008",
    title: "SPI Master Full-Duplex",
    category: "Protocols",
    difficulty: "medium",
    estimatedTime: "30 min",
    status: "todo",
  },
  {
    _id: "dummy-009",
    title: "Quadrature Encoder Decode",
    category: "Digital Logic",
    difficulty: "hard",
    estimatedTime: "45 min",
    status: "todo",
  },
  {
    _id: "dummy-010",
    title: "Timer Input Capture Period",
    category: "Timers",
    difficulty: "medium",
    estimatedTime: "22 min",
    status: "attempt",
  },
  {
    _id: "dummy-011",
    title: "GPIO Toggle at 1 MHz",
    category: "GPIO",
    difficulty: "hard",
    estimatedTime: "35 min",
    status: "todo",
  },
  {
    _id: "dummy-012",
    title: "Software UART Bit-Bang",
    category: "UART",
    difficulty: "hard",
    estimatedTime: "50 min",
    status: "todo",
  },
];

const difficultyStyles = {
  easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

function StatusIcon({ status }) {
  if (status === "done") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  }

  if (status === "attempt") {
    return <Clock className="h-4 w-4 text-yellow-400" />;
  }

  return <Circle className="h-4 w-4 text-gray-500" />;
}

function Waveform() {
  return (
    <div className="flex items-center gap-[2px] h-6 opacity-60 group-hover:opacity-100 transition">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className={`w-[3px] bg-primary rounded-full ${
            index % 4 === 0 ? "h-5" : index % 3 === 0 ? "h-3" : "h-2"
          }`}
        />
      ))}
    </div>
  );
}

function Problems() {
  const { auth } = useAuth();

  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const user = auth?.user || auth;
  const role = user?.role;

  const canCreate = role === "admin" || role === "author";

  const canEdit = (problem) => {
    if (problem._id?.startsWith("dummy-")) return false;

    if (role === "admin") return true;

    if (role === "author") {
      return (
        problem.author?._id === user?.id ||
        problem.author === user?.id ||
        problem.createdBy?._id === user?.id ||
        problem.createdBy === user?.id
      );
    }

    return false;
  };

  const canDelete = (problem) => {
    if (problem._id?.startsWith("dummy-")) return false;

    if (role === "admin") return true;

    if (role === "author") {
      return (
        problem.author?._id === user?.id ||
        problem.author === user?.id ||
        problem.createdBy?._id === user?.id ||
        problem.createdBy === user?.id
      );
    }

    return false;
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const token = auth?.accessToken;

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/problems`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      console.log("Problems API response:", response.data);

      const apiProblems = Array.isArray(response.data?.problems)
        ? response.data.problems
        : [];

      // Use real problems if they exist.
      // Otherwise show dummy problems temporarily.
      setProblems(apiProblems.length > 0 ? apiProblems : dummyProblems);
    } catch (error) {
      console.error("Failed to fetch problems:", error);

      // Even if backend is unavailable,
      // keep the UI usable with dummy data.
      setProblems(dummyProblems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.accessToken) {
      fetchProblems();
    } else {
      setProblems(dummyProblems);
      setLoading(false);
    }
  }, [auth?.accessToken]);

  const handleDelete = async (problemId) => {
    if (problemId.startsWith("dummy-")) {
      alert("This is a demo problem and cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this problem?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/problems/${problemId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
          withCredentials: true,
        },
      );

      setProblems((current) =>
        current.filter((problem) => problem._id !== problemId),
      );
    } catch (error) {
      console.error("Failed to delete problem:", error);

      alert(
        error.response?.data?.message ||
          "You are not allowed to delete this problem.",
      );
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      problem.title?.toLowerCase().includes(searchTerm) ||
      problem.category?.toLowerCase().includes(searchTerm) ||
      problem.tags?.some((tag) => tag.toLowerCase().includes(searchTerm));

    const matchesCategory =
      activeCategory === "All" ||
      problem.category === activeCategory ||
      problem.tags?.includes(activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Problems</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {problems.length} curated problems · updated daily
            </p>
          </div>

          {/* ADMIN + AUTHOR */}
          {canCreate && (
            <Link
              to="/problems/create"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              Create problem
            </Link>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, category..."
              className="w-full h-11 rounded-lg border border-white/10 bg-background/50 pl-10 pr-4 text-sm outline-none focus:border-primary/50"
            />
          </div>

          <button
            type="button"
            className="h-11 px-4 rounded-lg border border-white/10 bg-background/50 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                  active
                    ? "bg-primary/15 border-primary/40 text-foreground"
                    : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* PROBLEMS TABLE */}
        <div className="rounded-2xl border border-white/10 bg-card/40 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5 font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Problem</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Difficulty</div>
            <div className="col-span-2">Waveform</div>
            <div className="col-span-1">Est.</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Loading problems...
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredProblems.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No problems found.
            </div>
          )}

          {/* PROBLEM ROWS */}
          {!loading &&
            filteredProblems.map((problem, index) => (
              <div
                key={problem._id || problem.id}
                className="grid grid-cols-1 md:grid-cols-12 items-center px-5 py-4 border-b border-white/5 hover:bg-white/[0.03] transition group"
              >
                {/* NUMBER + STATUS */}
                <div className="md:col-span-1 flex items-center gap-2">
                  <StatusIcon status={problem.status} />

                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(3, "0")}
                  </span>
                </div>

                {/* TITLE */}
                <div className="md:col-span-4 mt-2 md:mt-0">
                  <Link
                    to={
                      problem._id?.startsWith("dummy-")
                        ? "/editor"
                        : `/problems/${problem._id}`
                    }
                    className="text-sm font-medium group-hover:text-primary transition"
                  >
                    {problem.title}
                  </Link>

                  {/* MOBILE CATEGORY */}
                  <div className="md:hidden mt-2 text-xs text-muted-foreground">
                    {problem.category}
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="hidden md:block md:col-span-2">
                  <span className="text-xs px-2 py-1 rounded border border-white/10 text-muted-foreground">
                    {problem.category}
                  </span>
                </div>

                {/* DIFFICULTY */}
                <div className="hidden md:block md:col-span-1">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      difficultyStyles[problem.difficulty?.toLowerCase()] ||
                      "text-muted-foreground border-white/10"
                    }`}
                  >
                    {problem.difficulty
                      ? problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)
                      : "—"}
                  </span>
                </div>

                {/* WAVEFORM */}
                <div className="hidden md:block md:col-span-2">
                  <Waveform />
                </div>

                {/* ESTIMATE */}
                <div className="hidden md:block md:col-span-1 text-xs text-muted-foreground font-mono">
                  {problem.estimatedTime || "—"}
                </div>

                {/* ACTIONS */}
                <div className="md:col-span-1 flex justify-end gap-1 mt-3 md:mt-0">
                  {canEdit(problem) && (
                    <Link
                      to={`/problems/${problem._id}/edit`}
                      className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                      title="Edit problem"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  )}

                  {canDelete(problem) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(problem._id)}
                      className="p-2 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition"
                      title="Delete problem"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default Problems;
