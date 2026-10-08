import { useContext } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

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

      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            user_id: user.id,
            topic_name: values.topic_name.trim(),
            total_chapters: Number(values.total_chapters),
            status: "in progress",
          },
        ])
        .select()
        .single();

      const newCourses = [...courses, data];
      saveCourses(newCourses);
    } catch (err) {
      setStatus(err.message || "Failed to add course");
    } finally {
      setSubmitting(false);
      setShowAddCourse(!showAddCourse);
    }
  };

  return showAddCourse ? (
    <div
      onClick={() => {
        setShowAddCourse(!showAddCourse);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-Typography-secondary/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface-panel p-6 shadow-xl"
      >
        <h2 className="text-xl font-bold text-Typography-primary mb-4">
          Add Course
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={courseValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <Form className="flex flex-col gap-4">
              {status && (
                <div className="p-3 text-sm text-phase-focus bg-phase-focus/10 rounded-xl">
                  {status}
                </div>
              )}

              <InputGroup
                name="topic_name"
                placeholder="Topic Name (e.g. Computer Science)"
                error={touched.topic_name && errors.topic_name}
              />

              <InputGroup
                name="total_chapters"
                type="number"
                placeholder="Number of chapters (e.g. 16)"
                error={touched.total_chapters && errors.total_chapters}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCourse(!showAddCourse);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-surface-border text-Typography-secondary hover:bg-surface-bg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#00c950] hover:bg-[#00b347] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? "Adding..." : "Add Course"}
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
