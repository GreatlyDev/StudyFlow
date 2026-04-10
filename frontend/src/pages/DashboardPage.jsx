import { useEffect, useState } from "react";

import { assignmentApi, courseApi, scheduleApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [scheduleItems, courseItems, assignmentItems] = await Promise.all([
          scheduleApi.list(token),
          courseApi.list(token),
          assignmentApi.list(token),
        ]);
        setSchedules(scheduleItems);
        setCourses(courseItems);
        setAssignments(assignmentItems);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadDashboardData();
  }, [token]);

  const upcomingSchedules = schedules.slice(0, 3);
  const upcomingAssignments = assignments.filter((item) => item.status !== "completed").slice(0, 3);

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
          <h3>Courses</h3>
          <p className="stat-number">{courses.length}</p>
          <p className="helper-text">Courses added so far for your semester plan.</p>
        </article>

        <article className="card stat-card">
          <h3>Schedule Items</h3>
          <p className="stat-number">{schedules.length}</p>
          <p className="helper-text">Study sessions currently saved to your account.</p>
        </article>

        <article className="card stat-card">
          <h3>Assignments</h3>
          <p className="stat-number">{assignments.length}</p>
          <p className="helper-text">Assignments tracked for your current courses.</p>
        </article>
      </div>

      <div className="card">
        <h3>Upcoming Deadlines</h3>
        {error ? <p className="error-text">{error}</p> : null}

        {upcomingAssignments.length === 0 ? (
          <p className="helper-text">
            No assignments yet. Add one from the Assignments page to give the dashboard real deadlines.
          </p>
        ) : (
          <div className="list-stack">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="list-item">
                <div>
                  <strong>{assignment.title}</strong>
                  <p>
                    {assignment.due_date}
                    {assignment.due_time ? ` | ${assignment.due_time.slice(0, 5)}` : ""}
                  </p>
                </div>
                <span className="tag">{assignment.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Upcoming Study Sessions</h3>
        {upcomingSchedules.length === 0 ? (
          <p className="helper-text">
            No schedule items yet. Add one from the Schedule page to build your study plan.
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
