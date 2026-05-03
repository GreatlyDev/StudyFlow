import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { reminderApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

function getReminderDateTime(reminder) {
  return new Date(`${reminder.reminder_date}T${reminder.reminder_time || "09:00"}`);
}

function getAlertKey(reminder) {
  return `studyflow-reminder-alert-${reminder.id}-${reminder.reminder_date}-${reminder.reminder_time || "day"}`;
}

function getDueReminder(reminders) {
  const now = new Date();

  return reminders
    .filter((reminder) => !reminder.is_done)
    .filter((reminder) => {
      const reminderDate = getReminderDateTime(reminder);
      return reminderDate <= now && !localStorage.getItem(getAlertKey(reminder));
    })
    .sort((first, second) => getReminderDateTime(first) - getReminderDateTime(second))[0];
}

export default function ReminderAlerts() {
  const { token } = useAuth();
  const [activeReminder, setActiveReminder] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkReminders() {
      if (!token || activeReminder) {
        return;
      }

      try {
        const reminders = await reminderApi.list(token);
        const dueReminder = getDueReminder(reminders);

        if (dueReminder && isMounted) {
          localStorage.setItem(getAlertKey(dueReminder), "seen");
          setActiveReminder(dueReminder);
        }
      } catch {
        // Reminder alerts should never interrupt the rest of the app.
      }
    }

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [activeReminder, token]);

  if (!activeReminder) {
    return null;
  }

  return (
    <div className="reminder-alert" role="status" aria-live="polite">
      <div>
        <p className="eyebrow">Reminder Alert</p>
        <h3>{activeReminder.title}</h3>
        <p>{activeReminder.message || "It is time for one of your StudyFlow reminders."}</p>
      </div>

      <div className="reminder-alert-actions">
        <Link className="button button-secondary" to="/reminders">
          View
        </Link>
        <button
          type="button"
          className="button"
          onClick={() => setActiveReminder(null)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
