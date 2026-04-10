import { useEffect, useState } from "react";

import { aiApi, dashboardApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

function getPriorityLabel(priority) {
  if (priority === 1) {
    return "High priority";
  }
  if (priority === 2) {
    return "Medium priority";
  }
  return "Low priority";
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [aiPlaceholder, setAiPlaceholder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [summaryData, aiData] = await Promise.all([
          dashboardApi.getSummary(token),
          aiApi.getPlaceholder(),
        ]);
        setSummary(summaryData);
        setAiPlaceholder(aiData);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadDashboardData();
  }, [token]);

  const upcomingAssignments = summary?.upcoming_deadlines || [];
  const upcomingSchedules = summary?.upcoming_schedule_items || [];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Hello, {user?.full_name}</h2>
        </div>
        <p className="helper-text">
          This prototype now tracks your courses, assignments, study schedule, and future AI study guidance.
        </p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="dashboard-grid">
        <article className="card stat-card">
          <h3>Courses</h3>
          <p className="stat-number">{summary?.course_count ?? 0}</p>
          <p className="helper-text">Courses added so far for your semester plan.</p>
        </article>

        <article className="card stat-card">
          <h3>Schedule Items</h3>
          <p className="stat-number">{summary?.schedule_count ?? 0}</p>
          <p className="helper-text">Study sessions currently saved to your account.</p>
        </article>

        <article className="card stat-card">
          <h3>Assignments</h3>
          <p className="stat-number">{summary?.assignment_count ?? 0}</p>
          <p className="helper-text">Assignments tracked for your current courses.</p>
        </article>

        <article className="card stat-card">
          <h3>Pending Work</h3>
          <p className="stat-number">{summary?.pending_assignment_count ?? 0}</p>
          <p className="helper-text">Assignments that still need attention.</p>
        </article>
      </div>

      <div className="dashboard-detail-grid">
        <div className="card">
          <h3>Upcoming Deadlines</h3>
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
                    <p>{assignment.course_name}</p>
                    <p>
                      {assignment.due_date}
                      {assignment.due_time ? ` | ${assignment.due_time.slice(0, 5)}` : ""}
                    </p>
                  </div>
                  <span className="tag">
                    {assignment.status} | {getPriorityLabel(assignment.priority)}
                  </span>
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
      </div>

      <div className="card ai-placeholder-card">
        <div className="ai-placeholder-header">
          <div>
            <p className="eyebrow">AI Foundation</p>
            <h3>{aiPlaceholder?.title || "AI Study Recommendations"}</h3>
          </div>
          <span className="tag">
            {aiPlaceholder?.status === "placeholder" ? "Coming next" : aiPlaceholder?.status}
          </span>
        </div>

        <p className="helper-text">
          {aiPlaceholder?.message ||
            "AI recommendations are not fully implemented yet, but the project structure is ready."}
        </p>

        <div className="ai-placeholder-notes">
          <div className="ai-note">
            <strong>Planned inputs</strong>
            <p>Courses, assignments, due dates, and study schedule data.</p>
          </div>

          <div className="ai-note">
            <strong>Next step</strong>
            <p>{aiPlaceholder?.next_step || "Connect the dashboard data to a future AI service."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
