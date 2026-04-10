import { useEffect, useState } from "react";

import { scheduleApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  description: "",
  schedule_date: "",
  start_time: "",
  end_time: "",
  location: "",
  notes: "",
};

export default function SchedulePage() {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadSchedules() {
    try {
      const items = await scheduleApi.list(token);
      setSchedules(items);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      if (editingId) {
        await scheduleApi.update(token, editingId, formData);
        setSuccessMessage("Schedule item updated.");
      } else {
        await scheduleApi.create(token, formData);
        setSuccessMessage("Schedule item created.");
      }

      resetForm();
      await loadSchedules();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setFormData({
      title: schedule.title,
      description: schedule.description || "",
      schedule_date: schedule.schedule_date,
      start_time: schedule.start_time.slice(0, 5),
      end_time: schedule.end_time.slice(0, 5),
      location: schedule.location || "",
      notes: schedule.notes || "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = async (scheduleId) => {
    setError("");
    setSuccessMessage("");

    try {
      await scheduleApi.remove(token, scheduleId);
      if (editingId === scheduleId) {
        resetForm();
      }
      setSuccessMessage("Schedule item deleted.");
      await loadSchedules();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Schedule Foundation</p>
          <h2>Study Schedule</h2>
        </div>
        <p className="helper-text">
          This page is the first schedule system scaffold. It can grow into a full calendar later.
        </p>
      </div>

      <div className="schedule-grid">
        <article className="card">
          <h3>{editingId ? "Edit Schedule Item" : "Add Schedule Item"}</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="span-2">
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Review chapter 4"
                required
              />
            </label>

            <label className="span-2">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Optional notes about this study session"
              />
            </label>

            <label>
              Date
              <input
                type="date"
                name="schedule_date"
                value={formData.schedule_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Location
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Library or online"
              />
            </label>

            <label>
              Start Time
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Time
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </label>

            <label className="span-2">
              Notes
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Optional reminders or preparation details"
              />
            </label>

            {error ? <p className="error-text span-2">{error}</p> : null}
            {successMessage ? <p className="success-text span-2">{successMessage}</p> : null}

            <div className="button-row span-2">
              <button type="submit" className="button" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update Schedule Item"
                    : "Create Schedule Item"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="card">
          <h3>Saved Schedule Items</h3>

          {schedules.length === 0 ? (
            <p className="helper-text">No schedule items yet. Create your first study block here.</p>
          ) : (
            <div className="list-stack">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="list-item schedule-item">
                  <div>
                    <strong>{schedule.title}</strong>
                    <p>
                      {schedule.schedule_date} | {schedule.start_time.slice(0, 5)} -{" "}
                      {schedule.end_time.slice(0, 5)}
                    </p>
                    <p>{schedule.description || "No description added yet."}</p>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleEdit(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
