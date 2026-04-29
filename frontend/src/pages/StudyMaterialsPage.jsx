import { useEffect, useState } from "react";

import { courseApi, studyMaterialApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  content: "",
  source_type: "typed",
  course_id: "",
};

const sourceTypeOptions = ["typed", "paste", "uploaded notes", "lecture notes"];

export default function StudyMaterialsPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const courseNameMap = Object.fromEntries(courses.map((course) => [course.id, course.name]));

  async function loadPageData() {
    try {
      const [courseItems, materialItems] = await Promise.all([
        courseApi.list(token),
        studyMaterialApi.list(token),
      ]);
      setCourses(courseItems);
      setMaterials(materialItems);
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
    course_id: formData.course_id ? Number(formData.course_id) : null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      if (editingId) {
        await studyMaterialApi.update(token, editingId, buildPayload());
        setSuccessMessage("Study material updated.");
      } else {
        await studyMaterialApi.create(token, buildPayload());
        setSuccessMessage("Study material saved.");
      }

      resetForm();
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (material) => {
    setEditingId(material.id);
    setFormData({
      title: material.title,
      content: material.content,
      source_type: material.source_type,
      course_id: material.course_id ? String(material.course_id) : "",
    });
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = async (materialId) => {
    setError("");
    setSuccessMessage("");

    try {
      await studyMaterialApi.remove(token, materialId);
      if (editingId === materialId) {
        resetForm();
      }
      setSuccessMessage("Study material deleted.");
      await loadPageData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Study Material Foundation</p>
          <h2>Study Materials</h2>
        </div>
        <p className="helper-text">
          Save notes here first so future flashcards, quizzes, and AI help have material to use.
        </p>
      </div>

      <div className="schedule-grid">
        <article className="card">
          <h3>{editingId ? "Edit Study Material" : "Add Study Material"}</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="span-2">
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Cellular respiration notes"
                required
              />
            </label>

            <label>
              Course
              <select name="course_id" value={formData.course_id} onChange={handleChange}>
                <option value="">No course selected</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Source Type
              <select name="source_type" value={formData.source_type} onChange={handleChange}>
                {sourceTypeOptions.map((sourceType) => (
                  <option key={sourceType} value={sourceType}>
                    {sourceType}
                  </option>
                ))}
              </select>
            </label>

            <label className="span-2">
              Study Content
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="9"
                placeholder="Paste notes, definitions, formulas, or study guide content here."
                required
              />
            </label>

            {error ? <p className="error-text span-2">{error}</p> : null}
            {successMessage ? <p className="success-text span-2">{successMessage}</p> : null}

            <div className="button-row span-2">
              <button type="submit" className="button" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Update Material" : "Save Material"}
              </button>

              {editingId ? (
                <button type="button" className="button button-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="card">
          <h3>Saved Materials</h3>

          {materials.length === 0 ? (
            <p className="helper-text">
              No study material saved yet. Add notes here to prepare for flashcards and quizzes.
            </p>
          ) : (
            <div className="list-stack">
              {materials.map((material) => (
                <div key={material.id} className="list-item study-material-item">
                  <div>
                    <strong>{material.title}</strong>
                    <p>{courseNameMap[material.course_id] || "General study material"}</p>
                    <p>{material.source_type}</p>
                    <p className="material-preview">{material.content}</p>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleEdit(material)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => handleDelete(material.id)}
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
