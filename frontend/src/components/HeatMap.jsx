import { useEffect, useState } from "react";
import axios from "axios";

const levelClass = [
  "bg-white/[0.04]",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/90",
];

function getLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function ActivityHeatmap() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get("/api/users/activity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setDays(response.data.activity || []);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Loading activity...</div>
    );
  }

  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const total = days.reduce((sum, day) => sum + day.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium">{total} submissions in the last year</p>

        <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <span>Less</span>

          {levelClass.map((className, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-[3px] ${className}`}
            />
          ))}

          <span>More</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} submission${
                    day.count === 1 ? "" : "s"
                  } · ${day.date}`}
                  className={`h-3 w-3 rounded-[3px] transition-transform hover:scale-125 ${
                    levelClass[getLevel(day.count)]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
