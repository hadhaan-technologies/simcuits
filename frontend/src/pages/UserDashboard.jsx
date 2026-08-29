import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar, AppTopbar } from "@/components/AppSidebar";

import {
  Activity,
  Flame,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Simcuits" },
      {
        name: "description",
        content:
          "Your embedded systems learning analytics, streaks, and recommended problems.",
      },
    ],
  }),
  component: Dashboard,
});

function Ring({ value, color = "var(--primary)", label, sub }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;

  return (
    <div className="flex items-center gap-4">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="var(--border)"
          strokeWidth="6"
          fill="none"
        />

        <circle
          cx="40"
          cy="40"
          r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      <div>
        <div className="text-2xl font-semibold">{value}%</div>

        <div className="text-xs text-muted-foreground">{label}</div>

        <div className="text-[10px] font-mono text-muted-foreground/80">
          {sub}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar
          title="Welcome back, Ada"
          subtitle="You're on a 14-day streak. Keep the signal high."
          actions={
            <Link
              to="/problems"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Solve next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          }
        />

        <main className="p-6 space-y-6 max-w-7xl">
          {/* ==================== STAT ROW ==================== */}

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                icon: Trophy,
                k: "Problems solved",
                v: "148",
                d: "+12 this week",
                c: "text-cyan",
              },
              {
                icon: Flame,
                k: "Current streak",
                v: "14d",
                d: "Best: 32d",
                c: "text-chart-5",
              },
              {
                icon: Target,
                k: "Acceptance rate",
                v: "76%",
                d: "Top 8%",
                c: "text-emerald",
              },
              {
                icon: Activity,
                k: "XP earned",
                v: "2,148",
                d: "Pro tier",
                c: "text-violet",
              },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-white/10 bg-card/40 p-5 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

                <s.icon className={`h-5 w-5 ${s.c}`} />

                <div className="mt-4 text-3xl font-semibold tracking-tight">
                  {s.v}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">{s.k}</div>

                <div className="text-[11px] font-mono text-muted-foreground/70 mt-0.5">
                  {s.d}
                </div>
              </div>
            ))}
          </div>

          {/* ==================== ACTIVITY + DIFFICULTY ==================== */}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity */}

            <div className="rounded-2xl border border-white/10 bg-card/40 p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Submission activity</div>

                  <div className="text-xs text-muted-foreground">
                    Last 30 days · waveform view
                  </div>
                </div>

                <span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px]">
                  +18% vs prior
                </span>
              </div>

              <div className="mt-6 h-44 relative rounded-xl border border-white/5 bg-background/40 p-3">
                <svg
                  viewBox="0 0 600 140"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="dashboard-gradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="oklch(0.74 0.18 230)"
                        stopOpacity="0.5"
                      />

                      <stop
                        offset="100%"
                        stopColor="oklch(0.74 0.18 230)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {[...Array(7)].map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      x2="600"
                      y1={i * 20}
                      y2={i * 20}
                      stroke="var(--border)"
                      strokeDasharray="2 4"
                    />
                  ))}

                  <path
                    d="M0 100 L40 90 L80 95 L120 70 L160 75 L200 50 L240 60 L280 35 L320 55 L360 30 L400 45 L440 20 L480 40 L520 25 L560 15 L600 30"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    fill="none"
                    style={{
                      filter: "drop-shadow(0 0 6px var(--primary))",
                    }}
                  />

                  <path
                    d="M0 100 L40 90 L80 95 L120 70 L160 75 L200 50 L240 60 L280 35 L320 55 L360 30 L400 45 L440 20 L480 40 L520 25 L560 15 L600 30 L600 140 L0 140 Z"
                    fill="url(#dashboard-gradient)"
                  />
                </svg>
              </div>
            </div>

            {/* Difficulty */}

            <div className="rounded-2xl border border-white/10 bg-card/40 p-6 space-y-5">
              <div>
                <div className="font-medium">Difficulty breakdown</div>

                <div className="text-xs text-muted-foreground">
                  148 / 234 solved
                </div>
              </div>

              {[
                {
                  k: "Easy",
                  v: 92,
                  t: 110,
                  c: "var(--emerald)",
                },
                {
                  k: "Medium",
                  v: 48,
                  t: 96,
                  c: "var(--chart-5)",
                },
                {
                  k: "Hard",
                  v: 8,
                  t: 28,
                  c: "var(--destructive)",
                },
              ].map((d) => (
                <div key={d.k}>
                  <div className="flex justify-between text-xs">
                    <span>{d.k}</span>

                    <span className="font-mono text-muted-foreground">
                      {d.v}/{d.t}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.v / d.t) * 100}%`,
                        background: d.c,
                        boxShadow: `0 0 10px ${d.c}`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-white/5">
                <Ring
                  value={63}
                  label="Overall progress"
                  sub="Top 8% globally"
                />
              </div>
            </div>
          </div>

          {/* ==================== RECENT SUBMISSIONS ==================== */}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-card/40 p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Recent submissions</div>

                <Link
                  to="/submissions"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View all
                </Link>
              </div>

              <div className="mt-4 divide-y divide-white/5">
                {[
                  {
                    t: "PWM Dimmer (1 kHz)",
                    l: "Embedded C",
                    s: "Accepted",
                    d: "342 ms",
                    time: "2m ago",
                    ok: true,
                  },
                  {
                    t: "UART Echo @ 115200",
                    l: "Embedded C",
                    s: "Wrong waveform",
                    d: "—",
                    time: "14m ago",
                    ok: false,
                  },
                  {
                    t: "Debounce SW1",
                    l: "C++",
                    s: "Accepted",
                    d: "118 ms",
                    time: "1h ago",
                    ok: true,
                  },
                  {
                    t: "I²C EEPROM read",
                    l: "Embedded C",
                    s: "Time limit",
                    d: "—",
                    time: "3h ago",
                    ok: false,
                  },
                  {
                    t: "ADC moving average",
                    l: "Embedded C",
                    s: "Accepted",
                    d: "224 ms",
                    time: "yesterday",
                    ok: true,
                  },
                ].map((r) => (
                  <div
                    key={r.t}
                    className="py-3 flex items-center gap-3 text-sm"
                  >
                    {r.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="truncate">{r.t}</div>

                      <div className="text-xs text-muted-foreground font-mono">
                        {r.l} · {r.s}
                      </div>
                    </div>

                    <div className="text-xs font-mono text-muted-foreground hidden md:block">
                      {r.d}
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {r.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended */}

            <div className="rounded-2xl border border-white/10 bg-card/40 p-6">
              <div className="font-medium">Recommended next</div>

              <div className="text-xs text-muted-foreground">
                Based on your weak areas
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    t: "SPI Master polling",
                    d: "Medium",
                    g: "var(--chart-5)",
                  },
                  {
                    t: "ISR latency tuning",
                    d: "Hard",
                    g: "var(--destructive)",
                  },
                  {
                    t: "GPIO toggle 1 MHz",
                    d: "Easy",
                    g: "var(--emerald)",
                  },
                ].map((p) => (
                  <Link
                    to="/editor"
                    key={p.t}
                    className="block rounded-xl border border-white/5 p-4 hover:border-primary/40 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{p.t}</div>

                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          color: p.g,
                          background: p.g.replace(")", " / 0.12)"),
                        }}
                      >
                        {p.d}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
