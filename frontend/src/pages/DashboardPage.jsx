import { useEffect, useState } from "react";

import { scheduleApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSchedules() {
      try {
        const items = await scheduleApi.list(token);
        setSchedules(items);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadSchedules();
  }, [token]);

  const upcomingSchedules = schedules.slice(0, 3);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Hello, {user?.full_name}</h2>
        </div>
        <p className="helper-text">
          This first version focuses on auth, schedule tracking, and a simple student dashboard.
        </p>
      </div>

      <div className="dashboard-grid">
        <article className="card stat-card">
          <h3>Schedule Items</h3>
          <p className="stat-number">{schedules.length}</p>
          <p className="helper-text">Study sessions currently saved to your account.</p>
        </article>

        <article className="card stat-card">
          <h3>Next Deadline View</h3>
          <p className="stat-number">{upcomingSchedules.length}</p>
          <p className="helper-text">Upcoming study blocks shown from your saved schedule list.</p>
        </article>

        <article className="card stat-card">
          <h3>AI Foundation</h3>
          <p className="stat-number">Ready</p>
          <p className="helper-text">AI recommendations are placeholders for a future sprint.</p>
        </article>
      </div>

      <div className="card">
        <h3>Upcoming Schedule</h3>
        {error ? <p className="error-text">{error}</p> : null}

        {upcomingSchedules.length === 0 ? (
          <p className="helper-text">
            No schedule items yet. Add one from the Schedule page to start building the dashboard.
          </p>
        ) : (
          <div className="list-stack">
            {upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="list-item">
                <div>
                  <strong>{schedule.title}</strong>
                  <p>
                    {schedule.schedule_date} | {schedule.start_time.slice(0, 5)} -{" "}
                    {schedule.end_time.slice(0, 5)}
                  </p>
                </div>
                <span className="tag">{schedule.location || "No location set"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
