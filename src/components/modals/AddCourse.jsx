import { useContext } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

// components
import InputGroup from "../InputGroup";

// database
import { supabase } from "../../supabaseClient";

// context
import { mainStore } from "../../context/MainContext";

// 1. Validation Schema
const courseValidationSchema = Yup.object().shape({
  topic_name: Yup.string()
    .trim()
    .min(2, "Topic name is too short")
    .required("Topic name is required"),
  total_chapters: Yup.number()
    .typeError("Must be a valid integer")
    .integer("Chapters must be a whole number")
    .min(1, "Must have at least 1 chapter")
    .required("Number of chapters is required"),
});

const AddCourse = () => {
  const { courses, saveCourses, showAddCourse, setShowAddCourse } =
    useContext(mainStore);

  const initialValues = {
    topic_name: "",
    total_chapters: "",
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user)
        throw new Error("User session not found. Please log in again.");

      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            user_id: user.id,
            topic_name: values.topic_name.trim(),
            total_chapters: Number(values.total_chapters),
            done_chapters: 0,
            total_time: 0,
            status: "In Progress",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update state and close modal ONLY on success
      const newCourses = [...(courses || []), data];
      saveCourses(newCourses);
      setShowAddCourse(false);
      toast.success("Course added successfully!");
    } catch (err) {
      setStatus(err.message || "Failed to add course");
    } finally {
      setSubmitting(false);
    }
  };

  return showAddCourse ? (
    <div
      onClick={() => setShowAddCourse(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-Typography-primary font-['Outfit']">
              Add New Course
            </h2>
            <p className="text-xs text-Typography-muted">
              Add a curriculum to track chapters and time
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddCourse(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={courseValidationSchema}
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
                name="topic_name"
                label="Course Topic Name"
                placeholder="e.g. Computer Science, Organic Chemistry"
                error={touched.topic_name && errors.topic_name}
              />

              <InputGroup
                name="total_chapters"
                type="number"
                label="Number of Chapters"
                placeholder="e.g. 12"
                error={touched.total_chapters && errors.total_chapters}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 mt-4 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-border bg-white text-Typography-secondary hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-brand-primary/25 active:scale-95"
                >
                  {isSubmitting ? "Creating..." : "Create Course"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  ) : null;
};

export default AddCourse;
