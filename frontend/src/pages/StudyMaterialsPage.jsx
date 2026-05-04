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

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function formatSourceType(sourceType) {
  return sourceType
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getMaterialReadiness(wordCount) {
  if (wordCount >= 40) {
    return "AI-ready";
  }

  if (wordCount >= 15) {
    return "Needs more detail";
  }

  return "Short note";
}

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
  const formWordCount = countWords(formData.content);
  const totalWordCount = materials.reduce(
    (total, material) => total + countWords(material.content),
    0,
  );
  const linkedMaterialCount = materials.filter((material) => material.course_id).length;

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

      <div className="study-material-stats">
        <div className="mini-summary-card">
          <span>Saved Materials</span>
          <strong>{materials.length}</strong>
        </div>
        <div className="mini-summary-card">
          <span>Total Words</span>
          <strong>{totalWordCount}</strong>
        </div>
        <div className="mini-summary-card">
          <span>Linked to Courses</span>
          <strong>{linkedMaterialCount}</strong>
        </div>
      </div>

      <div className="schedule-grid">
        <article className="card">
          <h3>{editingId ? "Edit Study Material" : "Add Study Material"}</h3>
          <p className="helper-text">
            Add enough detail for StudyFlow to later turn this into flashcards, quizzes, and AI
            recommendations.
          </p>

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
              <span className="field-hint">
                {formWordCount} word{formWordCount === 1 ? "" : "s"} entered
              </span>
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
          <p className="helper-text">
            These notes now feed the recommendation engine, so richer material gives stronger study
            guidance.
          </p>

          {materials.length === 0 ? (
            <p className="helper-text">
              No study material saved yet. Add notes here to prepare for flashcards and quizzes.
            </p>
          ) : (
            <div className="list-stack">
              {materials.map((material) => (
                <div key={material.id} className="study-material-card">
                  <div className="study-material-card-header">
                    <div>
                      <strong>{material.title}</strong>
                      <p>{courseNameMap[material.course_id] || "General study material"}</p>
                    </div>
                    <span className="readiness-pill">
                      {getMaterialReadiness(countWords(material.content))}
                    </span>
                  </div>

                  <div className="material-meta-row">
                    <span>{formatSourceType(material.source_type)}</span>
                    <span>{countWords(material.content)} words</span>
                    <span>AI context enabled</span>
                  </div>

                  <p className="material-preview">{material.content}</p>

                  <div className="study-material-actions">
                    <p className="helper-text">Next: convert key ideas into flashcards or quiz questions.</p>

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
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
