import { useEffect, useState } from "react";

import { courseApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  code: "",
  instructor: "",
  term: "",
  description: "",
};

export default function CoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadCourses() {
    try {
      const items = await courseApi.list(token);
      setCourses(items);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadCourses();
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
        await courseApi.update(token, editingId, formData);
        setSuccessMessage("Course updated.");
      } else {
        await courseApi.create(token, formData);
        setSuccessMessage("Course created.");
      }

      resetForm();
      await loadCourses();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      code: course.code || "",
      instructor: course.instructor || "",
      term: course.term || "",
      description: course.description || "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = async (courseId) => {
    setError("");
    setSuccessMessage("");

    try {
      await courseApi.remove(token, courseId);
      if (editingId === courseId) {
        resetForm();
      }
      setSuccessMessage("Course deleted.");
      await loadCourses();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Course Foundation</p>
          <h2>Courses</h2>
        </div>
        <p className="helper-text">
          Add your classes here first so assignments and future dashboard views have a home.
        </p>
      </div>

      <div className="schedule-grid">
        <article className="card">
          <h3>{editingId ? "Edit Course" : "Add Course"}</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="span-2">
              Course Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Introduction to Software Engineering"
                required
              />
            </label>

            <label>
              Course Code
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="COSC 458"
              />
            </label>

            <label>
              Term
              <input
                type="text"
                name="term"
                value={formData.term}
                onChange={handleChange}
                placeholder="Spring 2026"
              />
            </label>

            <label className="span-2">
              Instructor
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="Professor Smith"
              />
            </label>

            <label className="span-2">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Optional notes about the course"
              />
            </label>

            {error ? <p className="error-text span-2">{error}</p> : null}
            {successMessage ? <p className="success-text span-2">{successMessage}</p> : null}

            <div className="button-row span-2">
              <button type="submit" className="button" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Update Course" : "Create Course"}
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
          <h3>Saved Courses</h3>

          {courses.length === 0 ? (
            <p className="helper-text">No courses yet. Add one so the rest of the app has context.</p>
          ) : (
            <div className="list-stack">
              {courses.map((course) => (
                <div key={course.id} className="list-item schedule-item">
                  <div>
                    <strong>{course.name}</strong>
                    <p>{course.code || "No course code set"}</p>
                    <p>{course.term || "No term set"}</p>
                    <p>{course.instructor || "No instructor set"}</p>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => handleDelete(course.id)}
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
