import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ActivityHeatmap from "../components/HeatMap";
import {
  MapPin,
  Link as LinkIcon,
  Award,
  Cpu,
  Activity,
  X,
} from "lucide-react";

function computeInitials(name = "") {
  return (
    String(name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "?"
  );
}

function Profile() {
  const { auth } = useAuth();

  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const openEditor = () => {
    setDraft(profile);
    setOpen(true);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${auth?.accessToken}`,
            },
            withCredentials: true,
          },
        );
        setProfile(response.data);
        setDraft(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.accessToken) {
      fetchProfile();
    }
  }, [auth?.accessToken]);

  const save = async () => {
    try {
      setSaving(true);

      const response = await axios.put(
        "/api/users/me",
        {
          username: draft.username,
          bio: draft.bio,
          location: draft.location,
          // github: draft.github,
          website: draft.website,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        },
      );

      setProfile(response.data.user);
      setDraft(response.data.user);

      setOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const skills = [
    { k: "GPIO", v: 92 },
    { k: "UART", v: 81 },
    { k: "PWM", v: 88 },
    { k: "Timers", v: 74 },
    { k: "Interrupts", v: 68 },
    { k: "ADC", v: 71 },
    { k: "I²C / SPI", v: 60 },
    { k: "RTOS", v: 45 },
  ];
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 min-w-0">
        <main className="p-6 space-y-6 max-w-7xl">
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Engineering profile, skills, badges, and submission history.
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-white/10 relative overflow-hidden">
            <div className="relative flex flex-col md:flex-row gap-6 items-start">
              <div className="h-24 w-24 shrink-0 rounded-2xl bg-primary flex items-center justify-center text-2xl font-semibold text-primary-foreground">
                {computeInitials(profile.username)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-semibold">{profile.username}</h2>

                  <span className="px-2 py-0.5 rounded-md text-xs bg-primary/15 text-primary border border-primary/30">
                    Pro
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  {profile.bio}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />

                      {profile.location}
                    </span>
                  )}

                  {profile.website && (
                    <span className="flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5" />

                      <a
                        href={
                          profile.website.startsWith("http")
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.website}
                      </a>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-white/10 glass text-sm hover:bg-white/5 transition"
                >
                  Share
                </button>

                <button
                  type="button"
                  onClick={openEditor}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
                >
                  Edit profile
                </button>
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["Solved", profile.problemsSolved],
                ["Streak", `${profile.currentStreak}d`],
                ["XP", profile.xp],
                ["Level", profile.level],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl border border-white/5 bg-card/40 p-4"
                >
                  <div className="text-xs text-muted-foreground">{k}</div>

                  <div className="text-2xl font-semibold mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ================================= */}
          {/* ACTIVITY + BADGES                  */}
          {/* ================================= */}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ACTIVITY */}

            <div className="glass rounded-2xl p-6 border border-white/10 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Activity</div>

                  <div className="text-xs text-muted-foreground">
                    182 submissions in the last 6 months
                  </div>
                </div>

                {/* HEATMAP LEGEND */}

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  less
                  {[0, 1, 2, 3, 4].map((index) => (
                    <span
                      key={index}
                      className={`h-3 w-3 rounded-[3px] ${
                        [
                          "bg-white/[0.04]",
                          "bg-primary/20",
                          "bg-primary/40",
                          "bg-primary/60",
                          "bg-primary/90",
                        ][index]
                      }`}
                    />
                  ))}
                  more
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <ActivityHeatmap />
              </div>
            </div>

            {/* ================================= */}
            {/* BADGES                             */}
            {/* ================================= */}

            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-chart-5" />
                Badges
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  "GPIO Guru",
                  "ISR Whisperer",
                  "PWM Pro",
                  "100 Solved",
                  "14d Streak",
                  "Top 10%",
                ].map((badge) => (
                  <div
                    key={badge}
                    className="rounded-xl border border-border p-3 text-center"
                  >
                    <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Cpu className="h-4 w-4" />
                    </div>

                    <div className="mt-2 text-[11px]">{badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================================= */}
          {/* SKILLS + SUBMISSION HISTORY        */}
          {/* ================================= */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* ================================= */}
            {/* SKILL GRAPH                        */}
            {/* ================================= */}

            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan" />
                Skill graph
              </div>

              <div className="mt-5 space-y-3">
                {skills.map((skill) => (
                  <div key={skill.k}>
                    <div className="flex justify-between text-xs">
                      <span>{skill.k}</span>

                      <span className="font-mono text-muted-foreground">
                        {skill.v}%
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${skill.v}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================================= */}
            {/* SUBMISSION HISTORY                 */}
            {/* ================================= */}

            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="font-medium">Submission history</div>

              <div className="mt-4 divide-y divide-white/5">
                {[
                  {
                    t: "PWM Dimmer",
                    s: "Accepted",
                    time: "2m ago",
                  },
                  {
                    t: "UART Echo",
                    s: "Wrong waveform",
                    time: "14m ago",
                  },
                  {
                    t: "Debounce SW1",
                    s: "Accepted",
                    time: "1h ago",
                  },
                  {
                    t: "ADC moving avg",
                    s: "Accepted",
                    time: "yesterday",
                  },
                ].map((row) => (
                  <div
                    key={row.t + row.time}
                    className="py-3 flex items-center text-sm"
                  >
                    <div className="flex-1">{row.t}</div>

                    <div className="text-xs text-muted-foreground font-mono mr-4">
                      {row.s}
                    </div>

                    <div className="text-xs text-muted-foreground font-mono">
                      {row.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* MODAL BACKDROP */}

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-background shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between p-6 border-b border-white/5">
              <div>
                <h2 className="text-lg font-semibold">Edit profile</h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Update your public engineering profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="grid gap-4 p-6">
              {/* NAME */}

              <div className="grid gap-1.5">
                <label htmlFor="p-name" className="text-sm font-medium">
                  Name
                </label>

                <input
                  value={draft.username || ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="p-bio" className="text-sm font-medium">
                  Bio
                </label>

                <textarea
                  value={draft.bio || ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      bio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <label htmlFor="p-loc" className="text-sm font-medium">
                    Location
                  </label>

                  <input
                    value={draft.location || ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="p-web" className="text-sm font-medium">
                  Website
                </label>

                <input
                  value={draft.website || ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      website: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-primary/5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition"
              >
                Cancel
              </button>

              <button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
