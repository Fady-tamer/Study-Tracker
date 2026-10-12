import { useContext, useEffect, useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

// components
import InputGroup from "../InputGroup";

// database
import { supabase } from "../../supabaseClient";

// context
import { mainStore } from "../../context/MainContext";

// 1. Validation Schema
const assignmentsValidationSchema = Yup.object().shape({
  assignment_name: Yup.string().trim().required("Assignment name is required"),
  course_id: Yup.string().required("Please select a course"),
  deadline: Yup.date().required("Deadline is required"),
});

const AddAssignment = () => {
  const {
    courses,
    assignments,
    saveAssignments,
    showAddAssignment,
    setShowAddAssignment,
    addAssignmentInitialDate,
    setAddAssignmentInitialDate,
  } = useContext(mainStore);

  const [coursesList, setCoursesList] = useState(() => courses || []);

  const handleClose = () => {
    setShowAddAssignment(false);
    if (setAddAssignmentInitialDate) setAddAssignmentInitialDate("");
  };

  useEffect(() => {
    if (courses?.length > 0) {
      setCoursesList(courses);
    }

    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, topic_name");

      if (!error && data) {
        setCoursesList(data);
      }
    };

    if (showAddAssignment) {
      fetchCourses();
    }
  }, [showAddAssignment, courses]);

  const initialValues = {
    assignment_name: "",
    course_id: "",
    deadline: addAssignmentInitialDate || "",
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const isoDeadline = values.deadline
        ? new Date(values.deadline).toISOString()
        : null;

      const { data, error } = await supabase
        .from("assignments")
        .insert([
          {
            user_id: user.id,
            assignment_name: values.assignment_name.trim(),
            course_id: values.course_id,
            deadline: isoDeadline,
            isDone: false,
          },
        ])
        .select(
          `
            id,
            assignment_name,
            deadline,
            isDone,
            courses (
              id,
              topic_name
            )
          `,
        )
        .single();

      if (error) throw error;

      const newAssignment = [...(assignments || []), data];
      saveAssignments(newAssignment);
      handleClose();
      toast.success("Assignment scheduled successfully!");
    } catch (err) {
      setStatus(err.message || "Failed to add assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return showAddAssignment ? (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-Typography-primary font-['Outfit']">
              Add New Assignment
            </h2>
            <p className="text-xs text-Typography-muted">
              Schedule homework, deliverables, and exams
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={assignmentsValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <Form className="flex flex-col gap-4">
              {status && (
                <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                  {status}
                </div>
              )}

              <InputGroup
                name="assignment_name"
                label="Assignment Title"
                placeholder="e.g. Chapter 4 Problem Set, Midterm Prep"
                error={touched.assignment_name && errors.assignment_name}
              />

              {/* Course Selection Dropdown */}
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="course_id" className="text-xs font-bold text-Typography-secondary">
                  Associated Course
                </label>
                <Field
                  as="select"
                  id="course_id"
                  name="course_id"
                  className={`w-full rounded-xl px-4 py-3 text-sm text-Typography-primary transition-all focus:outline-none ${
                    touched.course_id && errors.course_id
                      ? "border border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                      : "border border-surface-border bg-slate-50/80 hover:border-slate-300 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 shadow-xs"
                  }`}
                >
                  <option value="">Select a Course...</option>
                  {coursesList.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.topic_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="course_id">
                  {(msg) => (
                    <div className="px-1 text-xs font-semibold text-rose-500">
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <InputGroup
                name="deadline"
                type="datetime-local"
                label="Target Deadline"
                placeholder="Deadline"
                error={touched.deadline && errors.deadline}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 mt-4 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-surface-border bg-white text-Typography-secondary hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-brand-primary/25 active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "Save Assignment"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  ) : null;
};

export default AddAssignment;
