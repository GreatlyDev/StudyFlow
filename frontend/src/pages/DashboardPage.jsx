import { useEffect, useState } from "react";

import { aiApi, dashboardApi, reminderApi } from "../api/client";
import CalendarWidget from "../components/CalendarWidget";
import StudyPlanTimeline from "../components/StudyPlanTimeline";
import { useAuth } from "../context/AuthContext";

function buildDate(dateString, timeString) {
  const fallbackTime = timeString || "12:00";
  return new Date(`${dateString}T${fallbackTime}`);
}

function formatTimeLabel(timeString) {
  if (!timeString) {
    return "Any time";
  }

  const [hourText, minuteText] = timeString.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;

  if (minuteText && minuteText !== "00") {
    return `${normalizedHour}:${minuteText} ${suffix}`;
  }

  return `${normalizedHour} ${suffix}`;
}

function formatDueSummary(assignment) {
  const priorityLabel =
    assignment.priority === 1
      ? "High priority"
      : assignment.priority === 2
        ? "Medium priority"
        : "Low priority";

  return `${assignment.status} - ${priorityLabel}`;
}

function sortSchedules(items) {
  return [...items].sort((first, second) => {
    return (
      buildDate(first.schedule_date, first.start_time).getTime() -
      buildDate(second.schedule_date, second.start_time).getTime()
    );
  });
}

function sortAssignments(items) {
  return [...items].sort((first, second) => {
    return (
      buildDate(first.due_date, first.due_time || "12:00").getTime() -
      buildDate(second.due_date, second.due_time || "12:00").getTime()
    );
  });
}

function sortReminders(items) {
  return [...items].sort((first, second) => {
    return (
      buildDate(first.reminder_date, first.reminder_time || "23:59").getTime() -
      buildDate(second.reminder_date, second.reminder_time || "23:59").getTime()
    );
  });
}

function buildTimelineItems(summary) {
  const schedules = sortSchedules(summary?.upcoming_schedule_items || []);
  const assignments = sortAssignments(summary?.upcoming_deadlines || []);

  const firstSchedule = schedules[0];
  const secondSchedule = schedules[1];
  const focusAssignment =
    assignments.find((assignment) => assignment.status !== "completed") || assignments[0];
  const laterItem = secondSchedule || assignments[1];

  const items = [
    firstSchedule
      ? {
          id: `schedule-${firstSchedule.id}`,
          timeLabel: formatTimeLabel(firstSchedule.start_time),
          subtitle: `${firstSchedule.location || "Study session"} - Scheduled`,
          title: firstSchedule.title,
          variant: "standard",
        }
      : {
          id: "default-review",
          timeLabel: "10 AM",
          subtitle: "CS 101 - Lecture Review",
          title: "Data Structures & Algorithms",
          variant: "standard",
        },
    {
      id: "lunch-break",
      timeLabel: "11 AM",
      title: "Lunch break",
      variant: "blocked",
    },
    focusAssignment
      ? {
          id: `assignment-${focusAssignment.id}`,
          timeLabel: formatTimeLabel(focusAssignment.due_time || "13:00"),
          subtitle: `${focusAssignment.course_name || "Upcoming task"} - Exam Prep`,
          title: focusAssignment.title,
          footer: formatDueSummary(focusAssignment),
          badge: "AI Recommended",
          variant: "primary",
        }
      : {
          id: "default-focus",
          timeLabel: "1 PM",
          subtitle: "Biology 204 - Exam Prep",
          title: "Cellular Respiration Quiz",
          footer: "Focus session: 2 hrs",
          badge: "AI Recommended",
          variant: "primary",
        },
    laterItem
      ? {
          id: laterItem.schedule_date
            ? `later-schedule-${laterItem.id}`
            : `later-assignment-${laterItem.id}`,
          timeLabel: laterItem.schedule_date
            ? formatTimeLabel(laterItem.start_time)
            : formatTimeLabel(laterItem.due_time || "15:00"),
          subtitle: laterItem.schedule_date
            ? `${laterItem.location || "Study session"} - Planned`
            : `${laterItem.course_name || "Course task"} - Due Soon`,
          title: laterItem.title,
          variant: "standard",
        }
      : {
          id: "default-reading",
          timeLabel: "3 PM",
          subtitle: "Literature 102 - Reading",
          title: "Read Chapters 4-6",
          variant: "standard",
        },
  ];

  return items.map((item, index) => ({
    ...item,
    isLast: index === items.length - 1,
  }));
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [aiPlaceholder, setAiPlaceholder] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [summaryData, aiData, reminderItems] = await Promise.all([
          dashboardApi.getSummary(token),
          aiApi.getPlaceholder(),
          reminderApi.list(token),
        ]);
        setSummary(summaryData);
        setAiPlaceholder(aiData);
        setReminders(reminderItems);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadDashboardData();
  }, [token]);

  const upcomingAssignments = sortAssignments(summary?.upcoming_deadlines || []);
  const upcomingSchedules = sortSchedules(summary?.upcoming_schedule_items || []);
  const activeReminders = sortReminders(reminders.filter((reminder) => !reminder.is_done));
  const nextReminder = activeReminders[0];
  const timelineItems = buildTimelineItems(summary);

  const eventDates = [
    ...upcomingAssignments.map((assignment) => assignment.due_date),
    ...upcomingSchedules.map((schedule) => schedule.schedule_date),
    ...activeReminders.map((reminder) => reminder.reminder_date),
  ];

  const focusDateString =
    upcomingAssignments[0]?.due_date || upcomingSchedules[0]?.schedule_date || null;
  const focusDate = focusDateString ? new Date(`${focusDateString}T12:00`) : new Date();

  return (
    <div className="content-grid">
      <section className="schedule-section">
        <div className="dashboard-hero-card">
          <div>
            <p className="eyebrow">StudyFlow Pulse</p>
            <h2>{timelineItems[2]?.title || "Build today's study plan"}</h2>
            <p>
              {nextReminder
                ? `Next reminder: ${nextReminder.title} at ${formatTimeLabel(nextReminder.reminder_time)}`
                : "Connect courses, assignments, schedules, and reminders to keep the day organized."}
            </p>
          </div>

          <div className="dashboard-hero-stats">
            <span>
              <strong>{summary?.course_count ?? 0}</strong>
              Courses
            </span>
            <span>
              <strong>{summary?.assignment_count ?? 0}</strong>
              Assignments
            </span>
            <span>
              <strong>{activeReminders.length}</strong>
              Reminders
            </span>
          </div>
        </div>

        <div className="section-header">
          <span>Study Plan</span>
          <button type="button" className="btn-icon" aria-label="More study plan options">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>

        {error ? <p className="error-text">{error}</p> : null}

        <StudyPlanTimeline items={timelineItems} />
      </section>

      <section className="overview-section">
        <div className="overview-stack">
          <CalendarWidget
            displayDate={focusDate}
            selectedDate={focusDate}
            eventDates={eventDates}
          />

          <div className="insight-card" id="ai-foundation">
            <p className="eyebrow">AI Foundation</p>
            <h3>{aiPlaceholder?.title || "AI Study Recommendations"}</h3>
            <p className="helper-text">
              {aiPlaceholder?.message ||
                "AI recommendations are not fully implemented yet, but the project structure is ready."}
            </p>

            <div className="insight-chip-row">
              <span className="insight-chip">Courses: {summary?.course_count ?? 0}</span>
              <span className="insight-chip">Assignments: {summary?.assignment_count ?? 0}</span>
              <span className="insight-chip">Pending: {summary?.pending_assignment_count ?? 0}</span>
            </div>

            <div className="mini-summary-grid">
              <div className="mini-summary-card">
                <span className="mini-summary-label">Student</span>
                <strong>{user?.full_name}</strong>
              </div>
              <div className="mini-summary-card">
                <span className="mini-summary-label">Next step</span>
                <strong>{aiPlaceholder?.next_step || "Connect future AI study guidance"}</strong>
              </div>
            </div>
          </div>

          <div className="insight-card dashboard-reminders-card">
            <div className="section-header section-header-tight">
              <span>Upcoming Reminders</span>
            </div>

            {activeReminders.length === 0 ? (
              <p className="helper-text">
                No active reminders yet. Add one from the Reminders page to show alerts here.
              </p>
            ) : (
              <div className="dashboard-reminder-list">
                {activeReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="dashboard-reminder-item">
                    <span className="notification-dot dashboard-reminder-dot" />
                    <div>
                      <strong>{reminder.title}</strong>
                      <p>
                        {reminder.reminder_date} | {formatTimeLabel(reminder.reminder_time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stats-panel">
            <div className="section-header section-header-tight">
              <span>Quick Snapshot</span>
            </div>
            <div className="mini-summary-grid">
              <div className="mini-summary-card">
                <span className="mini-summary-label">Study Blocks</span>
                <strong>{summary?.schedule_count ?? 0}</strong>
              </div>
              <div className="mini-summary-card">
                <span className="mini-summary-label">Upcoming Deadlines</span>
                <strong>{upcomingAssignments.length}</strong>
              </div>
              <div className="mini-summary-card">
                <span className="mini-summary-label">Courses</span>
                <strong>{summary?.course_count ?? 0}</strong>
              </div>
              <div className="mini-summary-card">
                <span className="mini-summary-label">Active Focus</span>
                <strong>{timelineItems[2]?.title || "No task selected"}</strong>
              </div>
              <div className="mini-summary-card">
                <span className="mini-summary-label">Active Reminders</span>
                <strong>{activeReminders.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
