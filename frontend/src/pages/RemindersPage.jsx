import { useEffect, useState } from "react";

import { assignmentApi, reminderApi, scheduleApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  message: "",
  reminder_type: "general",
  reminder_date: "",
  reminder_time: "",
  assignment_id: "",
  schedule_id: "",
};

const reminderTypes = [
  { value: "general", label: "General reminder" },
  { value: "assignment", label: "Assignment reminder" },
  { value: "schedule", label: "Study schedule reminder" },
  { value: "exam", label: "Exam reminder" },
];

function formatTime(timeValue) {
  return timeValue ? timeValue.slice(0, 5) : "Any time";
}

function getNextReminder(reminders) {
  return reminders
    .filter((reminder) => !reminder.is_done)
    .slice()
    .sort((first, second) => {
      const firstDate = `${first.reminder_date}T${first.reminder_time || "23:59"}`;
      const secondDate = `${second.reminder_date}T${second.reminder_time || "23:59"}`;
      return firstDate.localeCompare(secondDate);
    })[0];
}

export default function RemindersPage() {
  const { token } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const assignmentTitleMap = Object.fromEntries(
    assignments.map((assignment) => [assignment.id, assignment.title]),
  );
  const scheduleTitleMap = Object.fromEntries(
    schedules.map((schedule) => [schedule.id, schedule.title]),
  );
  const nextReminder = getNextReminder(reminders);

  async function loadPageData() {
    try {
      const [reminderItems, assignmentItems, scheduleItems] = await Promise.all([
        reminderApi.list(token),
        assignmentApi.list(token),
        scheduleApi.list(token),
      ]);
      setReminders(reminderItems);
      setAssignments(assignmentItems);
      setSchedules(scheduleItems);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadPageData();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const buildPayload = () => ({
    ...formData,
    reminder_time: formData.reminder_time || null,
    assignment_id: formData.assignment_id ? Number(formData.assignment_id) : null,
    schedule_id: formData.schedule_id ? Number(formData.schedule_id) : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      if (editingId) {
        await reminderApi.update(token, editingId, buildPayload());
        setSuccessMessage("Reminder updated.");
      } else {
        await reminderApi.create(token, buildPayload());
        setSuccessMessage("Reminder created.");
      }

      resetForm();
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (reminder) => {
    setEditingId(reminder.id);
    setFormData({
      title: reminder.title,
      message: reminder.message || "",
      reminder_type: reminder.reminder_type,
      reminder_date: reminder.reminder_date,
      reminder_time: reminder.reminder_time ? reminder.reminder_time.slice(0, 5) : "",
      assignment_id: reminder.assignment_id ? String(reminder.assignment_id) : "",
      schedule_id: reminder.schedule_id ? String(reminder.schedule_id) : "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleToggleDone = async (reminder) => {
    setError("");
    setSuccessMessage("");

    try {
      await reminderApi.update(token, reminder.id, { is_done: !reminder.is_done });
      setSuccessMessage(reminder.is_done ? "Reminder reopened." : "Reminder marked done.");
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (reminderId) => {
    setError("");
    setSuccessMessage("");

    try {
      await reminderApi.remove(token, reminderId);
      if (editingId === reminderId) {
        resetForm();
      }
      setSuccessMessage("Reminder deleted.");
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Reminder Foundation</p>
          <h2>Reminders</h2>
        </div>
        <p className="helper-text">
          Manage assignment and study-session reminders here. Real push/email alerts can be added later.
        </p>
      </div>

      <div className="reminders-grid">
        <article className="card">
          <h3>{editingId ? "Edit Reminder" : "Add Reminder"}</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="span-2">
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Study for biology quiz"
                required
              />
            </label>

            <label>
              Reminder Type
              <select
                name="reminder_type"
                value={formData.reminder_type}
                onChange={handleChange}
              >
                {reminderTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                name="reminder_date"
                value={formData.reminder_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Time
              <input
                type="time"
                name="reminder_time"
                value={formData.reminder_time}
                onChange={handleChange}
              />
            </label>

            <label>
              Assignment Link
              <select
                name="assignment_id"
                value={formData.assignment_id}
                onChange={handleChange}
              >
                <option value="">No assignment linked</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Schedule Link
              <select name="schedule_id" value={formData.schedule_id} onChange={handleChange}>
                <option value="">No schedule item linked</option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="span-2">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="What should StudyFlow remind you about?"
              />
            </label>

            {error ? <p className="error-text span-2">{error}</p> : null}
            {successMessage ? <p className="success-text span-2">{successMessage}</p> : null}

            <div className="button-row span-2">
              <button type="submit" className="button" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Update Reminder" : "Create Reminder"}
              </button>

              {editingId ? (
                <button type="button" className="button button-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <aside className="overview-stack">
          <article className="notification-preview-card">
            <div>
              <p className="eyebrow">Notification Preview</p>
              <h3>{nextReminder ? nextReminder.title : "No active reminders yet"}</h3>
              <p>
                {nextReminder
                  ? `${nextReminder.reminder_date} at ${formatTime(nextReminder.reminder_time)}`
                  : "Create a reminder to preview how alerts will show up in StudyFlow."}
              </p>
            </div>

            <div className="notification-phone">
              <span className="notification-dot" />
              <strong>StudyFlow Reminder</strong>
              <p>
                {nextReminder?.message ||
                  "Future browser, email, or text notifications will use this reminder data."}
              </p>
            </div>

            <div className="insight-chip-row">
              <span className="insight-chip">Prototype mode</span>
              <span className="insight-chip">Browser alerts later</span>
              <span className="insight-chip">Email/SMS future</span>
            </div>
          </article>

          <article className="card">
            <h3>Saved Reminders</h3>

            {reminders.length === 0 ? (
              <p className="helper-text">No reminders yet. Add one to start tracking alerts.</p>
            ) : (
              <div className="list-stack">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="list-item reminder-item">
                    <div>
                      <div className="reminder-title-row">
                        <strong>{reminder.title}</strong>
                        <span className={`tag ${reminder.is_done ? "tag-muted" : ""}`}>
                          {reminder.is_done ? "done" : reminder.reminder_type}
                        </span>
                      </div>
                      <p>
                        {reminder.reminder_date} | {formatTime(reminder.reminder_time)}
                      </p>
                      {reminder.assignment_id ? (
                        <p>Assignment: {assignmentTitleMap[reminder.assignment_id] || "Linked item"}</p>
                      ) : null}
                      {reminder.schedule_id ? (
                        <p>Schedule: {scheduleTitleMap[reminder.schedule_id] || "Linked item"}</p>
                      ) : null}
                      <p>{reminder.message || "No message added yet."}</p>
                    </div>

                    <div className="item-actions">
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleToggleDone(reminder)}
                      >
                        {reminder.is_done ? "Reopen" : "Done"}
                      </button>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleEdit(reminder)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
}
