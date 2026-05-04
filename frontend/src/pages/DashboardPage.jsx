import { useEffect, useState } from "react";

import { aiApi, dashboardApi, reminderApi, scheduleApi } from "../api/client";
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

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeForApi(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function addMinutes(date, minutes) {
  const nextDate = new Date(date);
  nextDate.setMinutes(nextDate.getMinutes() + minutes);
  return nextDate;
}

function roundToNextSlot(date, stepMinutes = 30) {
  const roundedDate = new Date(date);
  roundedDate.setSeconds(0, 0);

  const minutes = roundedDate.getMinutes();
  const remainder = minutes % stepMinutes;
  const minutesToAdd = remainder === 0 ? stepMinutes : stepMinutes - remainder;
  roundedDate.setMinutes(minutes + minutesToAdd);

  return roundedDate;
}

function buildAiSuggestionSlot(index, now = new Date()) {
  const firstSlot = roundToNextSlot(addMinutes(now, 60));
  const suggestedStart = addMinutes(firstSlot, index * 60);

  if (suggestedStart.getHours() >= 22) {
    const tomorrowMorning = new Date(now);
    tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
    tomorrowMorning.setHours(9 + index, 0, 0, 0);
    return {
      start: tomorrowMorning,
      end: addMinutes(tomorrowMorning, 45),
    };
  }

  return {
    start: suggestedStart,
    end: addMinutes(suggestedStart, 45),
  };
}

function getRecommendationKey(recommendation, index) {
  return `${recommendation.category}-${recommendation.title}-${index}`;
}

function getAiModeLabel(status) {
  return status === "openai" ? "OpenAI connected" : "Foundation mode";
}

function isFutureReminder(reminder, now = new Date()) {
  return buildDate(reminder.reminder_date, reminder.reminder_time || "23:59").getTime() >= now.getTime();
}

function buildTimelineItems(summary, recommendations = [], options = {}) {
  const {
    addedRecommendationKeys = new Set(),
    onAddRecommendation,
    savingRecommendationKey,
  } = options;
  const schedules = sortSchedules(summary?.upcoming_schedule_items || []);
  const assignments = sortAssignments(summary?.upcoming_deadlines || []);

  const scheduleItems = schedules.map((schedule) => ({
    id: `schedule-${schedule.id}`,
    sortDate: buildDate(schedule.schedule_date, schedule.start_time),
    timeLabel: formatTimeLabel(schedule.start_time),
    subtitle: `${schedule.location || "Study session"} - Scheduled`,
    title: schedule.title,
    footer: `${formatTimeLabel(schedule.start_time)} - ${formatTimeLabel(schedule.end_time)}`,
    variant: "standard",
  }));

  const assignmentItems = assignments.map((assignment, index) => ({
    id: `assignment-${assignment.id}`,
    sortDate: buildDate(assignment.due_date, assignment.due_time || "23:59"),
    timeLabel: assignment.due_time ? formatTimeLabel(assignment.due_time) : "Due today",
    subtitle: `${assignment.course_name || "Course task"} - Upcoming deadline`,
    title: assignment.title,
    footer: formatDueSummary(assignment),
    badge: index === 0 ? "AI Recommended" : undefined,
    variant: index === 0 ? "primary" : "standard",
  }));

  const aiSuggestionItems = recommendations
    .slice(0, 3)
    .map((recommendation, index) => {
      const recommendationKey = getRecommendationKey(recommendation, index);
      const suggestedSlot = buildAiSuggestionSlot(index);

      return {
        id: `ai-${recommendationKey}`,
        recommendationKey,
        sortDate: suggestedSlot.start,
        timeLabel: formatTimeLabel(formatTimeForApi(suggestedSlot.start)),
        subtitle: `${recommendation.category} - AI suggestion`,
        title: recommendation.title,
        footer: recommendation.action || recommendation.reason,
        badge: "AI Suggestion",
        variant: "ai",
        actionLabel:
          savingRecommendationKey === recommendationKey ? "Adding..." : "Add to Schedule",
        actionDisabled: savingRecommendationKey === recommendationKey,
        onAction: onAddRecommendation
          ? () => onAddRecommendation(recommendation, index, suggestedSlot, recommendationKey)
          : undefined,
      };
    })
    .filter((item) => !addedRecommendationKeys.has(item.recommendationKey));

  const items = [...scheduleItems, ...assignmentItems, ...aiSuggestionItems]
    .sort((first, second) => first.sortDate.getTime() - second.sortDate.getTime())
    .slice(0, 6);

  return items.map((item, index) => ({
    ...item,
    isLast: index === items.length - 1,
  }));
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingRecommendationKey, setSavingRecommendationKey] = useState("");
  const [addedRecommendationKeys, setAddedRecommendationKeys] = useState(() => new Set());

  async function loadDashboardData() {
    try {
      const [summaryData, recommendationResult, reminderItems] = await Promise.all([
        dashboardApi.getSummary(token),
        aiApi.getRecommendations(token).catch(() => null),
        reminderApi.list(token),
      ]);
      setSummary(summaryData);
      setAiRecommendations(recommendationResult);
      setReminders(reminderItems);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  async function handleAddRecommendation(recommendation, index, suggestedSlot, recommendationKey) {
    setError("");
    setSuccessMessage("");
    setSavingRecommendationKey(recommendationKey);

    try {
      await scheduleApi.create(token, {
        title: recommendation.title,
        description: recommendation.reason,
        schedule_date: formatDateForApi(suggestedSlot.start),
        start_time: formatTimeForApi(suggestedSlot.start),
        end_time: formatTimeForApi(suggestedSlot.end),
        location: "AI study plan",
        notes: recommendation.action || "Added from StudyFlow AI recommendation.",
      });

      setAddedRecommendationKeys((currentKeys) => {
        const nextKeys = new Set(currentKeys);
        nextKeys.add(recommendationKey);
        return nextKeys;
      });
      setSuccessMessage("AI recommendation added to your schedule.");
      await loadDashboardData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingRecommendationKey("");
    }
  }

  const upcomingAssignments = sortAssignments(summary?.upcoming_deadlines || []);
  const upcomingSchedules = sortSchedules(summary?.upcoming_schedule_items || []);
  const now = new Date();
  const activeReminders = sortReminders(
    reminders.filter((reminder) => !reminder.is_done && isFutureReminder(reminder, now)),
  );
  const nextReminder = activeReminders[0];
  const timelineItems = buildTimelineItems(summary, aiRecommendations?.recommendations || [], {
    addedRecommendationKeys,
    onAddRecommendation: handleAddRecommendation,
    savingRecommendationKey,
  });
  const activeFocus = timelineItems.find((item) => item.variant === "primary") || timelineItems[0];

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
            <h2>{activeFocus?.title || "Build today's study plan"}</h2>
            <p>
              {nextReminder
                ? `Next reminder: ${nextReminder.title} at ${formatTimeLabel(nextReminder.reminder_time)}`
                : activeFocus
                  ? `Next study item: ${activeFocus.subtitle}`
                  : "Add a course, assignment, schedule, or reminder to start filling this dashboard with live data."}
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
        {successMessage ? <p className="success-text">{successMessage}</p> : null}

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
            <h3>{aiRecommendations?.title || "AI Study Recommendations"}</h3>
            <p className="helper-text">
              {aiRecommendations?.summary ||
                "Add study data to generate focused recommendations for your next study session."}
            </p>

            <div className="insight-chip-row">
              <span className="insight-chip">{getAiModeLabel(aiRecommendations?.status)}</span>
              <span className="insight-chip">Courses: {summary?.course_count ?? 0}</span>
              <span className="insight-chip">Assignments: {summary?.assignment_count ?? 0}</span>
              <span className="insight-chip">Pending: {summary?.pending_assignment_count ?? 0}</span>
            </div>

            <div className="dashboard-ai-preview-list">
              {(aiRecommendations?.recommendations || []).slice(0, 2).map((recommendation) => (
                <div key={`${recommendation.category}-${recommendation.title}`} className="dashboard-ai-preview">
                  <span className="tag">{recommendation.category}</span>
                  <strong>{recommendation.title}</strong>
                </div>
              ))}
            </div>

            <div className="dashboard-context-card">
              <span className="mini-summary-label">Signed in as</span>
              <strong>{user?.full_name}</strong>
              <p className="helper-text">
                Recommendations update from your saved courses, deadlines, schedules,
                reminders, study materials, and flashcards.
              </p>
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
                <strong>{activeFocus?.title || "No task selected"}</strong>
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
