import { useEffect, useState } from "react";

import { assignmentApi, courseApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  course_id: "",
  title: "",
  description: "",
  due_date: "",
  due_time: "",
  status: "pending",
  priority: 2,
  notes: "",
};

const statusOptions = ["pending", "in progress", "completed"];

export default function AssignmentsPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const courseNameMap = Object.fromEntries(courses.map((course) => [course.id, course.name]));

  async function loadPageData() {
    try {
      const [courseItems, assignmentItems] = await Promise.all([
        courseApi.list(token),
        assignmentApi.list(token),
      ]);
      setCourses(courseItems);
      setAssignments(assignmentItems);
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
    course_id: Number(formData.course_id),
    priority: Number(formData.priority),
    due_time: formData.due_time || null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      if (editingId) {
        await assignmentApi.update(token, editingId, buildPayload());
        setSuccessMessage("Assignment updated.");
      } else {
        await assignmentApi.create(token, buildPayload());
        setSuccessMessage("Assignment created.");
      }

      resetForm();
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.id);
    setFormData({
      course_id: String(assignment.course_id),
      title: assignment.title,
      description: assignment.description || "",
      due_date: assignment.due_date,
      due_time: assignment.due_time ? assignment.due_time.slice(0, 5) : "",
      status: assignment.status,
      priority: assignment.priority,
      notes: assignment.notes || "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = async (assignmentId) => {
    setError("");
    setSuccessMessage("");

    try {
      await assignmentApi.remove(token, assignmentId);
      if (editingId === assignmentId) {
        resetForm();
      }
      setSuccessMessage("Assignment deleted.");
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Assignment Foundation</p>
          <h2>Assignments</h2>
        </div>
        <p className="helper-text">
          Track due dates here so the dashboard can show real upcoming work.
        </p>
      </div>

      {courses.length === 0 ? (
        <article className="card">
          <h3>Add a course first</h3>
          <p className="helper-text">
            Assignments belong to courses, so create at least one course before adding assignments.
          </p>
        </article>
      ) : (
        <div className="schedule-grid">
          <article className="card">
            <h3>{editingId ? "Edit Assignment" : "Add Assignment"}</h3>

            <form className="form-grid" onSubmit={handleSubmit}>
              <label className="span-2">
                Course
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="span-2">
                Title
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Midterm study guide"
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
                  placeholder="Optional assignment details"
                />
              </label>

              <label>
                Due Date
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Due Time
                <input
                  type="time"
                  name="due_time"
                  value={formData.due_time}
                  onChange={handleChange}
                />
              </label>

              <label>
                Status
                <select name="status" value={formData.status} onChange={handleChange}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </select>
              </label>

              <label className="span-2">
                Notes
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional reminders or study notes"
                />
              </label>

              {error ? <p className="error-text span-2">{error}</p> : null}
              {successMessage ? <p className="success-text span-2">{successMessage}</p> : null}

              <div className="button-row span-2">
                <button type="submit" className="button" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingId ? "Update Assignment" : "Create Assignment"}
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
            <h3>Saved Assignments</h3>

            {assignments.length === 0 ? (
              <p className="helper-text">No assignments yet. Add one to start deadline tracking.</p>
            ) : (
              <div className="list-stack">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="list-item schedule-item">
                    <div>
                      <strong>{assignment.title}</strong>
                      <p>{courseNameMap[assignment.course_id] || "Unknown course"}</p>
                      <p>
                        Due {assignment.due_date}
                        {assignment.due_time ? ` at ${assignment.due_time.slice(0, 5)}` : ""}
                      </p>
                      <p>
                        {assignment.status} | priority {assignment.priority}
                      </p>
                    </div>

                    <div className="item-actions">
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleEdit(assignment)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() => handleDelete(assignment.id)}
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
      )}
    </section>
  );
}
