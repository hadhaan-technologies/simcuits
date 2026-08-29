import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Flame,
  Trophy,
  Target,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

function Ring({ value, color = "var(--primary)", label, sub }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="var(--border)"
          strokeWidth="6"
          fill="none"
        />

        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
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

function UserDashboard() {
  const stats = [
    {
      icon: Trophy,
      label: "Problems solved",
      value: "148",
      description: "+12 this week",
      color: "text-cyan-400",
    },
    {
      icon: Flame,
      label: "Current streak",
      value: "14d",
      description: "Best: 32d",
      color: "text-orange-400",
    },
    {
      icon: Target,
      label: "Acceptance rate",
      value: "76%",
      description: "Top 8%",
      color: "text-emerald-400",
    },
    {
      icon: Activity,
      label: "XP earned",
      value: "2,148",
      description: "Pro tier",
      color: "text-violet-400",
    },
  ];

  const difficulty = [
    {
      name: "Easy",
      solved: 92,
      total: 110,
      color: "var(--emerald)",
    },
    {
      name: "Medium",
      solved: 48,
      total: 96,
      color: "var(--chart-5)",
    },
    {
      name: "Hard",
      solved: 8,
      total: 28,
      color: "var(--destructive)",
    },
  ];

  const submissions = [
    {
      title: "PWM Dimmer (1 kHz)",
      language: "Embedded C",
      status: "Accepted",
      execution: "342 ms",
      time: "2m ago",
      success: true,
    },
    {
      title: "UART Echo @ 115200",
      language: "Embedded C",
      status: "Wrong waveform",
      execution: "—",
      time: "14m ago",
      success: false,
    },
    {
      title: "Debounce SW1",
      language: "C++",
      status: "Accepted",
      execution: "118 ms",
      time: "1h ago",
      success: true,
    },
    {
      title: "I²C EEPROM read",
      language: "Embedded C",
      status: "Time limit",
      execution: "—",
      time: "3h ago",
      success: false,
    },
    {
      title: "ADC moving average",
      language: "Embedded C",
      status: "Accepted",
      execution: "224 ms",
      time: "yesterday",
      success: true,
    },
  ];

  const recommended = [
    {
      title: "SPI Master polling",
      difficulty: "Medium",
      color: "var(--chart-5)",
    },
    {
      title: "ISR latency tuning",
      difficulty: "Hard",
      color: "var(--destructive)",
    },
    {
      title: "GPIO toggle 1 MHz",
      difficulty: "Easy",
      color: "var(--emerald)",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 min-w-0">
        <main className="p-6 space-y-6 max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl border border-blue/10 bg-card/40 p-5"
                >
                  {/* <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl " /> */}

                  <Icon className={`h-5 w-5 ${stat.color}`} />

                  <div className="mt-4 text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </div>

                  <div className="mt-0.5 text-[11px] font-mono text-muted-foreground/70">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= ACTIVITY + DIFFICULTY ================= */}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity */}
            <div className="rounded-2xl border border-white/10 bg-card/40 p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Submission activity</div>

                  <div className="text-xs text-muted-foreground">
                    Last 30 days
                  </div>
                </div>

                <span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px]">
                  +18% vs prior
                </span>
              </div>

              {/* Activity bars */}
              <div className="mt-6 rounded-xl border border-white/5 bg-background/40 p-5">
                <div className="flex items-end gap-1 h-40">
                  {[
                    25, 40, 20, 55, 35, 70, 45, 60, 30, 75, 50, 85, 65, 90, 55,
                    80, 45, 70, 60, 95, 65, 75, 50, 85, 70, 90, 55, 80, 65, 95,
                  ].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-sm bg-primary/60 transition hover:bg-primary"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ))}
                </div>

                <div className="mt-3 flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>30d ago</span>
                  <span>20d</span>
                  <span>10d</span>
                  <span>Today</span>
                </div>
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

              {difficulty.map((item) => {
                const percentage = (item.solved / item.total) * 100;

                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs">
                      <span>{item.name}</span>

                      <span className="font-mono text-muted-foreground">
                        {item.solved}/{item.total}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          background: item.color,
                          boxShadow: `0 0 10px ${item.color}`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-white/5 pt-4">
                <Ring
                  value={63}
                  label="Overall progress"
                  sub="Top 8% globally"
                />
              </div>
            </div>
          </div>

          {/* ================= SUBMISSIONS + RECOMMENDED ================= */}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent submissions */}
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
                {submissions.map((submission) => (
                  <div
                    key={submission.title}
                    className="flex items-center gap-3 py-3 text-sm"
                  >
                    {submission.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="truncate">{submission.title}</div>

                      <div className="text-xs font-mono text-muted-foreground">
                        {submission.language} · {submission.status}
                      </div>
                    </div>

                    <div className="hidden text-xs font-mono text-muted-foreground md:block">
                      {submission.execution}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {submission.time}
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
                {recommended.map((problem) => (
                  <Link
                    to="/problems"
                    key={problem.title}
                    className="block rounded-xl border border-white/5 p-4 transition hover:border-primary/40 hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{problem.title}</div>

                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-mono"
                        style={{
                          color: problem.color,
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      Practice this problem to improve your performance in this
                      area.
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

export default UserDashboard;
